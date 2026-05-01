import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, FileText, Film, Package, Plus, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/courses/$id")({
  component: AdminCourseLessons,
});

type Lesson = {
  id: string;
  title: string;
  type: string;
  position: number;
  content_url: string | null;
};

const TYPES = [
  { value: "video", label: "Video", icon: Film },
  { value: "scorm", label: "SCORM", icon: Package },
  { value: "pdf", label: "PDF", icon: FileText },
];

function AdminCourseLessons() {
  const { id } = Route.useParams();
  const [course, setCourse] = useState<{ title: string; slug: string } | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [{ data: c }, { data: l }] = await Promise.all([
      supabase.from("courses").select("title, slug").eq("id", id).single(),
      supabase.from("lessons").select("*").eq("course_id", id).order("position", { ascending: true }),
    ]);
    setCourse(c);
    setLessons((l as Lesson[]) ?? []);
  };
  useEffect(() => { load(); }, [id]);

  const addLesson = async () => {
    if (!title.trim()) return toast.error("Lesson title required");
    const file = fileRef.current?.files?.[0];
    let content_url: string | null = null;

    if (file) {
      setUploading(true);
      const path = `${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("lesson-content").upload(path, file);
      if (upErr) {
        setUploading(false);
        return toast.error(upErr.message);
      }
      const { data: pub } = supabase.storage.from("lesson-content").getPublicUrl(path);
      content_url = pub.publicUrl;
      setUploading(false);
    }

    const nextPos = (lessons?.length ?? 0) + 1;
    const { error } = await supabase.from("lessons").insert({
      course_id: id, title, type, position: nextPos, content_url,
    });
    if (error) return toast.error(error.message);
    toast.success("Lesson added");
    setTitle("");
    if (fileRef.current) fileRef.current.value = "";
    load();
  };

  const remove = async (lesson: Lesson) => {
    if (!confirm(`Delete "${lesson.title}"?`)) return;
    if (lesson.content_url) {
      const m = lesson.content_url.match(/lesson-content\/(.+)$/);
      if (m) await supabase.storage.from("lesson-content").remove([m[1]]);
    }
    const { error } = await supabase.from("lessons").delete().eq("id", lesson.id);
    if (error) return toast.error(error.message);
    toast.success("Lesson removed");
    load();
  };

  const move = async (lesson: Lesson, dir: -1 | 1) => {
    if (!lessons) return;
    const idx = lessons.findIndex((l) => l.id === lesson.id);
    const swap = lessons[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("lessons").update({ position: swap.position }).eq("id", lesson.id),
      supabase.from("lessons").update({ position: lesson.position }).eq("id", swap.id),
    ]);
    load();
  };

  return (
    <div>
      <Link to="/admin/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>
      <h2 className="mt-3 font-display text-2xl font-bold">{course?.title ?? "Course"}</h2>
      <p className="text-xs text-muted-foreground">/{course?.slug}</p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-display text-lg font-semibold">Add a lesson</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px_auto]">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Intro to Variables" />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Content file</Label>
            <Input
              ref={fileRef}
              type="file"
              accept={type === "video" ? "video/*" : type === "pdf" ? "application/pdf" : ".zip,application/zip"}
            />
          </div>
        </div>
        <Button onClick={addLesson} disabled={uploading} className="mt-5 gradient-beam text-primary-foreground glow-beam rounded-full">
          {uploading ? <><Upload className="mr-2 h-4 w-4 animate-pulse" />Uploading…</> : <><Plus className="mr-2 h-4 w-4" />Add lesson</>}
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        {lessons === null && <div className="p-10 text-center text-muted-foreground">Loading…</div>}
        {lessons?.length === 0 && <div className="p-10 text-center text-muted-foreground">No lessons yet.</div>}
        {lessons?.map((l, i) => {
          const meta = TYPES.find((t) => t.value === l.type);
          const Icon = meta?.icon ?? FileText;
          return (
            <div key={l.id} className="flex flex-wrap items-center gap-4 border-b border-border bg-surface p-4 last:border-b-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-beam/30 bg-beam/10 text-beam">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{l.position}. {l.title}</div>
                <div className="text-xs text-muted-foreground">
                  {meta?.label}{l.content_url ? " · file uploaded" : " · no file"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => move(l, -1)} disabled={i === 0}>↑</Button>
                <Button variant="ghost" size="sm" onClick={() => move(l, 1)} disabled={i === (lessons.length - 1)}>↓</Button>
                {l.content_url && (
                  <a href={l.content_url} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="rounded-full">Preview</Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" onClick={() => remove(l)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
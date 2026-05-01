import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/admin/courses")({
  component: AdminCourses,
});

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  level: string;
  price: number;
  duration_hours: number;
  is_published: boolean;
};

const empty: Omit<Course, "id"> = {
  title: "", slug: "", description: "", level: "beginner",
  price: 0, duration_hours: 0, is_published: false,
};

function AdminCourses() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [editing, setEditing] = useState<Course | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Course, "id">>(empty);

  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setCourses((data as Course[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({ ...c, description: c.description ?? "" });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim()) return toast.error("Title and slug are required");
    const payload = { ...form, price: Number(form.price), duration_hours: Number(form.duration_hours) };
    const res = editing
      ? await supabase.from("courses").update(payload).eq("id", editing.id)
      : await supabase.from("courses").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Course updated" : "Course created");
    setOpen(false);
    load();
  };

  const remove = async (c: Course) => {
    if (!confirm(`Delete "${c.title}"? This also removes its lessons.`)) return;
    await supabase.from("lessons").delete().eq("course_id", c.id);
    const { error } = await supabase.from("courses").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Course deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Courses</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-beam text-primary-foreground glow-beam rounded-full">
              <Plus className="mr-2 h-4 w-4" /> New course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit course" : "Create course"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label>Level</Label>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Hours</Label>
                  <Input type="number" min={0} value={form.duration_hours}
                    onChange={(e) => setForm({ ...form, duration_hours: Number(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Price (USD)</Label>
                  <Input type="number" min={0} step="0.01" value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                Published (visible to students)
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} className="gradient-beam text-primary-foreground">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        {courses === null && <div className="p-10 text-center text-muted-foreground">Loading…</div>}
        {courses?.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">No courses yet. Create your first one.</div>
        )}
        {courses?.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-4 border-b border-border bg-surface p-4 last:border-b-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-beam/30 bg-beam/10 text-beam">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{c.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                  c.is_published ? "bg-beam/15 text-beam" : "bg-muted text-muted-foreground"
                }`}>
                  {c.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">/{c.slug} · {c.level} · {c.duration_hours}h · ${Number(c.price).toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/courses/$id" params={{ id: c.id }}>
                <Button variant="outline" size="sm" className="rounded-full">Manage lessons</Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(c)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
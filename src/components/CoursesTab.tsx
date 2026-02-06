import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { extractRecordId, createRecordUrl } from "@/services/livingAppsService";
import { APP_IDS } from "@/types/app";
import type { Courses, Instructors, Rooms } from "@/types/app";

interface CoursesTabProps {
  courses: Courses[];
  instructors: Instructors[];
  rooms: Rooms[];
  loading: boolean;
  onAdd: (data: Courses["fields"]) => Promise<void>;
  onUpdate: (id: string, data: Partial<Courses["fields"]>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  max_participants: 0,
  price: 0,
  instructor: "",
  room: "",
};

export function CoursesTab({ courses, instructors, rooms, loading, onAdd, onUpdate, onDelete }: CoursesTabProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Courses | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = courses.filter((c) =>
    (c.fields.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (c.fields.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (course: Courses) => {
    setEditing(course);
    setForm({
      title: course.fields.title ?? "",
      description: course.fields.description ?? "",
      start_date: course.fields.start_date ?? "",
      end_date: course.fields.end_date ?? "",
      max_participants: course.fields.max_participants ?? 0,
      price: course.fields.price ?? 0,
      instructor: extractRecordId(course.fields.instructor) ?? "",
      room: extractRecordId(course.fields.room) ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fields: Courses["fields"] = {
        title: form.title,
        description: form.description,
        start_date: form.start_date,
        end_date: form.end_date,
        max_participants: form.max_participants,
        price: form.price,
        instructor: form.instructor ? createRecordUrl(APP_IDS.INSTRUCTORS, form.instructor) : undefined,
        room: form.room ? createRecordUrl(APP_IDS.ROOMS, form.room) : undefined,
      };
      if (editing) {
        await onUpdate(editing.record_id, fields);
      } else {
        await onAdd(fields);
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const getInstructorName = (url?: string) => {
    const id = extractRecordId(url);
    if (!id) return "\u2013";
    const inst = instructors.find((i) => i.record_id === id);
    return inst?.fields.name ?? "\u2013";
  };

  const getRoomName = (url?: string) => {
    const id = extractRecordId(url);
    if (!id) return "\u2013";
    const room = rooms.find((r) => r.record_id === id);
    return room ? `${room.fields.room_name} (${room.fields.building ?? ""})` : "\u2013";
  };

  const formatDate = (d?: string) => {
    if (!d) return "\u2013";
    try {
      return format(new Date(d), "dd. MMM yyyy", { locale: de });
    } catch {
      return d;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Kurse durchsuchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" />
          Neuer Kurs
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-muted-foreground">
          <p className="text-sm">Noch keine Kurse vorhanden</p>
          <Button variant="outline" className="mt-3 gap-2" onClick={openAdd}>
            <Plus className="size-4" />
            Ersten Kurs anlegen
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Titel</TableHead>
                <TableHead className="hidden sm:table-cell">Dozent</TableHead>
                <TableHead className="hidden md:table-cell">Raum</TableHead>
                <TableHead className="hidden lg:table-cell">Zeitraum</TableHead>
                <TableHead className="text-right">Preis</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Max. TN</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((course) => (
                <TableRow key={course.record_id}>
                  <TableCell>
                    <div>
                      <p className="font-600">{course.fields.title}</p>
                      {course.fields.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {course.fields.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary">{getInstructorName(course.fields.instructor)}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {getRoomName(course.fields.room)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {formatDate(course.fields.start_date)} – {formatDate(course.fields.end_date)}
                  </TableCell>
                  <TableCell className="text-right font-600">
                    {(course.fields.price ?? 0) > 0 ? `${(course.fields.price ?? 0).toFixed(2)} \u20AC` : "\u2013"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    {course.fields.max_participants ?? 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(course)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(course.record_id)}>
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Kurs bearbeiten" : "Neuer Kurs"}</DialogTitle>
            <DialogDescription>
              {editing ? "Kursdaten aktualisieren" : "Einen neuen Kurs anlegen"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Titel *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Beschreibung</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Startdatum *</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Enddatum *</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Max. Teilnehmer</Label>
                <Input type="number" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label>Preis (EUR)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Dozent</Label>
                <Select value={form.instructor} onValueChange={(v) => setForm({ ...form, instructor: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Auswahlen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((i) => (
                      <SelectItem key={i.record_id} value={i.record_id}>{i.fields.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Raum</Label>
                <Select value={form.room} onValueChange={(v) => setForm({ ...form, room: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Auswahlen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => (
                      <SelectItem key={r.record_id} value={r.record_id}>{r.fields.room_name} ({r.fields.building})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.start_date || !form.end_date}>
              {saving ? "Speichern..." : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kurs loschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht ruckgangig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Loschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

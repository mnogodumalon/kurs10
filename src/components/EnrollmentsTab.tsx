import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Plus, Pencil, Trash2, Search, CheckCircle2, XCircle } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { extractRecordId, createRecordUrl } from "@/services/livingAppsService";
import { APP_IDS } from "@/types/app";
import type { Enrollments, Courses, Participants } from "@/types/app";

interface EnrollmentsTabProps {
  enrollments: Enrollments[];
  courses: Courses[];
  participants: Participants[];
  loading: boolean;
  onAdd: (data: Enrollments["fields"]) => Promise<void>;
  onUpdate: (id: string, data: Partial<Enrollments["fields"]>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = { participant: "", course: "", enrollment_date: "", paid: false };

export function EnrollmentsTab({ enrollments, courses, participants, loading, onAdd, onUpdate, onDelete }: EnrollmentsTabProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Enrollments | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const getCourseName = (url?: string) => {
    const id = extractRecordId(url);
    if (!id) return "\u2013";
    return courses.find((c) => c.record_id === id)?.fields.title ?? "\u2013";
  };

  const getParticipantName = (url?: string) => {
    const id = extractRecordId(url);
    if (!id) return "\u2013";
    return participants.find((p) => p.record_id === id)?.fields.name ?? "\u2013";
  };

  const filtered = enrollments.filter(
    (e) =>
      getCourseName(e.fields.course).toLowerCase().includes(search.toLowerCase()) ||
      getParticipantName(e.fields.participant).toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, enrollment_date: new Date().toISOString().split("T")[0] });
    setDialogOpen(true);
  };

  const openEdit = (e: Enrollments) => {
    setEditing(e);
    setForm({
      participant: extractRecordId(e.fields.participant) ?? "",
      course: extractRecordId(e.fields.course) ?? "",
      enrollment_date: e.fields.enrollment_date ?? "",
      paid: e.fields.paid ?? false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fields: Enrollments["fields"] = {
        participant: form.participant ? createRecordUrl(APP_IDS.PARTICIPANTS, form.participant) : undefined,
        course: form.course ? createRecordUrl(APP_IDS.COURSES, form.course) : undefined,
        enrollment_date: form.enrollment_date || undefined,
        paid: form.paid,
      };
      if (editing) await onUpdate(editing.record_id, fields);
      else await onAdd(fields);
      setDialogOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (deleteId) { await onDelete(deleteId); setDeleteId(null); }
  };

  const handleTogglePaid = async (enrollment: Enrollments) => {
    await onUpdate(enrollment.record_id, { paid: !enrollment.fields.paid });
  };

  const formatDate = (d?: string) => {
    if (!d) return "\u2013";
    try { return format(new Date(d), "dd.MM.yyyy", { locale: de }); }
    catch { return d; }
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
          <Input placeholder="Anmeldungen durchsuchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" />
          Neue Anmeldung
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-muted-foreground">
          <p className="text-sm">Noch keine Anmeldungen vorhanden</p>
          <Button variant="outline" className="mt-3 gap-2" onClick={openAdd}>
            <Plus className="size-4" />
            Erste Anmeldung anlegen
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Teilnehmer</TableHead>
                <TableHead>Kurs</TableHead>
                <TableHead className="hidden sm:table-cell">Anmeldedatum</TableHead>
                <TableHead>Bezahlt</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.record_id}>
                  <TableCell className="font-600">{getParticipantName(e.fields.participant)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getCourseName(e.fields.course)}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{formatDate(e.fields.enrollment_date)}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleTogglePaid(e)}
                      className="flex items-center gap-1.5 text-sm cursor-pointer"
                    >
                      {e.fields.paid ? (
                        <CheckCircle2 className="size-4 text-success" />
                      ) : (
                        <XCircle className="size-4 text-destructive" />
                      )}
                      <span className={e.fields.paid ? "text-success" : "text-destructive"}>
                        {e.fields.paid ? "Ja" : "Nein"}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(e)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(e.record_id)}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Anmeldung bearbeiten" : "Neue Anmeldung"}</DialogTitle>
            <DialogDescription>{editing ? "Anmeldedaten aktualisieren" : "Eine neue Anmeldung erstellen"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Teilnehmer *</Label>
              <Select value={form.participant} onValueChange={(v) => setForm({ ...form, participant: v })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Auswahlen..." />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.record_id} value={p.record_id}>{p.fields.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Kurs *</Label>
              <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Auswahlen..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.record_id} value={c.record_id}>{c.fields.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Anmeldedatum</Label>
              <Input type="date" value={form.enrollment_date} onChange={(e) => setForm({ ...form, enrollment_date: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="paid"
                checked={form.paid}
                onCheckedChange={(checked) => setForm({ ...form, paid: checked === true })}
              />
              <Label htmlFor="paid">Bezahlt</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSave} disabled={saving || !form.participant || !form.course}>
              {saving ? "Speichern..." : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anmeldung loschen?</AlertDialogTitle>
            <AlertDialogDescription>Diese Aktion kann nicht ruckgangig gemacht werden.</AlertDialogDescription>
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

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Plus, Pencil, Trash2, Search, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import type { Participants } from "@/types/app";

interface ParticipantsTabProps {
  participants: Participants[];
  loading: boolean;
  onAdd: (data: Participants["fields"]) => Promise<void>;
  onUpdate: (id: string, data: Partial<Participants["fields"]>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = { name: "", email: "", phone: "", birth_date: "" };

export function ParticipantsTab({ participants, loading, onAdd, onUpdate, onDelete }: ParticipantsTabProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Participants | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = participants.filter(
    (p) =>
      (p.fields.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.fields.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (p: Participants) => {
    setEditing(p);
    setForm({
      name: p.fields.name ?? "",
      email: p.fields.email ?? "",
      phone: p.fields.phone ?? "",
      birth_date: p.fields.birth_date ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fields: Participants["fields"] = {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        birth_date: form.birth_date || undefined,
      };
      if (editing) await onUpdate(editing.record_id, fields);
      else await onAdd(fields);
      setDialogOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (deleteId) { await onDelete(deleteId); setDeleteId(null); }
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
          <Input placeholder="Teilnehmer durchsuchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" />
          Neuer Teilnehmer
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-muted-foreground">
          <p className="text-sm">Noch keine Teilnehmer vorhanden</p>
          <Button variant="outline" className="mt-3 gap-2" onClick={openAdd}>
            <Plus className="size-4" />
            Ersten Teilnehmer anlegen
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Kontakt</TableHead>
                <TableHead className="hidden md:table-cell">Geburtsdatum</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.record_id}>
                  <TableCell className="font-600">{p.fields.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      {p.fields.email && <span className="flex items-center gap-1"><Mail className="size-3" />{p.fields.email}</span>}
                      {p.fields.phone && <span className="flex items-center gap-1"><Phone className="size-3" />{p.fields.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{formatDate(p.fields.birth_date)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(p.record_id)}>
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
            <DialogTitle>{editing ? "Teilnehmer bearbeiten" : "Neuer Teilnehmer"}</DialogTitle>
            <DialogDescription>{editing ? "Teilnehmerdaten aktualisieren" : "Einen neuen Teilnehmer anlegen"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>E-Mail</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Telefon</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Geburtsdatum</Label>
              <Input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSave} disabled={saving || !form.name}>{saving ? "Speichern..." : "Speichern"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Teilnehmer loschen?</AlertDialogTitle>
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

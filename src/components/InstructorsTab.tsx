import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Mail, Phone } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import type { Instructors } from "@/types/app";

interface InstructorsTabProps {
  instructors: Instructors[];
  loading: boolean;
  onAdd: (data: Instructors["fields"]) => Promise<void>;
  onUpdate: (id: string, data: Partial<Instructors["fields"]>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = { name: "", email: "", phone: "", specialty: "" };

export function InstructorsTab({ instructors, loading, onAdd, onUpdate, onDelete }: InstructorsTabProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Instructors | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = instructors.filter(
    (i) =>
      (i.fields.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (i.fields.specialty ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (inst: Instructors) => {
    setEditing(inst);
    setForm({
      name: inst.fields.name ?? "",
      email: inst.fields.email ?? "",
      phone: inst.fields.phone ?? "",
      specialty: inst.fields.specialty ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fields: Instructors["fields"] = {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        specialty: form.specialty || undefined,
      };
      if (editing) await onUpdate(editing.record_id, fields);
      else await onAdd(fields);
      setDialogOpen(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (deleteId) { await onDelete(deleteId); setDeleteId(null); }
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
          <Input placeholder="Dozenten durchsuchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" />
          Neuer Dozent
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-muted-foreground">
          <p className="text-sm">Noch keine Dozenten vorhanden</p>
          <Button variant="outline" className="mt-3 gap-2" onClick={openAdd}>
            <Plus className="size-4" />
            Ersten Dozent anlegen
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Fachgebiet</TableHead>
                <TableHead className="hidden sm:table-cell">Kontakt</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inst) => (
                <TableRow key={inst.record_id}>
                  <TableCell className="font-600">{inst.fields.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{inst.fields.specialty || "\u2013"}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      {inst.fields.email && (
                        <span className="flex items-center gap-1"><Mail className="size-3" />{inst.fields.email}</span>
                      )}
                      {inst.fields.phone && (
                        <span className="flex items-center gap-1"><Phone className="size-3" />{inst.fields.phone}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(inst)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(inst.record_id)}>
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
            <DialogTitle>{editing ? "Dozent bearbeiten" : "Neuer Dozent"}</DialogTitle>
            <DialogDescription>{editing ? "Dozentendaten aktualisieren" : "Einen neuen Dozenten anlegen"}</DialogDescription>
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
              <Label>Fachgebiet</Label>
              <Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
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
            <AlertDialogTitle>Dozent loschen?</AlertDialogTitle>
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

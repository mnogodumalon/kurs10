import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import type { Rooms } from "@/types/app";

interface RoomsTabProps {
  rooms: Rooms[];
  loading: boolean;
  onAdd: (data: Rooms["fields"]) => Promise<void>;
  onUpdate: (id: string, data: Partial<Rooms["fields"]>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyForm = { room_name: "", building: "", capacity: 0 };

export function RoomsTab({ rooms, loading, onAdd, onUpdate, onDelete }: RoomsTabProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Rooms | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = rooms.filter(
    (r) =>
      (r.fields.room_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.fields.building ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (r: Rooms) => {
    setEditing(r);
    setForm({
      room_name: r.fields.room_name ?? "",
      building: r.fields.building ?? "",
      capacity: r.fields.capacity ?? 0,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fields: Rooms["fields"] = {
        room_name: form.room_name,
        building: form.building || undefined,
        capacity: form.capacity || undefined,
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
          <Input placeholder="Raume durchsuchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="size-4" />
          Neuer Raum
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-muted-foreground">
          <p className="text-sm">Noch keine Raume vorhanden</p>
          <Button variant="outline" className="mt-3 gap-2" onClick={openAdd}>
            <Plus className="size-4" />
            Ersten Raum anlegen
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Raumname</TableHead>
                <TableHead>Gebaude</TableHead>
                <TableHead className="text-right">Kapazitat</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.record_id}>
                  <TableCell className="font-600">{r.fields.room_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.fields.building || "\u2013"}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-600">{r.fields.capacity ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(r)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(r.record_id)}>
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
            <DialogTitle>{editing ? "Raum bearbeiten" : "Neuer Raum"}</DialogTitle>
            <DialogDescription>{editing ? "Raumdaten aktualisieren" : "Einen neuen Raum anlegen"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Raumname *</Label>
              <Input value={form.room_name} onChange={(e) => setForm({ ...form, room_name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Gebaude</Label>
              <Input value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Kapazitat</Label>
              <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSave} disabled={saving || !form.room_name}>{saving ? "Speichern..." : "Speichern"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Raum loschen?</AlertDialogTitle>
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

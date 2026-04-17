"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useUsersQuery } from "@/features/users/queries/user.query";
import {
  useTransportConfigsQuery,
  useTransportAbonnementsQuery,
  useVersementsTransportQuery,
} from "@/features/transport/queries/transport.query";
import {
  useAjouterTransportConfigMutation,
  useModifierTransportConfigMutation,
  useSupprimerTransportConfigMutation,
  useCreerAbonnementMutation,
  useSupprimerAbonnementMutation,
  useAjouterVersementTransportMutation,
} from "@/features/transport/mutations/transport.mutation";
import {
  TransportConfig,
  TransportConfigAddDTO,
  TransportAbonnement,
  TypeAbonnement,
  TYPE_ABONNEMENT_LABELS,
  TRANSPORT_STATUT_LABELS,
  TRANSPORT_STATUT_COLORS,
} from "@/features/transport/types/transport.type";

// ─── Formatters ────────────────────────────────────────────────────────────────
function fmt(n: string | number) {
  return Number(n).toLocaleString("fr-FR") + " FCFA";
}
function pct(paye: string, total: string) {
  const t = Number(total);
  if (!t) return 0;
  return Math.round((Number(paye) / t) * 100);
}

// ─── Config Form ───────────────────────────────────────────────────────────────
const emptyConfig: TransportConfigAddDTO = {
  anneeAcademique: "", montantMensuel: 0, montantAnnuel: 0,
  description: "", isActive: true,
};

interface ConfigFormProps {
  form: TransportConfigAddDTO;
  setForm: React.Dispatch<React.SetStateAction<TransportConfigAddDTO>>;
}

function ConfigForm({ form, setForm }: ConfigFormProps) {
  return (
    <div className="space-y-3 py-2">
      <div className="space-y-1.5">
        <Label>Année académique *</Label>
        <Input placeholder="2025-2026" value={form.anneeAcademique}
          onChange={(e) => setForm((f) => ({ ...f, anneeAcademique: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Montant mensuel (FCFA) *</Label>
          <Input type="number" placeholder="15000" value={form.montantMensuel || ""}
            onChange={(e) => setForm((f) => ({ ...f, montantMensuel: Number(e.target.value) }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Montant annuel (FCFA) *</Label>
          <Input type="number" placeholder="150000" value={form.montantAnnuel || ""}
            onChange={(e) => setForm((f) => ({ ...f, montantAnnuel: Number(e.target.value) }))} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea placeholder="Description optionnelle" value={form.description ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
      </div>
      <div className="space-y-1.5">
        <Label>Statut</Label>
        <Select value={form.isActive ? "true" : "false"}
          onValueChange={(v) => setForm((f) => ({ ...f, isActive: v === "true" }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ─── Versements Dialog ─────────────────────────────────────────────────────────
function VersementsDialog({
  abonnement, open, onClose,
}: { abonnement: TransportAbonnement | null; open: boolean; onClose: () => void }) {
  const { data: versements, isLoading } = useVersementsTransportQuery(abonnement?.id ?? "");
  const ajouterVersement = useAjouterVersementTransportMutation();
  const [form, setForm] = useState({ montant: "", datePaiement: "", moisConcerne: "", motif: "" });

  const restant = abonnement
    ? Number(abonnement.montantTotal) - Number(abonnement.montantPaye)
    : 0;

  const handleAdd = async () => {
    if (!abonnement || !form.montant || !form.datePaiement) {
      toast.error("Montant et date requis");
      return;
    }
    try {
      await ajouterVersement.mutateAsync({
        transportAbonnementId: abonnement.id,
        montant: Number(form.montant),
        datePaiement: form.datePaiement,
        moisConcerne: form.moisConcerne || undefined,
        motif: form.motif || undefined,
      });
      toast.success("Versement enregistré");
      setForm({ montant: "", datePaiement: "", moisConcerne: "", motif: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Versements transport — {abonnement?.user?.firstName} {abonnement?.user?.lastName}
          </DialogTitle>
        </DialogHeader>

        {abonnement && (
          <div className="flex gap-4 text-sm py-2 border-b flex-wrap">
            <div><span className="text-muted-foreground">Type : </span><strong>{TYPE_ABONNEMENT_LABELS[abonnement.typeAbonnement]}</strong></div>
            <div><span className="text-muted-foreground">Total : </span><strong>{fmt(abonnement.montantTotal)}</strong></div>
            <div><span className="text-muted-foreground">Payé : </span><strong className="text-green-600">{fmt(abonnement.montantPaye)}</strong></div>
            <div><span className="text-muted-foreground">Restant : </span><strong className="text-red-600">{fmt(restant)}</strong></div>
          </div>
        )}

        <div className="max-h-40 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Mois</TableHead>
                <TableHead>Motif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground text-sm">Chargement…</TableCell></TableRow>
              ) : (versements ?? []).length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-4 text-muted-foreground text-sm">Aucun versement</TableCell></TableRow>
              ) : (versements ?? []).map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="text-sm">{new Date(v.datePaiement).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="font-medium text-sm">{fmt(v.montant)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{v.moisConcerne ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{v.motif ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t pt-3 space-y-3">
          <p className="text-sm font-medium">Nouveau versement</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Montant (FCFA) *</Label>
              <Input type="number" placeholder="15000" value={form.montant}
                onChange={(e) => setForm((f) => ({ ...f, montant: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Date *</Label>
              <Input type="date" value={form.datePaiement}
                onChange={(e) => setForm((f) => ({ ...f, datePaiement: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Mois concerné</Label>
              <Input placeholder="Janvier 2026" value={form.moisConcerne}
                onChange={(e) => setForm((f) => ({ ...f, moisConcerne: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Motif</Label>
              <Input placeholder="Motif" value={form.motif}
                onChange={(e) => setForm((f) => ({ ...f, motif: e.target.value }))} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Fermer</Button></DialogClose>
          <Button onClick={handleAdd} disabled={ajouterVersement.isPending}>
            <CreditCard className="w-4 h-4 mr-2" />
            {ajouterVersement.isPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
type Tab = "configs" | "abonnements";

export default function TransportPage() {
  const [tab, setTab] = useState<Tab>("configs");

  // Config state
  const [addConfigOpen, setAddConfigOpen] = useState(false);
  const [editConfig, setEditConfig] = useState<TransportConfig | null>(null);
  const [deleteConfig, setDeleteConfig] = useState<TransportConfig | null>(null);
  const [configForm, setConfigForm] = useState<TransportConfigAddDTO>(emptyConfig);

  // Abonnement state
  const [addAboOpen, setAddAboOpen] = useState(false);
  const [deleteAbo, setDeleteAbo] = useState<TransportAbonnement | null>(null);
  const [versementsAbo, setVersementsAbo] = useState<TransportAbonnement | null>(null);
  const [aboForm, setAboForm] = useState({
    userId: "", transportConfigId: "", typeAbonnement: "mensuel" as TypeAbonnement, notes: "",
  });

  const { data: configs, isLoading: loadingConfigs } = useTransportConfigsQuery();
  const { data: abonnements, isLoading: loadingAbo } = useTransportAbonnementsQuery();
  const { data: users } = useUsersQuery();
  const etudiants = (users ?? []).filter((u) => u.role === "etudiant");

  const ajouterConfig = useAjouterTransportConfigMutation();
  const modifierConfig = useModifierTransportConfigMutation();
  const supprimerConfig = useSupprimerTransportConfigMutation();
  const creerAbonnement = useCreerAbonnementMutation();
  const supprimerAbonnement = useSupprimerAbonnementMutation();

  const openAddConfig = () => { setConfigForm(emptyConfig); setAddConfigOpen(true); };
  const openEditConfig = (c: TransportConfig) => {
    setConfigForm({
      anneeAcademique: c.anneeAcademique,
      montantMensuel: c.montantMensuel,
      montantAnnuel: c.montantAnnuel,
      description: c.description ?? "",
      isActive: c.isActive,
    });
    setEditConfig(c);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transport</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gérez les configurations tarifaires et les abonnements des étudiants</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(["configs", "abonnements"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t === "configs" ? "Configurations tarifaires" : "Abonnements"}
          </button>
        ))}
      </div>

      {/* ── Tab: Configurations ── */}
      {tab === "configs" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openAddConfig} className="gap-2">
              <Plus className="w-4 h-4" /> Ajouter une configuration
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Année</TableHead>
                  <TableHead>Mensuel</TableHead>
                  <TableHead>Annuel</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingConfigs ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Chargement…</TableCell></TableRow>
                ) : (configs ?? []).length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Aucune configuration</TableCell></TableRow>
                ) : (configs ?? []).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.anneeAcademique}</TableCell>
                    <TableCell className="font-medium">{fmt(c.montantMensuel)}</TableCell>
                    <TableCell>{fmt(c.montantAnnuel)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{c.description ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline"
                        className={c.isActive ? "bg-green-100 text-green-700 border-green-200" : "text-muted-foreground"}>
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditConfig(c)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteConfig(c)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── Tab: Abonnements ── */}
      {tab === "abonnements" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setAboForm({ userId: "", transportConfigId: "", typeAbonnement: "mensuel", notes: "" }); setAddAboOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" /> Créer un abonnement
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payé</TableHead>
                  <TableHead>Avancement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingAbo ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Chargement…</TableCell></TableRow>
                ) : (abonnements ?? []).length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Aucun abonnement</TableCell></TableRow>
                ) : (abonnements ?? []).map((a) => {
                  const progress = pct(a.montantPaye, a.montantTotal);
                  return (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{a.user?.firstName} {a.user?.lastName}</div>
                        <div className="text-xs text-muted-foreground">{a.user?.email}</div>
                      </TableCell>
                      <TableCell>{a.anneeAcademique}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{TYPE_ABONNEMENT_LABELS[a.typeAbonnement]}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{fmt(a.montantTotal)}</TableCell>
                      <TableCell className="text-green-600 font-medium">{fmt(a.montantPaye)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${TRANSPORT_STATUT_COLORS[a.statut]}`}>
                          {TRANSPORT_STATUT_LABELS[a.statut]}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="Versements" onClick={() => setVersementsAbo(a)}>
                            <CreditCard className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteAbo(a)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── Dialog: Add Config ── */}
      <Dialog open={addConfigOpen} onOpenChange={setAddConfigOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nouvelle configuration transport</DialogTitle></DialogHeader>
          <ConfigForm form={configForm} setForm={setConfigForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() => ajouterConfig.mutate(configForm, {
                onSuccess: () => { setAddConfigOpen(false); toast.success("Configuration ajoutée"); },
                onError: () => toast.error("Erreur lors de l'ajout"),
              })}
              disabled={ajouterConfig.isPending}>
              {ajouterConfig.isPending ? "Ajout…" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Edit Config ── */}
      <Dialog open={!!editConfig} onOpenChange={(o) => !o && setEditConfig(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Modifier la configuration</DialogTitle></DialogHeader>
          <ConfigForm form={configForm} setForm={setConfigForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() => editConfig && modifierConfig.mutate(
                { id: editConfig.id, data: configForm },
                {
                  onSuccess: () => { setEditConfig(null); toast.success("Configuration modifiée"); },
                  onError: () => toast.error("Erreur lors de la modification"),
                },
              )}
              disabled={modifierConfig.isPending}>
              {modifierConfig.isPending ? "Modification…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Delete Config ── */}
      <Dialog open={!!deleteConfig} onOpenChange={(o) => !o && setDeleteConfig(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Supprimer la configuration</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer la configuration{" "}
            <strong>{deleteConfig?.anneeAcademique}</strong> ?
          </p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive"
              onClick={() => deleteConfig && supprimerConfig.mutate(deleteConfig.id, {
                onSuccess: () => { setDeleteConfig(null); toast.success("Configuration supprimée"); },
                onError: () => toast.error("Erreur lors de la suppression"),
              })}
              disabled={supprimerConfig.isPending}>
              {supprimerConfig.isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Create Abonnement ── */}
      <Dialog open={addAboOpen} onOpenChange={setAddAboOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Créer un abonnement</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Étudiant *</Label>
              <Select value={aboForm.userId} onValueChange={(v) => setAboForm((f) => ({ ...f, userId: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir un étudiant" /></SelectTrigger>
                <SelectContent>
                  {etudiants.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Configuration tarifaire *</Label>
              <Select value={aboForm.transportConfigId} onValueChange={(v) => setAboForm((f) => ({ ...f, transportConfigId: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir une configuration" /></SelectTrigger>
                <SelectContent>
                  {(configs ?? []).filter((c) => c.isActive).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.anneeAcademique} — Mensuel: {fmt(c.montantMensuel)} / Annuel: {fmt(c.montantAnnuel)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Type d'abonnement *</Label>
              <Select value={aboForm.typeAbonnement}
                onValueChange={(v) => setAboForm((f) => ({ ...f, typeAbonnement: v as TypeAbonnement }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensuel">Mensuel</SelectItem>
                  <SelectItem value="annuel">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input placeholder="Notes optionnelles" value={aboForm.notes}
                onChange={(e) => setAboForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() => creerAbonnement.mutate(
                {
                  userId: aboForm.userId,
                  transportConfigId: aboForm.transportConfigId,
                  typeAbonnement: aboForm.typeAbonnement,
                  notes: aboForm.notes || undefined,
                },
                {
                  onSuccess: () => { setAddAboOpen(false); toast.success("Abonnement créé"); },
                  onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur"),
                },
              )}
              disabled={creerAbonnement.isPending}>
              {creerAbonnement.isPending ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Delete Abonnement ── */}
      <Dialog open={!!deleteAbo} onOpenChange={(o) => !o && setDeleteAbo(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Supprimer l'abonnement</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Supprimer l'abonnement de{" "}
            <strong>{deleteAbo?.user?.firstName} {deleteAbo?.user?.lastName}</strong> ({deleteAbo?.anneeAcademique}) ?
          </p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive"
              onClick={() => deleteAbo && supprimerAbonnement.mutate(deleteAbo.id, {
                onSuccess: () => { setDeleteAbo(null); toast.success("Abonnement supprimé"); },
                onError: () => toast.error("Erreur lors de la suppression"),
              })}
              disabled={supprimerAbonnement.isPending}>
              {supprimerAbonnement.isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Versements ── */}
      <VersementsDialog
        abonnement={versementsAbo}
        open={!!versementsAbo}
        onClose={() => setVersementsAbo(null)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, CreditCard, CalendarDays } from "lucide-react";
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
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { useUsersQuery } from "@/features/users/queries/user.query";
import {
  useScolariteConfigsQuery,
  useScolaritesQuery,
  useVersementsScolariteQuery,
  useEcheancierConfigQuery,
  useEcheancesEtudiantQuery,
} from "@/features/scolarite/queries/scolarite.query";
import {
  useAjouterScolariteConfigMutation,
  useModifierScolariteConfigMutation,
  useSupprimerScolariteConfigMutation,
  useAjouterEcheancierMutation,
  useSupprimerEcheancierMutation,
  useAssignerScolariteMutation,
  useSupprimerScolariteEtudiantMutation,
  useAjouterVersementScolariteMutation,
} from "@/features/scolarite/mutations/scolarite.mutation";
import {
  ScolariteConfig,
  ScolariteConfigAddDTO,
  ScolariteEtudiant,
  EcheancierConfigAddDTO,
  SCOLARITE_STATUT_LABELS,
  SCOLARITE_STATUT_COLORS,
  ECHEANCE_STATUT_LABELS,
  ECHEANCE_STATUT_COLORS,
} from "@/features/scolarite/types/scolarite.type";

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
interface ConfigFormProps {
  form: ScolariteConfigAddDTO;
  setForm: React.Dispatch<React.SetStateAction<ScolariteConfigAddDTO>>;
}

const emptyConfig: ScolariteConfigAddDTO = {
  anneeAcademique: "", montantTotal: 0, montantInscription: 0,
  nombreVersements: 1, description: "", isActive: true, filiereId: "", niveauId: "",
};

function ConfigForm({ form, setForm }: ConfigFormProps) {
  const { data: filieres } = useFilieresQuery();
  const { data: niveaux } = useNiveauxQuery(form.filiereId ? { filiereId: form.filiereId } : undefined);

  return (
    <div className="space-y-3 py-2">
      <div className="space-y-1.5">
        <Label>Année académique *</Label>
        <Input placeholder="2025-2026" value={form.anneeAcademique}
          onChange={(e) => setForm((f) => ({ ...f, anneeAcademique: e.target.value }))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Montant total (FCFA) *</Label>
          <Input type="number" placeholder="350000" value={form.montantTotal || ""}
            onChange={(e) => setForm((f) => ({ ...f, montantTotal: Number(e.target.value) }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Montant inscription (FCFA) *</Label>
          <Input type="number" placeholder="100000" value={form.montantInscription || ""}
            onChange={(e) => setForm((f) => ({ ...f, montantInscription: Number(e.target.value) }))} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Nombre de versements *</Label>
        <Input type="number" min={1} placeholder="3" value={form.nombreVersements || ""}
          onChange={(e) => setForm((f) => ({ ...f, nombreVersements: Number(e.target.value) }))} />
      </div>
      <div className="space-y-1.5">
        <Label>Filière *</Label>
        <Select value={form.filiereId} onValueChange={(v) => setForm((f) => ({ ...f, filiereId: v, niveauId: "" }))}>
          <SelectTrigger><SelectValue placeholder="Choisir une filière" /></SelectTrigger>
          <SelectContent>
            {(filieres ?? []).map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name} ({f.code})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Niveau *</Label>
        <Select value={form.niveauId} onValueChange={(v) => setForm((f) => ({ ...f, niveauId: v }))} disabled={!form.filiereId}>
          <SelectTrigger><SelectValue placeholder="Choisir un niveau" /></SelectTrigger>
          <SelectContent>
            {(niveaux ?? []).map((n) => (
              <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

// ─── Écheancier Dialog ─────────────────────────────────────────────────────────
function EcheancierDialog({
  config, open, onClose,
}: { config: ScolariteConfig | null; open: boolean; onClose: () => void }) {
  const { data: echeancier, isLoading } = useEcheancierConfigQuery(config?.id ?? "");
  const ajouterEcheancier = useAjouterEcheancierMutation();
  const supprimerEcheancier = useSupprimerEcheancierMutation();
  const [form, setForm] = useState<Omit<EcheancierConfigAddDTO, "scolariteConfigId">>({
    numero: 1, libelle: "", montant: 0, dateEcheance: "", estInscription: false, notes: "",
  });

  const nextNumero = (echeancier?.length ?? 0) + 1;

  const handleAdd = async () => {
    if (!config || !form.libelle || !form.montant || !form.dateEcheance) {
      toast.error("Libellé, montant et date requis");
      return;
    }
    try {
      await ajouterEcheancier.mutateAsync({
        scolariteConfigId: config.id,
        numero: form.numero,
        libelle: form.libelle,
        montant: form.montant,
        dateEcheance: form.dateEcheance,
        estInscription: form.estInscription,
        notes: form.notes || undefined,
      });
      toast.success("Échéance ajoutée");
      setForm({ numero: nextNumero + 1, libelle: "", montant: 0, dateEcheance: "", estInscription: false, notes: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  const totalPlan = (echeancier ?? []).reduce((s, e) => s + Number(e.montant), 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Plan de paiement — {config?.anneeAcademique} · {config?.filiere?.name} {config?.niveau?.name}
          </DialogTitle>
        </DialogHeader>

        {config && (
          <div className="flex gap-4 text-sm py-2 border-b flex-wrap">
            <div><span className="text-muted-foreground">Montant config : </span><strong>{fmt(config.montantTotal)}</strong></div>
            <div>
              <span className="text-muted-foreground">Total plan : </span>
              <strong className={totalPlan !== config.montantTotal ? "text-orange-600" : "text-green-600"}>
                {fmt(totalPlan)}
              </strong>
            </div>
            {totalPlan !== config.montantTotal && (
              <span className="text-orange-600 text-xs flex items-center">
                ⚠ Écart : {fmt(Math.abs(config.montantTotal - totalPlan))}
              </span>
            )}
          </div>
        )}

        <div className="max-h-52 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10">N°</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date limite</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-sm">Chargement…</TableCell></TableRow>
              ) : (echeancier ?? []).length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-sm">Aucune échéance définie</TableCell></TableRow>
              ) : (echeancier ?? []).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-bold text-center">{e.numero}</TableCell>
                  <TableCell className="font-medium">{e.libelle}</TableCell>
                  <TableCell>{fmt(e.montant)}</TableCell>
                  <TableCell>{new Date(e.dateEcheance).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    {e.estInscription && (
                      <Badge variant="secondary" className="text-xs">Inscription</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost" size="icon" className="text-destructive hover:text-destructive h-7 w-7"
                      onClick={() => config && supprimerEcheancier.mutate(
                        { id: e.id, configId: config.id },
                        { onSuccess: () => toast.success("Échéance supprimée"), onError: () => toast.error("Erreur") },
                      )}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t pt-3 space-y-3">
          <p className="text-sm font-medium">Ajouter une échéance</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>N° *</Label>
              <Input type="number" min={1} value={form.numero}
                onChange={(e) => setForm((f) => ({ ...f, numero: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1">
              <Label>Libellé *</Label>
              <Input placeholder="ex: Inscription" value={form.libelle}
                onChange={(e) => setForm((f) => ({ ...f, libelle: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Montant (FCFA) *</Label>
              <Input type="number" placeholder="100000" value={form.montant || ""}
                onChange={(e) => setForm((f) => ({ ...f, montant: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1">
              <Label>Date limite *</Label>
              <Input type="date" value={form.dateEcheance}
                onChange={(e) => setForm((f) => ({ ...f, dateEcheance: e.target.value }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.estInscription}
              onChange={(e) => setForm((f) => ({ ...f, estInscription: e.target.checked }))}
              className="rounded" />
            Échéance d'inscription
          </label>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Fermer</Button></DialogClose>
          <Button onClick={handleAdd} disabled={ajouterEcheancier.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            {ajouterEcheancier.isPending ? "Ajout…" : "Ajouter l'échéance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Versements Dialog ─────────────────────────────────────────────────────────
function VersementsDialog({
  scolarite, open, onClose,
}: { scolarite: ScolariteEtudiant | null; open: boolean; onClose: () => void }) {
  const { data: versements, isLoading: loadingVersements } = useVersementsScolariteQuery(scolarite?.id ?? "");
  const { data: echeances } = useEcheancesEtudiantQuery(scolarite?.id ?? "");
  const ajouterVersement = useAjouterVersementScolariteMutation();
  const [form, setForm] = useState({ montant: "", datePaiement: "", motif: "", echeanceEtudiantId: "" });

  const restant = scolarite
    ? Number(scolarite.montantTotal) - Number(scolarite.montantPaye)
    : 0;

  const handleEcheanceChange = (echeanceId: string) => {
    const ech = (echeances ?? []).find((e) => e.id === echeanceId);
    const restantEch = ech ? Number(ech.montantDu) - Number(ech.montantPaye) : 0;
    setForm((f) => ({
      ...f,
      echeanceEtudiantId: echeanceId,
      montant: restantEch > 0 ? String(restantEch) : f.montant,
      motif: ech ? ech.libelle : f.motif,
    }));
  };

  const handleAdd = async () => {
    if (!scolarite || !form.montant || !form.datePaiement) {
      toast.error("Montant et date requis");
      return;
    }
    try {
      await ajouterVersement.mutateAsync({
        scolariteEtudiantId: scolarite.id,
        montant: Number(form.montant),
        datePaiement: form.datePaiement,
        motif: form.motif || undefined,
        echeanceEtudiantId: form.echeanceEtudiantId || undefined,
      });
      toast.success("Versement enregistré");
      setForm({ montant: "", datePaiement: "", motif: "", echeanceEtudiantId: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Versements — {scolarite?.user?.firstName} {scolarite?.user?.lastName}
          </DialogTitle>
        </DialogHeader>

        {scolarite && (
          <div className="flex gap-4 text-sm py-2 border-b flex-wrap">
            <div><span className="text-muted-foreground">Total : </span><strong>{fmt(scolarite.montantTotal)}</strong></div>
            <div><span className="text-muted-foreground">Payé : </span><strong className="text-green-600">{fmt(scolarite.montantPaye)}</strong></div>
            <div><span className="text-muted-foreground">Restant : </span><strong className="text-red-600">{fmt(restant)}</strong></div>
          </div>
        )}

        {/* Échéances résumé */}
        {(echeances ?? []).length > 0 && (
          <div className="space-y-1 max-h-28 overflow-y-auto">
            {(echeances ?? []).map((e) => {
              const r = Number(e.montantDu) - Number(e.montantPaye);
              return (
                <div key={e.id} className="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-muted/50">
                  <span className="font-medium">{e.numero}. {e.libelle}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{new Date(e.dateLimite).toLocaleDateString("fr-FR")}</span>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${ECHEANCE_STATUT_COLORS[e.statut]}`}>
                      {ECHEANCE_STATUT_LABELS[e.statut]}
                    </span>
                    {r > 0 && <span className="text-red-600 font-medium">{fmt(r)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="max-h-32 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Motif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingVersements ? (
                <TableRow><TableCell colSpan={3} className="text-center py-4 text-muted-foreground text-sm">Chargement…</TableCell></TableRow>
              ) : (versements ?? []).length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-4 text-muted-foreground text-sm">Aucun versement</TableCell></TableRow>
              ) : (versements ?? []).map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="text-sm">{new Date(v.datePaiement).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="font-medium text-sm">{fmt(v.montant)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{v.motif ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t pt-3 space-y-3">
          <p className="text-sm font-medium">Nouveau versement</p>
          {(echeances ?? []).length > 0 && (
            <div className="space-y-1">
              <Label>Échéance ciblée <span className="text-muted-foreground text-xs">(optionnel)</span></Label>
              <Select value={form.echeanceEtudiantId} onValueChange={handleEcheanceChange}>
                <SelectTrigger><SelectValue placeholder="Lier à une échéance" /></SelectTrigger>
                <SelectContent>
                  {(echeances ?? [])
                    .filter((e) => e.statut !== "paye")
                    .map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.numero}. {e.libelle} — restant : {fmt(Number(e.montantDu) - Number(e.montantPaye))}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Montant (FCFA) *</Label>
              <Input type="number" placeholder="50000" value={form.montant}
                onChange={(e) => setForm((f) => ({ ...f, montant: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Date *</Label>
              <Input type="date" value={form.datePaiement}
                onChange={(e) => setForm((f) => ({ ...f, datePaiement: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Motif</Label>
            <Input placeholder="Motif du versement" value={form.motif}
              onChange={(e) => setForm((f) => ({ ...f, motif: e.target.value }))} />
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
type Tab = "configs" | "scolarites";

export default function ScolaritePage() {
  const [tab, setTab] = useState<Tab>("configs");

  // Config state
  const [addConfigOpen, setAddConfigOpen] = useState(false);
  const [editConfig, setEditConfig] = useState<ScolariteConfig | null>(null);
  const [deleteConfig, setDeleteConfig] = useState<ScolariteConfig | null>(null);
  const [echeancierConfig, setEcheancierConfig] = useState<ScolariteConfig | null>(null);
  const [configForm, setConfigForm] = useState<ScolariteConfigAddDTO>(emptyConfig);

  // Scolarité state
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteScol, setDeleteScol] = useState<ScolariteEtudiant | null>(null);
  const [versementsScol, setVersementsScol] = useState<ScolariteEtudiant | null>(null);
  const [assignForm, setAssignForm] = useState({ userId: "", scolariteConfigId: "", notes: "" });

  const { data: configs, isLoading: loadingConfigs } = useScolariteConfigsQuery();
  const { data: scolarites, isLoading: loadingScol } = useScolaritesQuery();
  const { data: users } = useUsersQuery();
  const etudiants = (users ?? []).filter((u) => u.role === "etudiant");

  const ajouterConfig = useAjouterScolariteConfigMutation();
  const modifierConfig = useModifierScolariteConfigMutation();
  const supprimerConfig = useSupprimerScolariteConfigMutation();
  const assignerScolarite = useAssignerScolariteMutation();
  const supprimerScolarite = useSupprimerScolariteEtudiantMutation();

  const openAddConfig = () => { setConfigForm(emptyConfig); setAddConfigOpen(true); };
  const openEditConfig = (c: ScolariteConfig) => {
    setConfigForm({
      anneeAcademique: c.anneeAcademique,
      montantTotal: c.montantTotal,
      montantInscription: c.montantInscription,
      nombreVersements: c.nombreVersements,
      description: c.description ?? "",
      isActive: c.isActive,
      filiereId: c.filiereId,
      niveauId: c.niveauId,
    });
    setEditConfig(c);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Scolarité</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gérez les configurations tarifaires et les scolarités des étudiants</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(["configs", "scolarites"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t === "configs" ? "Configurations tarifaires" : "Scolarités étudiants"}
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
                  <TableHead>Filière / Niveau</TableHead>
                  <TableHead>Montant total</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Versements</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingConfigs ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Chargement…</TableCell></TableRow>
                ) : (configs ?? []).length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Aucune configuration</TableCell></TableRow>
                ) : (configs ?? []).map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.anneeAcademique}</TableCell>
                    <TableCell>
                      <div className="text-sm">{c.filiere?.name ?? c.filiereId}</div>
                      <div className="text-xs text-muted-foreground">{c.niveau?.name ?? c.niveauId}</div>
                    </TableCell>
                    <TableCell className="font-medium">{fmt(c.montantTotal)}</TableCell>
                    <TableCell>{fmt(c.montantInscription)}</TableCell>
                    <TableCell className="text-center">{c.nombreVersements}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-40 truncate">{c.description ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline"
                        className={c.isActive ? "bg-green-100 text-green-700 border-green-200" : "text-muted-foreground"}>
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Plan de paiement" onClick={() => setEcheancierConfig(c)}>
                          <CalendarDays className="w-4 h-4" />
                        </Button>
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

      {/* ── Tab: Scolarités étudiants ── */}
      {tab === "scolarites" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setAssignForm({ userId: "", scolariteConfigId: "", notes: "" }); setAssignOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" /> Assigner une scolarité
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Filière / Niveau</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payé</TableHead>
                  <TableHead>Avancement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingScol ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Chargement…</TableCell></TableRow>
                ) : (scolarites ?? []).length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Aucune scolarité</TableCell></TableRow>
                ) : (scolarites ?? []).map((s) => {
                  const progress = pct(s.montantPaye, s.montantTotal);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{s.user?.firstName} {s.user?.lastName}</div>
                        <div className="text-xs text-muted-foreground">{s.user?.email}</div>
                      </TableCell>
                      <TableCell>{s.anneeAcademique}</TableCell>
                      <TableCell>
                        <div className="text-sm">{s.scolariteConfig?.filiere?.name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{s.scolariteConfig?.niveau?.name ?? "—"}</div>
                      </TableCell>
                      <TableCell className="font-medium">{fmt(s.montantTotal)}</TableCell>
                      <TableCell className="text-green-600 font-medium">{fmt(s.montantPaye)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${SCOLARITE_STATUT_COLORS[s.statut]}`}>
                          {SCOLARITE_STATUT_LABELS[s.statut]}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" title="Versements" onClick={() => setVersementsScol(s)}>
                            <CreditCard className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteScol(s)}>
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
          <DialogHeader><DialogTitle>Nouvelle configuration tarifaire</DialogTitle></DialogHeader>
          <ConfigForm form={configForm} setForm={setConfigForm} />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() => ajouterConfig.mutate(configForm, {
                onSuccess: () => { setAddConfigOpen(false); toast.success("Configuration ajoutée"); },
                onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur lors de l'ajout"),
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
                onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur lors de la modification"),
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
                onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression"),
              })}
              disabled={supprimerConfig.isPending}>
              {supprimerConfig.isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Écheancier ── */}
      <EcheancierDialog
        config={echeancierConfig}
        open={!!echeancierConfig}
        onClose={() => setEcheancierConfig(null)}
      />

      {/* ── Dialog: Assign Scolarité ── */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Assigner une scolarité</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Étudiant *</Label>
              <Select value={assignForm.userId} onValueChange={(v) => setAssignForm((f) => ({ ...f, userId: v }))}>
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
              <Select value={assignForm.scolariteConfigId} onValueChange={(v) => setAssignForm((f) => ({ ...f, scolariteConfigId: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir une configuration" /></SelectTrigger>
                <SelectContent>
                  {(configs ?? []).filter((c) => c.isActive).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.anneeAcademique} — {c.filiere?.name} {c.niveau?.name} — {fmt(c.montantTotal)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input placeholder="Notes optionnelles" value={assignForm.notes}
                onChange={(e) => setAssignForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button
              onClick={() => assignerScolarite.mutate(
                {
                  userId: assignForm.userId,
                  scolariteConfigId: assignForm.scolariteConfigId,
                  notes: assignForm.notes || undefined,
                },
                {
                  onSuccess: () => { setAssignOpen(false); toast.success("Scolarité assignée"); },
                  onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur"),
                },
              )}
              disabled={assignerScolarite.isPending}>
              {assignerScolarite.isPending ? "Assignation…" : "Assigner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Delete Scolarité ── */}
      <Dialog open={!!deleteScol} onOpenChange={(o) => !o && setDeleteScol(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Supprimer la scolarité</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Supprimer la scolarité de{" "}
            <strong>{deleteScol?.user?.firstName} {deleteScol?.user?.lastName}</strong> pour {deleteScol?.anneeAcademique} ?
          </p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
            <Button variant="destructive"
              onClick={() => deleteScol && supprimerScolarite.mutate(deleteScol.id, {
                onSuccess: () => { setDeleteScol(null); toast.success("Scolarité supprimée"); },
                onError: (err) => toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression"),
              })}
              disabled={supprimerScolarite.isPending}>
              {supprimerScolarite.isPending ? "Suppression…" : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Versements ── */}
      <VersementsDialog
        scolarite={versementsScol}
        open={!!versementsScol}
        onClose={() => setVersementsScol(null)}
      />
    </div>
  );
}

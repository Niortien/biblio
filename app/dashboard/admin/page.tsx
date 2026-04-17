"use client";

import { useState } from "react";
import { ChevronRight, Users, GraduationCap, CreditCard, Bus, ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  useNiveauxGroupesQuery,
  useFilieresParNiveauQuery,
  useOverviewParNiveauQuery,
  useEtudiantsParNiveauQuery,
} from "@/features/admin/queries/admin.query";
import { NiveauGroupe, FiliereParNiveau } from "@/features/admin/types/admin.type";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return Number(n).toLocaleString("fr-FR") + " FCFA";
}
function pct(paye: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.round((paye / total) * 100));
}

const SCOL_COLORS: Record<string, string> = {
  solde: "bg-green-100 text-green-700",
  en_cours: "bg-blue-100 text-blue-700",
  en_retard: "bg-red-100 text-red-700",
};
const SCOL_LABELS: Record<string, string> = {
  solde: "Soldé",
  en_cours: "En cours",
  en_retard: "En retard",
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />;
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold ${color ?? "text-foreground"}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Step 1: Niveaux ───────────────────────────────────────────────────────────
function StepNiveaux({ onSelect }: { onSelect: (g: NiveauGroupe) => void }) {
  const { data, isLoading } = useNiveauxGroupesQuery();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Choisir un niveau</h2>
        <p className="text-sm text-muted-foreground">Sélectionnez un niveau pour voir les filières disponibles</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed text-muted-foreground">
          <GraduationCap className="w-8 h-8 mb-2" />
          <p className="text-sm">Aucun niveau trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(data ?? []).map((g) => (
            <button
              key={g.niveauName}
              onClick={() => onSelect(g)}
              className="group text-left rounded-xl border border-border bg-card p-4 hover:border-primary hover:bg-primary/5 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-foreground leading-tight">{g.niveauName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {g.nbFilieres} filière{g.nbFilieres > 1 ? "s" : ""} · {g.nbEtudiants} étudiant{g.nbEtudiants > 1 ? "s" : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Filières ──────────────────────────────────────────────────────────
function StepFilieres({
  niveauName,
  onSelect,
}: { niveauName: string; onSelect: (f: FiliereParNiveau) => void }) {
  const { data, isLoading } = useFilieresParNiveauQuery(niveauName);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Filières — {niveauName}</h2>
        <p className="text-sm text-muted-foreground">Sélectionnez une filière pour voir les détails</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed text-muted-foreground">
          <BookOpen className="w-8 h-8 mb-2" />
          <p className="text-sm">Aucune filière trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((f) => (
            <button
              key={f.niveauId}
              onClick={() => onSelect(f)}
              className="group text-left rounded-xl border border-border bg-card p-4 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{f.filiere.code}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{f.filiere.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {f.nbEtudiants} étudiant{f.nbEtudiants > 1 ? "s" : ""}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Détail niveau ─────────────────────────────────────────────────────
function StepDetail({
  niveauId,
  niveauName,
  filiereName,
}: { niveauId: string; niveauName: string; filiereName: string }) {
  const [subtab, setSubtab] = useState<"overview" | "etudiants">("overview");
  const { data: overview, isLoading: loadingOverview } = useOverviewParNiveauQuery(niveauId);
  const { data: etudiants, isLoading: loadingEtudiants } = useEtudiantsParNiveauQuery(niveauId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{filiereName} — {niveauName}</h2>
        <p className="text-sm text-muted-foreground">Suivi scolarité et transport</p>
      </div>

      {/* Subtabs */}
      <div className="flex gap-1 border-b">
        {(["overview", "etudiants"] as const).map((t) => (
          <button key={t} onClick={() => setSubtab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              subtab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t === "overview" ? "Vue d'ensemble" : `Étudiants (${(etudiants ?? []).length})`}
          </button>
        ))}
      </div>

      {/* Overview */}
      {subtab === "overview" && (
        loadingOverview ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : overview ? (
          <div className="space-y-6">
            {/* Scolarité */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Scolarité</h3>
                <Badge variant="outline" className="text-xs">{overview.scolarite.total} dossiers</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Soldés" value={overview.scolarite.soldes}
                  color="text-green-600"
                  sub={`${overview.scolarite.total ? Math.round(overview.scolarite.soldes / overview.scolarite.total * 100) : 0}%`} />
                <StatCard label="En cours" value={overview.scolarite.enCours} color="text-blue-600" />
                <StatCard label="En retard" value={overview.scolarite.enRetard} color="text-red-600" />
                <StatCard label="Total perçu" value={fmt(overview.scolarite.montantTotalPaye)}
                  sub={`/ ${fmt(overview.scolarite.montantTotalDu)}`} />
              </div>
              {/* Progress bar global */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Taux de recouvrement</span>
                  <span>{pct(overview.scolarite.montantTotalPaye, overview.scolarite.montantTotalDu)}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct(overview.scolarite.montantTotalPaye, overview.scolarite.montantTotalDu)}%` }} />
                </div>
                <p className="text-xs text-red-500 text-right">
                  Restant : {fmt(overview.scolarite.montantRestant)}
                </p>
              </div>
            </div>

            {/* Transport */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Transport</h3>
                <Badge variant="outline" className="text-xs">{overview.transport.totalAbonnes} abonnements</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Soldés" value={overview.transport.abonnementsSoldes} color="text-green-600" />
                <StatCard label="Actifs" value={overview.transport.abonnementsActifs} color="text-blue-600" />
                <StatCard label="Total perçu" value={fmt(overview.transport.montantTotalPaye)}
                  sub={`/ ${fmt(overview.transport.montantTotalDu)}`} />
                <StatCard label="Restant" value={fmt(overview.transport.montantRestant)} color="text-red-600" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Taux de recouvrement</span>
                  <span>{pct(overview.transport.montantTotalPaye, overview.transport.montantTotalDu)}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct(overview.transport.montantTotalPaye, overview.transport.montantTotalDu)}%` }} />
                </div>
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* Étudiants */}
      {subtab === "etudiants" && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Étudiant</TableHead>
                <TableHead>Scolarité</TableHead>
                <TableHead>Payé scol.</TableHead>
                <TableHead>Avancement</TableHead>
                <TableHead>Statut scol.</TableHead>
                <TableHead>Transport</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEtudiants ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Chargement…</TableCell></TableRow>
              ) : (etudiants ?? []).length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Aucun étudiant</TableCell></TableRow>
              ) : (etudiants ?? []).map(({ etudiant, scolarite, transport }) => {
                const progress = scolarite
                  ? pct(scolarite.montantPaye, scolarite.montantTotal)
                  : 0;
                return (
                  <TableRow key={etudiant.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{etudiant.firstName} {etudiant.lastName}</div>
                      <div className="text-xs text-muted-foreground">{etudiant.email}</div>
                    </TableCell>
                    <TableCell>
                      {scolarite ? (
                        <div className="text-sm">{scolarite.anneeAcademique}</div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {scolarite ? (
                        <div>
                          <div className="text-sm font-medium text-green-600">{fmt(scolarite.montantPaye)}</div>
                          <div className="text-xs text-muted-foreground">/ {fmt(scolarite.montantTotal)}</div>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      {scolarite ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full"
                              style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      {scolarite ? (
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${SCOL_COLORS[scolarite.statut]}`}>
                          {SCOL_LABELS[scolarite.statut]}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                          Non inscrit
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {transport.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <div className="space-y-1">
                          {transport.map((t) => (
                            <div key={t.id} className="flex items-center gap-1.5 text-xs">
                              <Bus className="w-3 h-3 text-muted-foreground" />
                              <span className="text-green-600 font-medium">{fmt(t.montantPaye)}</span>
                              <span className="text-muted-foreground">/ {fmt(t.montantTotal)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({
  items,
  onNavigate,
}: { items: { label: string; step: number }[]; onNavigate: (step: number) => void }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm flex-wrap">
      {items.map((item, i) => (
        <span key={item.step} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
          {i < items.length - 1 ? (
            <button
              onClick={() => onNavigate(item.step)}
              className="text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </button>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminNiveauxPage() {
  const [step, setStep] = useState(1);
  const [selectedGroupe, setSelectedGroupe] = useState<NiveauGroupe | null>(null);
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereParNiveau | null>(null);

  const breadcrumbItems = [
    { label: "Niveaux", step: 1 },
    ...(selectedGroupe ? [{ label: selectedGroupe.niveauName, step: 2 }] : []),
    ...(selectedFiliere ? [{ label: selectedFiliere.filiere.name, step: 3 }] : []),
  ];

  const handleSelectGroupe = (g: NiveauGroupe) => {
    setSelectedGroupe(g);
    setSelectedFiliere(null);
    setStep(2);
  };

  const handleSelectFiliere = (f: FiliereParNiveau) => {
    setSelectedFiliere(f);
    setStep(3);
  };

  const handleNavigate = (s: number) => {
    if (s === 1) { setSelectedGroupe(null); setSelectedFiliere(null); }
    if (s === 2) { setSelectedFiliere(null); }
    setStep(s);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Suivi par niveau</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Navigation hiérarchique : niveau → filière → étudiants
        </p>
      </div>

      {/* Breadcrumb + back */}
      {step > 1 && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate(step - 1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <span className="text-muted-foreground">·</span>
          <Breadcrumb items={breadcrumbItems} onNavigate={handleNavigate} />
        </div>
      )}

      {/* Steps */}
      {step === 1 && (
        <StepNiveaux onSelect={handleSelectGroupe} />
      )}
      {step === 2 && selectedGroupe && (
        <StepFilieres niveauName={selectedGroupe.niveauName} onSelect={handleSelectFiliere} />
      )}
      {step === 3 && selectedFiliere && selectedGroupe && (
        <StepDetail
          niveauId={selectedFiliere.niveauId}
          niveauName={selectedGroupe.niveauName}
          filiereName={selectedFiliere.filiere.name}
        />
      )}
    </div>
  );
}

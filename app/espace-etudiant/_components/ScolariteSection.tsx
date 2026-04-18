"use client";

import { CreditCard, TrendingUp, CheckCircle2, Clock, AlertCircle, CalendarDays } from "lucide-react";
import { useUserScolariteDashboardQuery } from "@/features/scolarite/queries/scolarite.query";
import {
  ScolariteEtudiant,
  VersementScolarite,
  SCOLARITE_STATUT_LABELS,
  SCOLARITE_STATUT_COLORS,
  ECHEANCE_STATUT_LABELS,
  ECHEANCE_STATUT_COLORS,
} from "@/features/scolarite/types/scolarite.type";

function fmt(n: string | number) {
  return Number(n).toLocaleString("fr-FR") + " FCFA";
}
function pct(paye: string, total: string) {
  const t = Number(total);
  if (!t) return 0;
  return Math.min(100, Math.round((Number(paye) / t) * 100));
}

const STATUT_ICONS = {
  solde: CheckCircle2,
  en_cours: Clock,
  en_retard: AlertCircle,
};

interface Props {
  userId: string;
}

export default function ScolariteSection({ userId }: Props) {
  const { data, isLoading } = useUserScolariteDashboardQuery(userId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const scolarites = data?.scolarites ?? [];
  const versements = data?.versements ?? [];

  if (scolarites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl border border-dashed border-border bg-muted/30">
        <CreditCard className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Aucune scolarité enregistrée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scolarités */}
      {scolarites.map((s: ScolariteEtudiant) => {
        const progress = pct(s.montantPaye, s.montantTotal);
        const restant = Number(s.montantTotal) - Number(s.montantPaye);
        const Icon = STATUT_ICONS[s.statut];
        return (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {s.scolariteConfig?.filiere?.name ?? "—"} · {s.scolariteConfig?.niveau?.name ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Année {s.anneeAcademique}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${SCOLARITE_STATUT_COLORS[s.statut]}`}>
                <Icon className="w-3 h-3" />
                {SCOLARITE_STATUT_LABELS[s.statut]}
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progression</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    s.statut === "solde" ? "bg-green-500" :
                    s.statut === "en_retard" ? "bg-red-500" : "bg-primary"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Total</p>
                <p className="text-sm font-bold text-foreground">{fmt(s.montantTotal)}</p>
              </div>
              <div className="rounded-xl bg-green-50 dark:bg-green-950/30 p-3">
                <p className="text-[10px] text-green-600 uppercase tracking-wide mb-1">Payé</p>
                <p className="text-sm font-bold text-green-600">{fmt(s.montantPaye)}</p>
              </div>
              <div className={`rounded-xl p-3 ${restant > 0 ? "bg-red-50 dark:bg-red-950/30" : "bg-muted/50"}`}>
                <p className={`text-[10px] uppercase tracking-wide mb-1 ${restant > 0 ? "text-red-500" : "text-muted-foreground"}`}>Restant</p>
                <p className={`text-sm font-bold ${restant > 0 ? "text-red-500" : "text-muted-foreground"}`}>{fmt(restant)}</p>
              </div>
            </div>

            {/* Échéances */}
            {(s.echeances ?? []).length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Échéancier</p>
                </div>
                {(s.echeances ?? []).map((e) => {
                  const r = Number(e.montantDu) - Number(e.montantPaye);
                  const ePct = Number(e.montantDu) > 0 ? Math.min(100, Math.round((Number(e.montantPaye) / Number(e.montantDu)) * 100)) : 0;
                  return (
                    <div key={e.id} className="rounded-xl bg-muted/30 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-muted shrink-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            {e.numero}
                          </span>
                          <span className="text-xs font-medium text-foreground truncate">{e.libelle}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {new Date(e.dateLimite).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </span>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${ECHEANCE_STATUT_COLORS[e.statut]}`}>
                            {ECHEANCE_STATUT_LABELS[e.statut]}
                          </span>
                        </div>
                      </div>
                      {e.statut !== "paye" && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                e.statut === "en_retard" ? "bg-red-500" :
                                e.statut === "partiel" ? "bg-orange-400" : "bg-muted-foreground/40"
                              }`}
                              style={{ width: `${ePct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {r > 0 ? fmt(r) + " restant" : "Soldé"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Historique versements */}
      {versements.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Historique des versements</p>
          </div>
          <div className="space-y-2">
            {versements.map((v: VersementScolarite) => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{fmt(v.montant)}</p>
                  <p className="text-xs text-muted-foreground">{v.motif ?? "Versement scolarité"}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(v.datePaiement).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

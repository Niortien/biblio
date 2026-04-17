"use client";

import { Bus, TrendingUp, CheckCircle2, Activity, PowerOff } from "lucide-react";
import { useUserTransportDashboardQuery } from "@/features/transport/queries/transport.query";
import {
  TransportAbonnement,
  VersementTransport,
  TYPE_ABONNEMENT_LABELS,
  TRANSPORT_STATUT_LABELS,
  TRANSPORT_STATUT_COLORS,
} from "@/features/transport/types/transport.type";

function fmt(n: string | number) {
  return Number(n).toLocaleString("fr-FR") + " FCFA";
}
function pct(paye: string, total: string) {
  const t = Number(total);
  if (!t) return 0;
  return Math.min(100, Math.round((Number(paye) / t) * 100));
}

const STATUT_ICONS = {
  actif: Activity,
  inactif: PowerOff,
  solde: CheckCircle2,
};

interface Props {
  userId: string;
}

export default function TransportSection({ userId }: Props) {
  const { data, isLoading } = useUserTransportDashboardQuery(userId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const abonnements = data?.abonnements ?? [];
  const versements = data?.versements ?? [];

  if (abonnements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl border border-dashed border-border bg-muted/30">
        <Bus className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Aucun abonnement transport</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Abonnements */}
      {abonnements.map((a: TransportAbonnement) => {
        const progress = pct(a.montantPaye, a.montantTotal);
        const restant = Number(a.montantTotal) - Number(a.montantPaye);
        const Icon = STATUT_ICONS[a.statut];
        return (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">Abonnement transport</p>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {TYPE_ABONNEMENT_LABELS[a.typeAbonnement]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Année {a.anneeAcademique}</p>
                {a.transportConfig?.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{a.transportConfig.description}</p>
                )}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${TRANSPORT_STATUT_COLORS[a.statut]}`}>
                <Icon className="w-3 h-3" />
                {TRANSPORT_STATUT_LABELS[a.statut]}
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
                    a.statut === "solde" ? "bg-green-500" :
                    a.statut === "inactif" ? "bg-gray-400" : "bg-primary"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Total</p>
                <p className="text-sm font-bold text-foreground">{fmt(a.montantTotal)}</p>
              </div>
              <div className="rounded-xl bg-green-50 dark:bg-green-950/30 p-3">
                <p className="text-[10px] text-green-600 uppercase tracking-wide mb-1">Payé</p>
                <p className="text-sm font-bold text-green-600">{fmt(a.montantPaye)}</p>
              </div>
              <div className={`rounded-xl p-3 ${restant > 0 ? "bg-red-50 dark:bg-red-950/30" : "bg-muted/50"}`}>
                <p className={`text-[10px] uppercase tracking-wide mb-1 ${restant > 0 ? "text-red-500" : "text-muted-foreground"}`}>Restant</p>
                <p className={`text-sm font-bold ${restant > 0 ? "text-red-500" : "text-muted-foreground"}`}>{fmt(restant)}</p>
              </div>
            </div>
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
            {versements.map((v: VersementTransport) => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{fmt(v.montant)}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.moisConcerne ? `${v.moisConcerne}${v.motif ? ` · ${v.motif}` : ""}` : (v.motif ?? "Versement transport")}
                  </p>
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

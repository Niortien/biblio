"use client";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Filiere } from "@/features/filieres/types/filiere.type";
import { Niveau } from "@/features/niveaux/types/niveau.type";
import { getFiliereColors } from "@/lib/filiere-colors";

interface Filters {
  filiereId?: string;
  niveauId?: string;
}

interface Props {
  filters: Filters;
  filieres: Filiere[];
  allNiveaux: Niveau[];
  onChange: (filters: Filters) => void;
}

export function DocumentsFilters({ filters, filieres, allNiveaux, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={filters.filiereId ?? "all"}
        onValueChange={(v) =>
          onChange({ filiereId: v === "all" ? undefined : v, niveauId: undefined })
        }
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Toutes les filières" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les filières</SelectItem>
          {filieres.map((f) => {
            const c = getFiliereColors(f.code);
            return (
              <SelectItem key={f.id} value={f.id}>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-xs font-bold ${c.lightText}`}>{f.code}</span>
                  <span className="text-muted-foreground">— {f.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select
        value={filters.niveauId ?? "all"}
        onValueChange={(v) =>
          onChange({ ...filters, niveauId: v === "all" ? undefined : v })
        }
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Tous les niveaux" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les niveaux</SelectItem>
          {allNiveaux.map((n) => {
            const c = getFiliereColors(n.filiere?.code ?? "");
            return (
              <SelectItem key={n.id} value={n.id}>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={c.lightText}>{n.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, Plus, UserCheck, Trash2, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useUsersQuery } from "@/features/users/queries/user.query";
import { useFilieresQuery } from "@/features/filieres/queries/filiere.query";
import { useNiveauxQuery } from "@/features/niveaux/queries/niveau.query";
import { useMatieresQuery } from "@/features/matieres/queries/matiere.query";
import {
  useMatieresOfProfesseurQuery,
  useAssignMatiereMutation,
  useRemoveMatiereMutation,
} from "@/features/professeur/queries/professeur.query";
import { User } from "@/features/users/types/user.type";
import { ProfesseurMatiere } from "@/features/professeur/types/professeur.type";

// ─── Dialog: gérer les matières d'un professeur ──────────────────────────────
function GererMatieresDialog({ prof, onClose }: { prof: User; onClose: () => void }) {
  const [filiereId, setFiliereId] = useState("");
  const [niveauId, setNiveauId] = useState("");
  const [matiereId, setMatiereId] = useState("");

  const { data: filieres = [] } = useFilieresQuery();
  const { data: niveaux = [] } = useNiveauxQuery();

  // Niveaux filtrés selon la filière sélectionnée
  const niveauxFiltres = filiereId
    ? niveaux.filter((n) => n.filiereId === filiereId)
    : niveaux;

  // Matières filtrées selon filière + niveau
  const { data: matieresDispo = [] } = useMatieresQuery(
    { filiereId, niveauId },
    { enabled: !!filiereId && !!niveauId },
  );

  const { data: affectations = [], isLoading } = useMatieresOfProfesseurQuery(prof.id);
  const assign = useAssignMatiereMutation(prof.id);
  const remove = useRemoveMatiereMutation();

  // IDs déjà assignés pour éviter les doublons côté UI
  const assignedMatiereIds = new Set(affectations.map((a) => a.matiereId));

  const handleAssign = async () => {
    if (!matiereId) {
      toast.error("Sélectionnez une matière");
      return;
    }
    try {
      await assign.mutateAsync({ matiereId });
      toast.success("Matière assignée");
      setMatiereId("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Retirer cette matière du professeur ?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Matière retirée");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Matières de Pr. {prof.firstName} {prof.lastName}
          </DialogTitle>
        </DialogHeader>

        {/* Assigner une matière */}
        <div className="space-y-3 pt-1">
          <p className="text-sm font-medium text-foreground">Assigner une nouvelle matière</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Filière</Label>
              <Select
                value={filiereId}
                onValueChange={(v) => { setFiliereId(v); setNiveauId(""); setMatiereId(""); }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filière…" />
                </SelectTrigger>
                <SelectContent>
                  {filieres.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Niveau</Label>
              <Select
                value={niveauId}
                onValueChange={(v) => { setNiveauId(v); setMatiereId(""); }}
                disabled={!filiereId}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Niveau…" />
                </SelectTrigger>
                <SelectContent>
                  {niveauxFiltres.map((n) => (
                    <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Matière</Label>
            <Select value={matiereId} onValueChange={setMatiereId} disabled={!niveauId}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Choisir une matière…" />
              </SelectTrigger>
              <SelectContent>
                {matieresDispo
                  .filter((m) => !assignedMatiereIds.has(m.id))
                  .map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                {matieresDispo.filter((m) => !assignedMatiereIds.has(m.id)).length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    {!niveauId ? "Sélectionnez un niveau" : "Toutes les matières sont déjà assignées"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAssign}
            disabled={assign.isPending || !matiereId}
            className="w-full h-9"
          >
            <Plus className="w-4 h-4 mr-1" />
            {assign.isPending ? "Assignation..." : "Assigner la matière"}
          </Button>
        </div>

        {/* Matières actuelles */}
        <div className="space-y-2 mt-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Matières assignées</p>
            {!isLoading && (
              <span className="text-xs text-muted-foreground">{affectations.length} matière(s)</span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-3 justify-center">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Chargement...
            </div>
          ) : affectations.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Aucune matière assignée pour l&apos;instant.
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {affectations.map((a: ProfesseurMatiere) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {a.matiere?.name ?? a.matiereId}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {a.matiere?.filiere?.name && `${a.matiere.filiere.name}`}
                        {a.matiere?.niveau?.name && ` · ${a.matiere.niveau.name}`}
                        {a.matiere?.coefficient != null && ` · Coef. ${a.matiere.coefficient}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-red-500 hover:bg-red-50"
                    onClick={() => handleRemove(a.id)}
                    disabled={remove.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ProfesseursPage() {
  const [search, setSearch] = useState("");
  const [selectedProf, setSelectedProf] = useState<User | null>(null);

  const { data: allUsers = [], isLoading } = useUsersQuery();
  const professeurs = allUsers
    .filter((u) => u.role === "professeur")
    .filter((u) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Professeurs</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Gérez les affectations de matières pour chaque professeur
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un professeur…"
              className="pl-9 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {isLoading ? "…" : allUsers.filter((u) => u.role === "professeur").length}
            </p>
            <p className="text-xs text-muted-foreground">Professeurs enregistrés</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {isLoading ? "…" : allUsers.filter((u) => u.role === "professeur" && u.isActive).length}
            </p>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </div>
        </div>
      </div>

      {/* Tableau */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-12 justify-center">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Chargement...
        </div>
      ) : professeurs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {search ? "Aucun professeur trouvé pour cette recherche." : "Aucun professeur enregistré. Ajoutez des professeurs depuis la gestion des utilisateurs."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Professeur</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Statut</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {professeurs.map((prof) => (
                <tr key={prof.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {prof.firstName.charAt(0)}{prof.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {prof.firstName} {prof.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">Professeur</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{prof.email}</td>
                  <td className="px-4 py-3 text-center">
                    {prof.isActive ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
                        Actif
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500 border-gray-200" variant="outline">
                        Inactif
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProf(prof)}
                      className="gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Gérer les matières
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog gestion matières */}
      {selectedProf && (
        <GererMatieresDialog
          prof={selectedProf}
          onClose={() => setSelectedProf(null)}
        />
      )}
    </div>
  );
}


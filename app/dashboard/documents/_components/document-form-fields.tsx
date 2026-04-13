"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DocumentType, DOCUMENT_TYPE_LABELS } from "@/features/documents/types/document.type";
import { Filiere } from "@/features/filieres/types/filiere.type";
import { Niveau } from "@/features/niveaux/types/niveau.type";
import { Matiere } from "@/features/matieres/types/matiere.type";

const TYPES: DocumentType[] = ["devoir", "sujet_examen", "td", "tp", "support_cours"];

export interface DocumentFormValues {
  name: string;
  type: DocumentType;
  filiereId: string;
  niveauId: string;
  matiereId: string;
  file?: File | null;
}

interface Props {
  values: DocumentFormValues;
  onChange: (values: DocumentFormValues) => void;
  filieres: Filiere[];
  allNiveaux: Niveau[];
  allMatieres: Matiere[];
  showFile?: boolean;
}

export function DocumentFormFields({
  values, onChange, filieres, allNiveaux, allMatieres, showFile,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const niveaux = allNiveaux.filter(
    (n) => !values.filiereId || n.filiereId === values.filiereId
  );
  const matieres = allMatieres.filter(
    (m) =>
      (!values.filiereId || m.filiereId === values.filiereId) &&
      (!values.niveauId || m.niveauId === values.niveauId)
  );

  const set = (patch: Partial<DocumentFormValues>) =>
    onChange({ ...values, ...patch });

  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-1.5">
        <Label>Nom</Label>
        <Input
          value={values.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Ex: Sujet examen Algo 2025"
        />
      </div>

      <div className="grid gap-1.5">
        <Label>Type</Label>
        <Select value={values.type} onValueChange={(v) => set({ type: v as DocumentType })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>{DOCUMENT_TYPE_LABELS[t]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Filière</Label>
          <Select
            value={values.filiereId || undefined}
            onValueChange={(v) => set({ filiereId: v, niveauId: "", matiereId: "" })}
          >
            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
            <SelectContent>
              {filieres.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label>Niveau</Label>
          <Select
            value={values.niveauId || undefined}
            onValueChange={(v) => set({ niveauId: v, matiereId: "" })}
            disabled={!values.filiereId}
          >
            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
            <SelectContent>
              {niveaux.length === 0 ? (
                <SelectItem value="__empty" disabled>Aucun niveau disponible</SelectItem>
              ) : (
                niveaux.map((n) => (
                  <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label>
          Matière <span className="text-muted-foreground text-xs">(optionnel)</span>
        </Label>
        <Select
          value={values.matiereId || "none"}
          onValueChange={(v) => set({ matiereId: v === "none" ? "" : v })}
          disabled={!values.niveauId}
        >
          <SelectTrigger><SelectValue placeholder="Aucune" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune</SelectItem>
            {matieres.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showFile && (
        <div className="grid gap-1.5">
          <Label>
            Fichier <span className="text-muted-foreground text-xs">(PDF ou image, max 20 MB)</span>
          </Label>
          <div
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {values.file ? (
              <p className="text-sm font-medium text-foreground">{values.file.name}</p>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Cliquez pour sélectionner un fichier</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={(e) => set({ file: e.target.files?.[0] ?? null })}
          />
        </div>
      )}
    </div>
  );
}

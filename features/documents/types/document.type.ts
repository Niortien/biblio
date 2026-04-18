export type DocumentType = 'devoir' | 'sujet_examen' | 'td' | 'tp' | 'support_cours';
export type FileType = 'pdf' | 'image';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  devoir: 'Devoir',
  sujet_examen: 'Sujet d\'examen',
  td: 'TD',
  tp: 'TP',
  support_cours: 'Support de cours',
};

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  fileType: FileType;
  fileUrl: string;
  filiereId: string;
  filiere?: { id: string; name: string; code: string };
  niveauId: string;
  niveau?: { id: string; name: string; filiereId: string };
  matiereId?: string;
  matiere?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsParams {
  filiereId?: string;
  niveauId?: string;
  matiereId?: string;
  type?: DocumentType;
}

export interface DocumentAddDTO {
  name: string;
  type: DocumentType;
  filiereId: string;
  niveauId: string;
  matiereId?: string;
  file: File;
}

export interface DocumentUpdateDTO {
  name?: string;
  type?: DocumentType;
  filiereId?: string;
  niveauId?: string;
  matiereId?: string;
}

import { api } from "@/lib/api";
import { Document, DocumentsParams, DocumentAddDTO, DocumentUpdateDTO } from "../types/document.type";
import { ActionResponse, PaginatedResponse } from "@/types/api.type";

export interface IDocumentAPI {
  obtenirTousDocuments(params?: DocumentsParams): Promise<Document[]>;
  obtenirDocument(id: string): Promise<Document>;
  ajouterDocument(data: DocumentAddDTO): Promise<Document>;
  modifierDocument(id: string, data: DocumentUpdateDTO): Promise<Document>;
  supprimerDocument(id: string): Promise<void>;
}

export const documentAPI: IDocumentAPI = {
  obtenirTousDocuments(params?: DocumentsParams): Promise<Document[]> {
    return api.request<Document[]>({
      endpoint: "documents",
      method: "GET",
      searchParams: params as Record<string, string | number | boolean | undefined>,
    });
  },

  obtenirDocument(id: string): Promise<Document> {
    return api.request<Document>({ endpoint: `documents/${id}`, method: "GET" });
  },

  ajouterDocument(data: DocumentAddDTO): Promise<Document> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("filiereId", data.filiereId);
    formData.append("niveauId", data.niveauId);
    if (data.matiereId) formData.append("matiereId", data.matiereId);
    return api.request<Document>({ endpoint: "documents", method: "POST", data: formData });
  },

  modifierDocument(id: string, data: DocumentUpdateDTO): Promise<Document> {
    return api.request<Document>({ endpoint: `documents/${id}`, method: "PUT", data });
  },

  supprimerDocument(id: string): Promise<void> {
    return api.request<void>({ endpoint: `documents/${id}`, method: "DELETE" });
  },
};

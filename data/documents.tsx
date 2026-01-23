export type DocumentType = 'cours' | 'td' | 'tp' | 'devoir' | 'examen';
export type Level = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
export type Program = 
  | 'RIT' | 'MIAGE' | 'ASSRI' | 'SEA' | 'SEG' | 'SJAP' | '3EA' 
  | 'Data Science' | 'IA' | 'Droit';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  program: Program;
  level: Level;
  fileUrl: string;
  fileName: string;
  description?: string;
  uploadDate: string;
  fileSize: string;
}

export const programs: { name: Program; fullName: string; levels: Level[] }[] = [
  { name: 'RIT', fullName: 'Réseaux et Technologies de l\'Information', levels: ['L1', 'L2', 'L3'] },
  { name: 'MIAGE', fullName: 'Méthodes Informatiques Appliquées à la Gestion des Entreprises', levels: ['L1', 'L2', 'L3'] },
  { name: 'ASSRI', fullName: 'Administration des Systèmes et Services Réseaux Informatiques', levels: ['L1', 'L2', 'L3'] },
  { name: 'SEA', fullName: 'Sciences Économiques et Administration', levels: ['L1', 'L2', 'L3'] },
  { name: 'SEG', fullName: 'Sciences Économiques et de Gestion', levels: ['L1', 'L2', 'L3'] },
  { name: 'SJAP', fullName: 'Sciences Juridiques et Administration Publique', levels: ['L1', 'L2', 'L3'] },
  { name: '3EA', fullName: 'Électronique, Électrotechnique et Automatique', levels: ['L1', 'L2', 'L3'] },
  { name: 'Data Science', fullName: 'Science des Données', levels: ['M1', 'M2'] },
  { name: 'IA', fullName: 'Intelligence Artificielle', levels: ['M1', 'M2'] },
  { name: 'Droit', fullName: 'Droit', levels: ['M1', 'M2'] },
];

export const documentTypes: { type: DocumentType; label: string; icon: string }[] = [
  { type: 'cours', label: 'Cours', icon: 'BookOpen' },
  { type: 'td', label: 'TD', icon: 'FileText' },
  { type: 'tp', label: 'TP', icon: 'FlaskConical' },
  { type: 'devoir', label: 'Devoirs', icon: 'ClipboardList' },
  { type: 'examen', label: 'Examens', icon: 'GraduationCap' },
];

// Mock data - à remplacer par de vrais documents
export const documents: Document[] = [
  // MIAGE L1
  {
    id: '1',
    title: 'Algorithme et Programmation',
    type: 'cours',
    program: 'MIAGE',
    level: 'L1',
    fileUrl: '/documents/miage-l1-algo.pdf',
    fileName: 'algorithme-programmation.pdf',
    description: 'Introduction aux algorithmes et à la programmation structurée',
    uploadDate: '2024-09-15',
    fileSize: '2.5 MB',
  },
  {
    id: '2',
    title: 'TD Algorithme - Séries 1 à 5',
    type: 'td',
    program: 'MIAGE',
    level: 'L1',
    fileUrl: '/documents/miage-l1-td-algo.pdf',
    fileName: 'td-algorithme-series.pdf',
    description: 'Travaux dirigés sur les algorithmes de base',
    uploadDate: '2024-09-20',
    fileSize: '1.2 MB',
  },
  {
    id: '3',
    title: 'TP Programmation C',
    type: 'tp',
    program: 'MIAGE',
    level: 'L1',
    fileUrl: '/documents/miage-l1-tp-c.pdf',
    fileName: 'tp-programmation-c.pdf',
    description: 'Travaux pratiques en langage C',
    uploadDate: '2024-10-01',
    fileSize: '1.8 MB',
  },
  {
    id: '4',
    title: 'Examen Algorithme 2023-2024',
    type: 'examen',
    program: 'MIAGE',
    level: 'L1',
    fileUrl: '/documents/miage-l1-exam-algo-2024.pdf',
    fileName: 'examen-algorithme-2024.pdf',
    description: 'Sujet d\'examen de la session principale',
    uploadDate: '2024-01-15',
    fileSize: '500 KB',
  },
  // MIAGE L2
  {
    id: '5',
    title: 'Base de Données Relationnelles',
    type: 'cours',
    program: 'MIAGE',
    level: 'L2',
    fileUrl: '/documents/miage-l2-bdd.pdf',
    fileName: 'base-donnees-relationnelles.pdf',
    description: 'Conception et interrogation des bases de données',
    uploadDate: '2024-09-15',
    fileSize: '3.2 MB',
  },
  {
    id: '6',
    title: 'TD SQL - Requêtes avancées',
    type: 'td',
    program: 'MIAGE',
    level: 'L2',
    fileUrl: '/documents/miage-l2-td-sql.pdf',
    fileName: 'td-sql-avance.pdf',
    description: 'Exercices sur les requêtes SQL complexes',
    uploadDate: '2024-10-05',
    fileSize: '800 KB',
  },
  // RIT L1
  {
    id: '7',
    title: 'Introduction aux Réseaux',
    type: 'cours',
    program: 'RIT',
    level: 'L1',
    fileUrl: '/documents/rit-l1-reseaux.pdf',
    fileName: 'introduction-reseaux.pdf',
    description: 'Fondamentaux des réseaux informatiques',
    uploadDate: '2024-09-10',
    fileSize: '4.1 MB',
  },
  {
    id: '8',
    title: 'TP Configuration Cisco',
    type: 'tp',
    program: 'RIT',
    level: 'L1',
    fileUrl: '/documents/rit-l1-tp-cisco.pdf',
    fileName: 'tp-cisco.pdf',
    description: 'Travaux pratiques sur les équipements Cisco',
    uploadDate: '2024-10-12',
    fileSize: '2.0 MB',
  },
  // Data Science M1
  {
    id: '9',
    title: 'Machine Learning Fondamentaux',
    type: 'cours',
    program: 'Data Science',
    level: 'M1',
    fileUrl: '/documents/ds-m1-ml.pdf',
    fileName: 'machine-learning-fondamentaux.pdf',
    description: 'Introduction au Machine Learning supervisé et non-supervisé',
    uploadDate: '2024-09-05',
    fileSize: '5.5 MB',
  },
  {
    id: '10',
    title: 'TP Python pour la Data Science',
    type: 'tp',
    program: 'Data Science',
    level: 'M1',
    fileUrl: '/documents/ds-m1-tp-python.pdf',
    fileName: 'tp-python-datascience.pdf',
    description: 'Manipulation de données avec Pandas et NumPy',
    uploadDate: '2024-09-25',
    fileSize: '1.5 MB',
  },
  // IA M1
  {
    id: '11',
    title: 'Deep Learning',
    type: 'cours',
    program: 'IA',
    level: 'M1',
    fileUrl: '/documents/ia-m1-dl.pdf',
    fileName: 'deep-learning.pdf',
    description: 'Réseaux de neurones profonds et architectures modernes',
    uploadDate: '2024-09-08',
    fileSize: '6.2 MB',
  },
  {
    id: '12',
    title: 'Devoir Maison - Reconnaissance d\'images',
    type: 'devoir',
    program: 'IA',
    level: 'M1',
    fileUrl: '/documents/ia-m1-devoir-cnn.pdf',
    fileName: 'devoir-reconnaissance-images.pdf',
    description: 'Implémentation d\'un CNN pour la classification',
    uploadDate: '2024-11-01',
    fileSize: '700 KB',
  },
  // ASSRI L1
  {
    id: '13',
    title: 'Administration Système Linux',
    type: 'cours',
    program: 'ASSRI',
    level: 'L1',
    fileUrl: '/documents/assri-l1-linux.pdf',
    fileName: 'admin-linux.pdf',
    description: 'Gestion et administration des systèmes Linux',
    uploadDate: '2024-09-12',
    fileSize: '3.8 MB',
  },
  // SEG L1
  {
    id: '14',
    title: 'Microéconomie',
    type: 'cours',
    program: 'SEG',
    level: 'L1',
    fileUrl: '/documents/seg-l1-microeco.pdf',
    fileName: 'microeconomie.pdf',
    description: 'Principes fondamentaux de la microéconomie',
    uploadDate: '2024-09-14',
    fileSize: '2.9 MB',
  },
  {
    id: '15',
    title: 'Examen Microéconomie 2023',
    type: 'examen',
    program: 'SEG',
    level: 'L1',
    fileUrl: '/documents/seg-l1-exam-micro.pdf',
    fileName: 'examen-microeconomie-2023.pdf',
    description: 'Sujet d\'examen avec corrigé',
    uploadDate: '2024-01-20',
    fileSize: '600 KB',
  },
  // Droit M1
  {
    id: '16',
    title: 'Droit des Affaires Internationales',
    type: 'cours',
    program: 'Droit',
    level: 'M1',
    fileUrl: '/documents/droit-m1-affaires.pdf',
    fileName: 'droit-affaires-internationales.pdf',
    description: 'Cadre juridique des transactions internationales',
    uploadDate: '2024-09-18',
    fileSize: '4.5 MB',
  },
];

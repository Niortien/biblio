import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, GraduationCap, Layers } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Documents", value: "—", icon: FileText, href: "/dashboard/documents", color: "text-blue-600" },
  { label: "Filières", value: "—", icon: BookOpen, href: "/dashboard/filieres", color: "text-purple-600" },
  { label: "Matières", value: "—", icon: GraduationCap, href: "/dashboard/matieres", color: "text-green-600" },
  { label: "Niveaux", value: "—", icon: Layers, href: "/dashboard/niveaux", color: "text-orange-600" },
];

const sections = [
  {
    href: "/dashboard/documents",
    label: "Gérer les Documents",
    description: "Ajouter, modifier ou supprimer des documents (cours, TD, TP, examens…)",
    icon: FileText,
  },
  {
    href: "/dashboard/filieres",
    label: "Gérer les Filières",
    description: "Administrer les filières disponibles dans l'établissement",
    icon: BookOpen,
  },
  {
    href: "/dashboard/matieres",
    label: "Gérer les Matières",
    description: "Organiser les matières par filière et niveau",
    icon: GraduationCap,
  },
  {
    href: "/dashboard/niveaux",
    label: "Gérer les Niveaux",
    description: "Configurer les niveaux d'études (L1, L2, L3, M1, M2…)",
    icon: Layers,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Gérez l'ensemble du contenu de la bibliothèque
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Accès rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.href} href={s.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{s.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

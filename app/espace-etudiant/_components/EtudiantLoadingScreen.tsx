import { GraduationCap } from "lucide-react";

export default function EtudiantLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/5">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
          <GraduationCap className="w-8 h-8 text-primary-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">Chargement de votre espace...</p>
      </div>
    </div>
  );
}

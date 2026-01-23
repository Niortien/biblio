import { BookOpen, Download, FolderOpen, Users } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: BookOpen, value: "500+", label: "Documents" },
    { icon: FolderOpen, value: "10", label: "Filières" },
    { icon: Users, value: "5000+", label: "Étudiants" },
    { icon: Download, value: "10K+", label: "Téléchargements" },
  ];

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-fade-in">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Plateforme Documentaire Universitaire
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Accédez à vos{" "}
            <span className="text-primary">ressources académiques</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Cours, TD, TP, devoirs et examens pour toutes les filières. 
            Téléchargez et consultez vos documents en un clic.
          </p>

          {/* CTA */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <a
              href="#documents"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary text-primary-foreground font-medium rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5" />
              Explorer les documents
            </a>
            <a
              href="#programs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card text-foreground font-medium rounded-xl border border-border hover:border-primary/50 transition-all duration-300"
            >
              Voir les filières
            </a>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elegant transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

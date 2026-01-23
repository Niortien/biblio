import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">
                  Espace Documents
                </h2>
                <p className="text-xs text-primary-foreground/70">Université</p>
              </div>
            </Link>
            <p className="text-primary-foreground/80 max-w-md mb-6">
              Plateforme de partage de ressources académiques pour tous les
              étudiants. Accédez à vos cours, TD, TP, devoirs et examens en
              toute simplicité.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Liens rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Filières
                </Link>
              </li>
              <li>
                <Link
                  href="/#documents"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Campus Universitaire</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+XXX XXX XXX XXX</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">contact@universite.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-sm text-primary-foreground/60">
            © {currentYear} Université. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">DROGBA</h3>
            <p className="text-muted-foreground text-sm">
              {t('hero.headline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.shop')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Payment */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.followUs')}</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            
            <h4 className="font-semibold mb-2 text-sm">{t('footer.paymentMethods')}</h4>
            <p className="text-xs text-muted-foreground">COD • Vodafone Cash • Instapay</p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          © 2024 DROGBA. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  );
}

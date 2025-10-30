import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCart } from "@/features/cart";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { loadString, saveString } from "@/shared/utils/storage";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { totalItems } = useCart();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = (loadString("drogba-theme", "light") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    saveString("drogba-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border backdrop-blur bg-surface dark:bg-surface-dark supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile Menu Button - Left Side */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">DROGBA</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  className="text-lg font-medium hover:text-accent transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.home")}
                </Link>
                <Link
                  to="/products"
                  className="text-lg font-medium hover:text-accent transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.shop")}
                </Link>
                <div className="border-t border-border mt-4 pt-4 flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleLanguage}>
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Toggle language</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === "light" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Left Side (visible on all screens) */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight order-first md:order-none"
        >
          DROGBA
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            {t("nav.shop")}
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="hidden md:flex"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden md:flex"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

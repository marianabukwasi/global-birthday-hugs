import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ShoppingCart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, Language } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

const LANG_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const { items } = useCart();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const publicLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/how-it-works", label: t("nav.howItWorks") },
    { to: "/global", label: t("nav.global") },
  ];

  const authLinks = [
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/global", label: t("nav.global") },
    { to: "/discover", label: t("nav.discover") },
    { to: "/offers", label: t("nav.offers") },
  ];

  const links = user ? authLinks : publicLinks;
  const isActive = (path: string) => location.pathname === path;

  const cycleLang = () => {
    const idx = LANG_OPTIONS.findIndex(l => l.code === language);
    const next = LANG_OPTIONS[(idx + 1) % LANG_OPTIONS.length];
    setLanguage(next.code);
  };

  const currentLang = LANG_OPTIONS.find(l => l.code === language) || LANG_OPTIONS[0];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow-gold group-hover:scale-105 transition-transform">
            <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            Birthday<span className="text-gradient-gold">CORE</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={cycleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <span>{currentLang.flag}</span>
            <span className="text-xs font-medium">{currentLang.label}</span>
          </button>

          {/* Cart */}
          {user && (
            <Link to="/cart" className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
              <ShoppingCart className="w-4.5 h-4.5" />
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile-setup">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  {t("nav.profile")}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground">
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="sm" className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 shadow-glow-gold">
                  {t("nav.joinFree")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={cycleLang} className="p-2 text-muted-foreground">
            <span className="text-sm">{currentLang.flag}</span>
          </button>
          {user && items.length > 0 && (
            <Link to="/cart" className="relative p-2 text-muted-foreground">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {items.length}
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border mt-2 pt-3 flex flex-col gap-1">
                {user ? (
                  <>
                    <Link to="/profile-setup" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg">
                      {t("nav.profile")}
                    </Link>
                    <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground text-left rounded-lg">
                      {t("nav.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg">
                      {t("nav.signIn")}
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-sm font-semibold text-primary rounded-lg">
                      {t("nav.joinFree")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

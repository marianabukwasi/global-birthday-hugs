import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PartyPopper, Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/discover", label: "Discover" },
    { to: "/global", label: "Global" },
    { to: "/demos", label: "Demos" },
  ];

  const authLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/discover", label: "Discover" },
    { to: "/send-wish", label: "Send Wish" },
    { to: "/spins", label: "Spins" },
    { to: "/timeline", label: "Timeline" },
    { to: "/global", label: "Global" },
  ];

  const links = user ? authLinks : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-celebration flex items-center justify-center shadow-glow-pink">
            <PartyPopper className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Birthday<span className="text-gradient-celebration">CORE</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile-setup")}>
                <User className="w-4 h-4 mr-1" /> Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-celebration text-primary-foreground border-0 hover:opacity-90" onClick={() => navigate("/auth")}>
                Join Free
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium py-2 ${
                    location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                {user ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate("/profile-setup"); setIsOpen(false); }}>Profile</Button>
                    <Button size="sm" className="flex-1" variant="outline" onClick={handleSignOut}>Sign Out</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate("/auth"); setIsOpen(false); }}>Sign In</Button>
                    <Button size="sm" className="flex-1 bg-gradient-celebration text-primary-foreground border-0" onClick={() => { navigate("/auth"); setIsOpen(false); }}>Join Free</Button>
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

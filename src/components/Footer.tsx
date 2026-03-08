import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                Birthday<span className="text-gradient-gold">CORE</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">Everybody deserves to be celebrated.</p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Platform</h4>
            <div className="space-y-2">
              <Link to="/discover" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Discover</Link>
              <Link to="/global" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Global Dashboard</Link>
              <Link to="/demos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Demos</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Features</h4>
            <div className="space-y-2">
              <Link to="/send-wish" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Send Wishes</Link>
              <Link to="/spins" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Glimmer Draw</Link>
              <Link to="/timeline" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Birthday Capsules</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Account</h4>
            <div className="space-y-2">
              <Link to="/auth" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
              <Link to="/profile-setup" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Profile</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BirthdayCORE. Celebrating life, globally.</p>
        </div>
      </div>
    </footer>
  );
};

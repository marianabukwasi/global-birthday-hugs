import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-base font-bold text-foreground">
                Birthday<span className="text-gradient-gold">CORE</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Everybody deserves to be celebrated.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 text-sm">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link to="/discover" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discover</Link>
              <Link to="/global" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Global Dashboard</Link>
              <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 text-sm">Features</h4>
            <div className="flex flex-col gap-2">
              <Link to="/send-wish" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Send a Wish</Link>
              <Link to="/glimmer-draw" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Glimmer Draw</Link>
              <Link to="/offers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Birthday Offers</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 text-sm">Account</h4>
            <div className="flex flex-col gap-2">
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/auth?mode=signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Join Free</Link>
              <Link to="/profile-setup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Profile</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BirthdayCORE. Celebrating life, globally.
          </p>
        </div>
      </div>
    </footer>
  );
};

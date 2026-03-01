import { Cake } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
                <Cake className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">Birthday CORE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Celebrating Our Real Existence. Every person deserves to be celebrated.
            </p>
          </div>
          {[
            { title: "Platform", links: ["How It Works", "Discover", "Giving Ranks", "Gift Experiences"] },
            { title: "Company", links: ["About", "Partners", "Careers", "Press"] },
            { title: "Support", links: ["Help Center", "Privacy Policy", "Terms of Service", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Birthday CORE. All rights reserved. Made with ❤️ for every birthday.
        </div>
      </div>
    </footer>
  );
};

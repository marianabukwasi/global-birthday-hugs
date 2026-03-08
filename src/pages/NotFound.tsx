import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
    <div className="text-6xl mb-4">🎂</div>
    <h1 className="font-display text-4xl font-bold text-foreground mb-2">Page Not Found</h1>
    <p className="text-muted-foreground mb-8">This celebration doesn't exist yet.</p>
    <Link to="/">
      <Button className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90">
        Back to Home
      </Button>
    </Link>
  </div>
);

export default NotFound;

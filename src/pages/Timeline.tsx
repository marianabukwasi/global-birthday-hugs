import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Download, Share2, Play, Image, MessageCircle } from "lucide-react";

const Timeline = () => {
  const navigate = useNavigate();
  const [wishes, setWishes] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadWishes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      const { data } = await supabase
        .from("wishes")
        .select("*")
        .eq("recipient_id", user.id)
        .eq("birthday_year", selectedYear)
        .order("created_at", { ascending: true });

      if (data) setWishes(data);
    };
    loadWishes();
  }, [navigate, selectedYear]);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Birthday <span className="text-gradient-gold">Timeline</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">Your birthday capsules through the years</p>
        </motion.div>

        {/* Year selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={year === selectedYear ? "default" : "outline"}
              onClick={() => setSelectedYear(year)}
              className={year === selectedYear ? "bg-gradient-celebration text-primary-foreground border-0" : ""}
            >
              <Calendar className="w-4 h-4 mr-1" />
              {year}
            </Button>
          ))}
        </div>

        {/* Capsule content */}
        <div className="glass-strong rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">{selectedYear} Birthday Capsule</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" /> Share</Button>
            </div>
          </div>

          {/* Stats for this year */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <MessageCircle className="w-5 h-5 text-celebration-pink mx-auto mb-1" />
              <div className="font-display text-2xl font-bold text-foreground">{wishes.length}</div>
              <div className="text-xs text-muted-foreground">Wishes</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Image className="w-5 h-5 text-celebration-gold mx-auto mb-1" />
              <div className="font-display text-2xl font-bold text-foreground">{wishes.filter(w => w.image_url).length}</div>
              <div className="text-xs text-muted-foreground">Images</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <Play className="w-5 h-5 text-celebration-purple mx-auto mb-1" />
              <div className="font-display text-2xl font-bold text-foreground">{wishes.filter(w => w.video_url).length}</div>
              <div className="text-xs text-muted-foreground">Videos</div>
            </div>
          </div>

          {/* Wishes list */}
          {wishes.length > 0 ? (
            <div className="space-y-4">
              {wishes.map((wish, i) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="glass rounded-xl p-4 flex-1">
                    <p className="text-foreground">{wish.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(wish.created_at).toLocaleDateString(undefined, { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No wishes for {selectedYear} yet</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Timeline;

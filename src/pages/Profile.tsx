import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { mockUsers } from "@/data/mockUsers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, Calendar, Heart, Users, Palette, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Confetti } from "@/components/Confetti";
import { useState } from "react";

const Profile = () => {
  const { id } = useParams();
  const user = mockUsers.find((u) => u.id === id) || mockUsers[0];
  const progress = Math.min((user.raised / user.goal) * 100, 100);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero banner */}
        <div className="relative h-48 md:h-64 bg-gradient-hero overflow-hidden">
          <Confetti />
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-10 pb-12">
          <div className="max-w-3xl mx-auto">
            {/* Avatar & basic info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden -mt-16 sm:-mt-16 shadow-warm">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
                    <div className="flex gap-0.5">
                      {Array.from({ length: user.rank }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{user.country}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{user.birthday}</span>
                    <span className="flex items-center gap-1"><Palette className="w-3.5 h-3.5" />{user.favoriteColor}</span>
                    <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />Age {user.age}</span>
                  </div>
                  <p className="text-foreground italic">"{user.quote}"</p>

                  {/* Hobbies */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user.hobbies.map((h) => (
                      <span key={h} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Birthday Pot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">🏺 Birthday Pot</h2>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground font-semibold">${user.raised} raised</span>
                <span className="text-muted-foreground">${user.goal} goal</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-gradient-hero rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-secondary" /> {user.contributors} contributors</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> from 25+ countries</span>
              </div>
            </motion.div>

            {/* Contribute */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">🎉 Send a Celebration</h2>
              <Textarea
                placeholder={`Write a birthday message for ${user.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mb-4 bg-background"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-gradient-hero text-primary-foreground border-0 hover:opacity-90 rounded-full py-6">
                  🎂 Contribute $1 + Message
                </Button>
                <Button variant="outline" className="rounded-full py-6">
                  📸 Add Photo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

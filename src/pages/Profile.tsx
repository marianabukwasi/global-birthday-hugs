import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { mockUsers } from "@/data/mockUsers";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, Calendar, Heart, Users, Sparkles, Camera, Image } from "lucide-react";
import { motion } from "framer-motion";
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
        {/* Header accent bar */}
        <div className="h-1 bg-gradient-gold" />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">

            {/* Header: Name + DOB + CORE Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">CORE Member</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: user.rank }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                  ))}
                </div>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                {user.name}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{user.birthday}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{user.country}</span>
                <span className="flex items-center gap-1.5">Age {user.age}</span>
              </div>
            </motion.div>

            {/* The Quote / Manifesto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              <blockquote className="font-display text-xl md:text-2xl italic text-foreground leading-relaxed">
                "{user.quote}"
              </blockquote>
            </motion.div>

            {/* The 2-Picture Slots */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {/* Frame A: The Self */}
              <div className="relative group">
                <div className="aspect-[3/4] rounded-2xl border border-border overflow-hidden bg-card">
                  <img
                    src={user.avatar}
                    alt={`${user.name} — The Self`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Camera className="w-3 h-3" />
                    <span className="font-medium">The Self</span>
                  </div>
                </div>
              </div>

              {/* Frame B: The Essence */}
              <div className="relative group">
                <div className="aspect-[3/4] rounded-2xl border border-border overflow-hidden bg-card flex items-center justify-center">
                  <div className="text-center p-6">
                    <Image className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-xs text-muted-foreground">The Essence</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Hobby, home, or what defines you</p>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Image className="w-3 h-3" />
                    <span className="font-medium">The Essence</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* The "Existence" Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 text-center tracking-wide">
                What Matters to Me
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {user.hobbies.map((h) => (
                  <span
                    key={h}
                    className="bg-card border border-border text-foreground px-4 py-2 rounded-full text-sm"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Divider */}
            <div className="h-px bg-border mb-10" />

            {/* Birthday Pot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Birthday Pot</h2>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground font-semibold">${user.raised} raised</span>
                <span className="text-muted-foreground">${user.goal} goal</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                <motion.div
                  className="h-full bg-gradient-champagne rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-primary" /> {user.contributors} contributors</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> from 25+ countries</span>
              </div>
            </motion.div>

            {/* Send a Celebration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6"
            >
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Send a Celebration</h2>
              <Textarea
                placeholder={`Write a birthday message for ${user.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mb-4 bg-background"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-gradient-champagne text-primary-foreground border-0 hover:opacity-90 rounded-full py-6">
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

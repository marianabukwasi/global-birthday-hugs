import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BirthdayVideoPlayer, type BirthdayWish } from "@/components/video/BirthdayVideoPlayer";
import { motion } from "framer-motion";
import { Film, Sparkles } from "lucide-react";

// Demo wishes from around the world
const demoWishes: BirthdayWish[] = [
  { id: "1", senderName: "Maria Santos", country: "Brazil", message: "Feliz aniversário! Wishing you joy and samba!", imageUrl: "https://images.unsplash.com/photo-1464349153459-f0199f4a5172?w=300&h=300&fit=crop" },
  { id: "2", senderName: "Hiroshi Tanaka", country: "Japan", message: "お誕生日おめでとう! May your year be filled with harmony.", imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=300&h=300&fit=crop" },
  { id: "3", senderName: "Amina Diallo", country: "Senegal", message: "Joyeux anniversaire! Sending love from Dakar.", imageUrl: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=300&h=300&fit=crop" },
  { id: "4", senderName: "Erik Johansson", country: "Sweden", message: "Grattis på födelsedagen! Cheers from Stockholm!", imageUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=300&h=300&fit=crop" },
  { id: "5", senderName: "Priya Sharma", country: "India", message: "जन्मदिन मुबारक! May all your dreams come true!", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop" },
  { id: "6", senderName: "James O'Brien", country: "United Kingdom", message: "Happy birthday mate! Here's to another brilliant year.", imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=300&fit=crop" },
  { id: "7", senderName: "Fatou Sow", country: "Ghana", message: "Happy birthday! Blessings from Accra 🇬🇭", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=300&fit=crop" },
  { id: "8", senderName: "Lucas Martinez", country: "Argentina", message: "¡Feliz cumpleaños! Que la pases genial!", imageUrl: "https://images.unsplash.com/photo-1464349153459-f0199f4a5172?w=300&h=300&fit=crop" },
  { id: "9", senderName: "Yuki Chen", country: "Australia", message: "Happy birthday from down under! 🦘", imageUrl: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=300&h=300&fit=crop" },
  { id: "10", senderName: "Ahmed Hassan", country: "Egypt", message: "عيد ميلاد سعيد! Wishing you the best!", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=300&h=300&fit=crop" },
  { id: "11", senderName: "Sophie Müller", country: "Germany", message: "Alles Gute zum Geburtstag! 🎂", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop" },
  { id: "12", senderName: "Kwame Asante", country: "Nigeria", message: "Happy birthday! Blessings from Lagos!", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=300&fit=crop" },
];

const BirthdayVideoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-celebration-purple/20 flex items-center justify-center">
              <Film className="w-5 h-5 text-celebration-purple" />
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground">
              Birthday <span className="text-gradient-celebration">Video</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg ml-14">
            Auto-generated celebration video with fireworks, a global wish map, and an animated slideshow
          </p>
        </motion.div>

        {/* Demo: Amara's Birthday Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-celebration-gold" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Amara's 28th Birthday
              </h2>
              <span className="text-xs bg-celebration-pink/20 text-celebration-pink px-2 py-0.5 rounded-full font-medium">
                Demo
              </span>
            </div>
            <BirthdayVideoPlayer
              name="Amara Okafor"
              age={28}
              wishes={demoWishes}
              msPerWish={2000}
            />
          </div>
        </motion.div>

        {/* How it works explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Fireworks Intro",
                desc: "The video opens with a stunning fireworks animation displaying the birthday person's name and age.",
                emoji: "🎆",
              },
              {
                step: "2",
                title: "Global Wish Map",
                desc: "A 2D world map animates through each wish, highlighting the sender's country with their photo and message.",
                emoji: "🌍",
              },
              {
                step: "3",
                title: "Celebration Outro",
                desc: "The video concludes with a summary: how many people celebrated from how many countries.",
                emoji: "🎉",
              },
            ].map((item) => (
              <div key={item.step} className="glass rounded-xl p-5">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-display font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default BirthdayVideoPage;

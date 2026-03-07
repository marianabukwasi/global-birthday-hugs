import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AgeCollage } from "@/components/postcard/AgeCollage";
import { PhotoSlideshow } from "@/components/postcard/PhotoSlideshow";
import { VideoCompilation } from "@/components/postcard/VideoCompilation";
import { motion } from "framer-motion";
import { Cake, PartyPopper } from "lucide-react";

// Pool of contributor photos for demos
const photoPool = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
];

const demos = [
  {
    name: "Amara Okafor",
    age: 28,
    country: "Nigeria 🇳🇬",
    birthday: "June 15",
    quote: "Every year is a gift worth celebrating!",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Lucas Martinez",
    age: 34,
    country: "Brazil 🇧🇷",
    birthday: "July 4",
    quote: "Life is a party, make every moment count!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Yuki Tanaka",
    age: 21,
    country: "Japan 🇯🇵",
    birthday: "August 22",
    quote: "Grateful for every sunrise on my birthday.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Kwame Asante",
    age: 50,
    country: "Ghana 🇬🇭",
    birthday: "January 20",
    quote: "Celebrate existence. Celebrate each other.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  },
];

const makeSlideshow = (name: string) =>
  photoPool.slice(0, 6).map((url, i) => ({
    id: `s-${name}-${i}`,
    name: ["Maria", "Chen", "Aisha", "Erik", "Fatou", "Liam"][i],
    country: ["Brazil 🇧🇷", "China 🇨🇳", "India 🇮🇳", "Sweden 🇸🇪", "Senegal 🇸🇳", "Ireland 🇮🇪"][i],
    photoUrl: url,
    message: [
      "Happy birthday! Wishing you all the joy! 🎉",
      "May this year bring endless happiness!",
      "Celebrating you from across the ocean! 🌊",
      "Grattis på födelsedagen! 🎂",
      "Your existence matters! 💛",
      "Another year of being brilliant!",
    ][i],
  }));

const makeVideos = (name: string) =>
  photoPool.slice(0, 3).map((url, i) => ({
    id: `v-${name}-${i}`,
    name: ["Maria Santos", "Chen Wei", "Aisha Patel"][i],
    country: ["Brazil 🇧🇷", "China 🇨🇳", "India 🇮🇳"][i],
    videoUrl: "",
    thumbnailUrl: url,
    durationSeconds: [15, 22, 10][i],
    message: ["A dance for you!", "Wishes from afar", "Quick shoutout!"][i],
  }));

const DemoPostcards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="h-2 bg-gradient-champagne" />

        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
              <PartyPopper className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Demo Postcards</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Birthday Cards That Form Your Age
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Every contributor's photo becomes a pixel in the mosaic of your age. Here are 4 demos showing how it looks.
            </p>
          </motion.div>

          {/* 4 Demos */}
          <div className="space-y-24">
            {demos.map((demo, demoIndex) => (
              <motion.section
                key={demo.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="max-w-3xl mx-auto"
              >
                {/* Demo header */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={demo.avatar}
                    alt={demo.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {demo.name} — Turning {demo.age}!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {demo.country} • {demo.birthday}
                    </p>
                  </div>
                  <Cake className="w-8 h-8 text-primary ml-auto" />
                </div>

                {/* Quote */}
                <blockquote className="font-display text-lg italic text-foreground/80 border-l-4 border-primary pl-4 mb-8">
                  "{demo.quote}"
                </blockquote>

                {/* Age Collage */}
                <div className="mb-6">
                  <AgeCollage age={demo.age} photos={photoPool} name={demo.name} />
                </div>

                {/* Slideshow */}
                <div className="mb-6">
                  <PhotoSlideshow
                    photos={makeSlideshow(demo.name)}
                    birthdayName={demo.name}
                    autoPlayInterval={3000 + demoIndex * 500}
                  />
                </div>

                {/* Video */}
                <div className="mb-6">
                  <VideoCompilation
                    videos={makeVideos(demo.name)}
                    birthdayName={demo.name}
                  />
                </div>

                {/* Separator */}
                {demoIndex < demos.length - 1 && (
                  <div className="flex items-center gap-4 mt-10">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-foreground text-sm">✦</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
              </motion.section>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DemoPostcards;

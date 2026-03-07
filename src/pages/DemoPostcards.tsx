import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AgeCollage } from "@/components/postcard/AgeCollage";
import { PhotoSlideshow } from "@/components/postcard/PhotoSlideshow";
import { VideoCompilation } from "@/components/postcard/VideoCompilation";
import { BirthdayVideoPlayer, type BirthdayWish } from "@/components/video/BirthdayVideoPlayer";
import { motion } from "framer-motion";
import { Cake, PartyPopper, Film } from "lucide-react";

const photoPool = [
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1488722796624-0aa6f1bb6399?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1501959915551-4e8d30928317?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=200&fit=crop",
];

const birthdayQuotes = [
  "You're not old, you're vintage! 🎉", "Another trip around the sun ☀️",
  "Aging like fine wine 🍷", "Born to sparkle ✨",
  "Here's to another year of greatness 🥂", "Age is just a number 💫",
  "Forever young at heart 💛", "Cheers to you! 🎂",
  "Make a wish! 🌟", "Life begins at your age 🌈",
  "You glow differently when you're happy 🌻", "The best is yet to come 🚀",
];

const demos = [
  { name: "Amara Okafor", age: 28, country: "Nigeria 🇳🇬", birthday: "June 15", quote: "Every year is a gift worth celebrating!", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face" },
  { name: "Lucas Martinez", age: 34, country: "Brazil 🇧🇷", birthday: "July 4", quote: "Life is a party, make every moment count!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { name: "Yuki Tanaka", age: 21, country: "Japan 🇯🇵", birthday: "August 22", quote: "Grateful for every sunrise on my birthday.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { name: "Kwame Asante", age: 50, country: "Ghana 🇬🇭", birthday: "January 20", quote: "Celebrate existence. Celebrate each other.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" },
];

const makeSlideshow = (demoIndex: number) =>
  photoPool.slice(0, 8).map((url, i) => ({
    id: `s-${demoIndex}-${i}`,
    name: `Contributor ${i + 1}`,
    country: ["Brazil 🇧🇷", "China 🇨🇳", "India 🇮🇳", "Sweden 🇸🇪", "Senegal 🇸🇳", "Ireland 🇮🇪", "Japan 🇯🇵", "Argentina 🇦🇷"][i],
    photoUrl: photoPool[(demoIndex * 5 + i) % photoPool.length],
    message: birthdayQuotes[(demoIndex * 3 + i) % birthdayQuotes.length],
  }));

const multilingualBirthdayClips = [
  { name: "Sofia García", country: "Spain 🇪🇸", language: "Spanish", greeting: "¡Feliz cumpleaños!" },
  { name: "Hiroshi Yamamoto", country: "Japan 🇯🇵", language: "Japanese", greeting: "お誕生日おめでとう!" },
  { name: "Pierre Dupont", country: "France 🇫🇷", language: "French", greeting: "Joyeux anniversaire!" },
  { name: "Anna Müller", country: "Germany 🇩🇪", language: "German", greeting: "Alles Gute zum Geburtstag!" },
  { name: "Priya Sharma", country: "India 🇮🇳", language: "Hindi", greeting: "जन्मदिन मुबारक!" },
  { name: "Ahmed Hassan", country: "Egypt 🇪🇬", language: "Arabic", greeting: "!عيد ميلاد سعيد" },
];

const makeVideos = (demoIndex: number) => {
  const start = (demoIndex * 4) % multilingualBirthdayClips.length;
  return Array.from({ length: 6 }, (_, i) => {
    const clip = multilingualBirthdayClips[(start + i) % multilingualBirthdayClips.length];
    return {
      id: `v-${demoIndex}-${i}`, name: clip.name, country: clip.country, videoUrl: "",
      thumbnailUrl: photoPool[(demoIndex * 3 + i * 2) % photoPool.length],
      durationSeconds: 30, message: `"${clip.greeting}" — Happy Birthday in ${clip.language}`,
    };
  });
};

// Generate birthday video wishes for each demo
const makeBirthdayVideoWishes = (demoIndex: number): BirthdayWish[] => {
  const countries = ["Brazil", "Japan", "Senegal", "Sweden", "India", "United Kingdom", "Ghana", "Argentina", "Australia", "Egypt", "Germany", "Nigeria"];
  const names = ["Maria Santos", "Hiroshi Tanaka", "Amina Diallo", "Erik Johansson", "Priya Sharma", "James O'Brien", "Fatou Sow", "Lucas Martinez", "Yuki Chen", "Ahmed Hassan", "Sophie Müller", "Kwame Asante"];
  const messages = [
    "Feliz aniversário! Wishing you joy!", "お誕生日おめでとう! Harmony and peace.",
    "Joyeux anniversaire! Love from Dakar.", "Grattis! Cheers from Stockholm!",
    "जन्मदिन मुबारक! May dreams come true!", "Happy birthday mate!",
    "Happy birthday! Blessings from Accra 🇬🇭", "¡Feliz cumpleaños!",
    "Happy birthday from down under! 🦘", "عيد ميلاد سعيد! Wishing the best!",
    "Alles Gute zum Geburtstag! 🎂", "Happy birthday! Blessings from Lagos!",
  ];

  const offset = demoIndex * 3;
  return countries.map((country, i) => ({
    id: `bv-${demoIndex}-${i}`,
    senderName: names[(i + offset) % names.length],
    country,
    message: messages[(i + offset) % messages.length],
    imageUrl: photoPool[(demoIndex * 4 + i * 2) % photoPool.length],
  }));
};

const DemoPostcards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="h-2 bg-gradient-champagne" />

        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
              <PartyPopper className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Demo Postcards</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Birthday Cards That Form Your Age
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Age mosaics, photo slideshows, multilingual video greetings, and auto-generated birthday videos with a 3D globe.
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
                  <img src={demo.avatar} alt={demo.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {demo.name} — Turning {demo.age}!
                    </h2>
                    <p className="text-sm text-muted-foreground">{demo.country} • {demo.birthday}</p>
                  </div>
                  <Cake className="w-8 h-8 text-primary ml-auto" />
                </div>

                <blockquote className="font-display text-lg italic text-foreground/80 border-l-4 border-primary pl-4 mb-8">
                  "{demo.quote}"
                </blockquote>

                {/* Birthday Video — 3D Globe with photos/quotes ON the map */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">Birthday Video</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">3D Globe</span>
                  </div>
                  <BirthdayVideoPlayer
                    name={demo.name}
                    age={demo.age}
                    wishes={makeBirthdayVideoWishes(demoIndex)}
                    msPerWish={2000}
                  />
                </div>

                {/* Age Collage */}
                <div className="mb-6">
                  <AgeCollage age={demo.age} photos={photoPool} name={demo.name} />
                </div>

                {/* Slideshow */}
                <div className="mb-6">
                  <PhotoSlideshow photos={makeSlideshow(demoIndex)} birthdayName={demo.name} autoPlayInterval={3000 + demoIndex * 500} />
                </div>

                {/* Video compilation */}
                <div className="mb-6">
                  <VideoCompilation videos={makeVideos(demoIndex)} birthdayName={demo.name} />
                </div>

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

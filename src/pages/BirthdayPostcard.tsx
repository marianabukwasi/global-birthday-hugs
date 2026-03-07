import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { mockUsers } from "@/data/mockUsers";
import { mockContributorPhotos, mockContributorVideos } from "@/data/mockContributions";
import { PhotoCollage } from "@/components/postcard/PhotoCollage";
import { PhotoSlideshow } from "@/components/postcard/PhotoSlideshow";
import { VideoCompilation } from "@/components/postcard/VideoCompilation";
import { motion } from "framer-motion";
import { Heart, Globe, Users } from "lucide-react";

const BirthdayPostcard = () => {
  const { id } = useParams();
  const user = mockUsers.find((u) => u.id === id) || mockUsers[0];

  const uniqueCountries = [...new Set(mockContributorPhotos.map((p) => p.country))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="h-2 bg-gradient-champagne" />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <p className="text-sm uppercase tracking-widest text-primary font-medium mb-2">
                Birthday Postcard
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
                Happy Birthday, {user.name}! 🎂
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                The world came together to celebrate your existence. Here's everything they sent you.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4 mb-10"
            >
              {[
                { icon: Users, label: "Contributors", value: mockContributorPhotos.length + mockContributorVideos.length },
                { icon: Globe, label: "Countries", value: uniqueCountries.length },
                { icon: Heart, label: "Messages", value: mockContributorPhotos.length + mockContributorVideos.length },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-xl border border-border p-4 text-center"
                >
                  <stat.icon className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Photo Collage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <PhotoCollage photos={mockContributorPhotos} birthdayName={user.name} />
            </motion.div>

            {/* Slideshow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <PhotoSlideshow photos={mockContributorPhotos} birthdayName={user.name} />
            </motion.div>

            {/* Video Compilation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <VideoCompilation videos={mockContributorVideos} birthdayName={user.name} />
            </motion.div>

            {/* Countries list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6 text-center"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                🌍 Love from around the world
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {uniqueCountries.map((c) => (
                  <span
                    key={c}
                    className="bg-muted text-foreground px-3 py-1.5 rounded-full text-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BirthdayPostcard;

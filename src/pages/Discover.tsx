import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BirthdayCard } from "@/components/BirthdayCard";
import { mockUsers } from "@/data/mockUsers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Globe, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const months = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Discover = () => {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase());
    const matchMonth = selectedMonth === "All" || u.birthday.startsWith(selectedMonth);
    return matchSearch && matchMonth;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-4xl mb-4 block">🔍</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Birthdays
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find and celebrate people around the world. Search by name, country, or birthday month.
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 py-6 rounded-full bg-card border-border"
              />
            </div>
          </div>

          {/* Month filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {months.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={selectedMonth === m ? "default" : "outline"}
                className={`rounded-full ${selectedMonth === m ? "bg-gradient-gold text-primary-foreground border-0" : ""}`}
                onClick={() => setSelectedMonth(m)}
              >
                {m === "All" ? <Globe className="w-3 h-3 mr-1" /> : <Calendar className="w-3 h-3 mr-1" />}
                {m}
              </Button>
            ))}
          </div>

          {/* Results */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {filtered.map((user) => (
              <BirthdayCard key={user.id} {...user} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl mb-4 block">🎂</span>
              <p className="text-muted-foreground">No birthdays found. Try a different search!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Discover;

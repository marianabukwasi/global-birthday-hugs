import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import Discover from "./pages/Discover";
import SendWish from "./pages/SendWish";
import Timeline from "./pages/Timeline";
import SpinWheel from "./pages/SpinWheel";
import GlobalDashboard from "./pages/GlobalDashboard";
import Profile from "./pages/Profile";
import HowItWorksPage from "./pages/HowItWorksPage";
import RanksPage from "./pages/RanksPage";
import BirthdayPostcard from "./pages/BirthdayPostcard";
import DemoPostcards from "./pages/DemoPostcards";
import BirthdayVideoPage from "./pages/BirthdayVideoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/send-wish" element={<SendWish />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/spins" element={<SpinWheel />} />
          <Route path="/global" element={<GlobalDashboard />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/ranks" element={<RanksPage />} />
          <Route path="/postcard/:id" element={<BirthdayPostcard />} />
          <Route path="/demos" element={<DemoPostcards />} />
          <Route path="/birthday-video" element={<BirthdayVideoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

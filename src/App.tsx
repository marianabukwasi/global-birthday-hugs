import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import GiverSignup from "./pages/GiverSignup";
import ReceiverSignup from "./pages/ReceiverSignup";
import CelebratePage from "./pages/CelebratePage";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import Discover from "./pages/Discover";
import GlobalDashboard from "./pages/GlobalDashboard";
import HowItWorksPage from "./pages/HowItWorksPage";
import BirthdayReveal from "./pages/BirthdayReveal";
import GiverConfirmation from "./pages/GiverConfirmation";
import ReceiverWelcome from "./pages/ReceiverWelcome";
import BirthdayOffers from "./pages/BirthdayOffers";
import BirthdayRevealPage from "./pages/BirthdayRevealPage";
import ThankYouFlow from "./pages/ThankYouFlow";
import ReferralMoment from "./pages/ReferralMoment";
import CashoutFlow from "./pages/CashoutFlow";
import NotificationSettings from "./pages/NotificationSettings";
import CartPage from "./pages/CartPage";
import OffersAdmin from "./pages/OffersAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import { CookieConsent } from "./components/CookieConsent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/join" element={<GiverSignup />} />
              <Route path="/join/confirmation" element={<GiverConfirmation />} />
              <Route path="/setup" element={<ReceiverSignup />} />
              <Route path="/setup/welcome" element={<ReceiverWelcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/global" element={<GlobalDashboard />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/reveal/:userId" element={<BirthdayReveal />} />
              <Route path="/celebrate/:userId" element={<CelebratePage />} />
              <Route path="/offers" element={<BirthdayOffers />} />
              <Route path="/birthday-reveal" element={<BirthdayRevealPage />} />
              <Route path="/thank-you" element={<ThankYouFlow />} />
              <Route path="/referral" element={<ReferralMoment />} />
              <Route path="/cashout" element={<CashoutFlow />} />
              <Route path="/settings/notifications" element={<NotificationSettings />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin/offers" element={<OffersAdmin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;

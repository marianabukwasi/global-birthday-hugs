import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "en" | "fr";

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.howItWorks": "How It Works",
    "nav.global": "Global",
    "nav.dashboard": "Dashboard",
    "nav.discover": "Discover",
    "nav.offers": "Offers",
    "nav.cart": "Cart",
    "nav.profile": "Profile",
    "nav.signIn": "Sign In",
    "nav.joinFree": "Join Free",
    "nav.signOut": "Sign Out",
    "nav.notifications": "Notifications",
    // Discover
    "discover.title": "Discover",
    "discover.birthdays": "Birthdays",
    "discover.subtitle": "Find someone to celebrate today",
    "discover.search": "Search by name or country...",
    "discover.twins": "Find my birthday twins",
    "discover.surprise": "Surprise someone today",
    "discover.noResults": "No birthday pages found yet. Be the first!",
    "discover.sendWish": "Send a Wish",
    "discover.wishes": "wishes",
    "discover.potTarget": "Pot target",
    // Celebrate
    "celebrate.sendWish": "Send a Birthday Wish",
    "celebrate.addToCart": "Add to Cart",
    "celebrate.wishesArrived": "wishes have arrived from",
    "celebrate.countries": "countries",
    "celebrate.yourWish": "Your Birthday Wish",
    "celebrate.photoVideoHint": "A photo or video + your heartfelt words",
    "celebrate.writeSomething": "Write something they will remember...",
    "celebrate.minChars": "At least 10 characters needed",
    "celebrate.continue": "Continue",
    "celebrate.backToWish": "Back to wish",
    "celebrate.addGift": "Add a birthday gift?",
    "celebrate.evenOneDollar": "Even $1 from around the world means something.",
    "celebrate.sendWithGift": "Send wish with gift",
    "celebrate.sendWithout": "Send wish only",
    "celebrate.pageNotFound": "Birthday page not found",
    // Cart
    "cart.title": "Birthday Gift Cart",
    "cart.subtitle": "Send gifts to multiple people in one go",
    "cart.empty": "Your cart is empty",
    "cart.emptyHint": "Add people from their birthday pages after sending a wish.",
    "cart.totalBudget": "Total Budget",
    "cart.distributeEvenly": "Distribute Evenly",
    "cart.message": "Message for all",
    "cart.messagePlaceholder": "Write a message...",
    "cart.duplicateAll": "Duplicate to all",
    "cart.sendAll": "Send All Gifts",
    "cart.deliveryNote": "Your gifts will be delivered on each person's birthday",
    "cart.fee": "Processing fee",
    "cart.remove": "Remove",
    // Offers
    "offers.title": "Birthday Offers",
    "offers.nearYou": "Near You",
    "offers.subtitle": "Special deals from businesses celebrating with you",
    "offers.comingSoon": "Coming Soon",
    "offers.comingSoonText": "Birthday offers in your area are coming soon. We are building partnerships now.",
    "offers.claim": "Claim Offer",
    "offers.validDates": "Valid",
    "offers.redemption": "Redemption",
    // General
    "general.loading": "Loading...",
    "general.save": "Save",
    "general.cancel": "Cancel",
    "general.confirm": "Confirm",
    "general.back": "Back",
  },
  fr: {
    // Navbar
    "nav.home": "Accueil",
    "nav.howItWorks": "Comment ça marche",
    "nav.global": "Mondial",
    "nav.dashboard": "Tableau de bord",
    "nav.discover": "Découvrir",
    "nav.offers": "Offres",
    "nav.cart": "Panier",
    "nav.profile": "Profil",
    "nav.signIn": "Connexion",
    "nav.joinFree": "Rejoindre",
    "nav.signOut": "Déconnexion",
    "nav.notifications": "Notifications",
    // Discover
    "discover.title": "Découvrir les",
    "discover.birthdays": "Anniversaires",
    "discover.subtitle": "Trouvez quelqu'un à célébrer aujourd'hui",
    "discover.search": "Rechercher par nom ou pays...",
    "discover.twins": "Trouver mes jumeaux d'anniversaire",
    "discover.surprise": "Surprendre quelqu'un aujourd'hui",
    "discover.noResults": "Aucune page d'anniversaire trouvée. Soyez le premier !",
    "discover.sendWish": "Envoyer un vœu",
    "discover.wishes": "vœux",
    "discover.potTarget": "Objectif cagnotte",
    // Celebrate
    "celebrate.sendWish": "Envoyer un vœu d'anniversaire",
    "celebrate.addToCart": "Ajouter au panier",
    "celebrate.wishesArrived": "vœux sont arrivés de",
    "celebrate.countries": "pays",
    "celebrate.yourWish": "Votre vœu d'anniversaire",
    "celebrate.photoVideoHint": "Une photo ou vidéo + vos mots sincères",
    "celebrate.writeSomething": "Écrivez quelque chose dont ils se souviendront...",
    "celebrate.minChars": "Au moins 10 caractères requis",
    "celebrate.continue": "Continuer",
    "celebrate.backToWish": "Retour au vœu",
    "celebrate.addGift": "Ajouter un cadeau d'anniversaire ?",
    "celebrate.evenOneDollar": "Même 1$ du monde entier compte.",
    "celebrate.sendWithGift": "Envoyer le vœu avec cadeau",
    "celebrate.sendWithout": "Envoyer le vœu seulement",
    "celebrate.pageNotFound": "Page d'anniversaire introuvable",
    // Cart
    "cart.title": "Panier de cadeaux",
    "cart.subtitle": "Envoyez des cadeaux à plusieurs personnes en une fois",
    "cart.empty": "Votre panier est vide",
    "cart.emptyHint": "Ajoutez des personnes depuis leurs pages d'anniversaire après avoir envoyé un vœu.",
    "cart.totalBudget": "Budget total",
    "cart.distributeEvenly": "Répartir également",
    "cart.message": "Message pour tous",
    "cart.messagePlaceholder": "Écrivez un message...",
    "cart.duplicateAll": "Dupliquer pour tous",
    "cart.sendAll": "Envoyer tous les cadeaux",
    "cart.deliveryNote": "Vos cadeaux seront livrés le jour de l'anniversaire de chaque personne",
    "cart.fee": "Frais de traitement",
    "cart.remove": "Retirer",
    // Offers
    "offers.title": "Offres d'anniversaire",
    "offers.nearYou": "Près de chez vous",
    "offers.subtitle": "Offres spéciales des entreprises qui célèbrent avec vous",
    "offers.comingSoon": "Bientôt disponible",
    "offers.comingSoonText": "Les offres d'anniversaire dans votre région arrivent bientôt. Nous construisons des partenariats.",
    "offers.claim": "Réclamer l'offre",
    "offers.validDates": "Valide",
    "offers.redemption": "Échange",
    // General
    "general.loading": "Chargement...",
    "general.save": "Enregistrer",
    "general.cancel": "Annuler",
    "general.confirm": "Confirmer",
    "general.back": "Retour",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("bdcore_lang");
    return (saved === "fr" ? "fr" : "en") as Language;
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("bdcore_lang", lang);
  }, []);

  const t = useCallback(
    (key: string) => translations[language]?.[key] || translations["en"]?.[key] || key,
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

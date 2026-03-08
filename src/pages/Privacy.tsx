import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const sections = [
  {
    title: "1. What Data We Collect",
    body: "We collect information you provide directly: name, email address, date of birth, country, city, profile photos, wish content (photos, videos, messages), and payment information. We also collect usage data such as device information, browser type, IP address, and interaction patterns within the platform.",
  },
  {
    title: "2. How We Use Your Data",
    body: "Your data is used to operate and improve BirthdayCORE: delivering birthday wishes, processing payments, compiling birthday videos, personalizing your experience, sending notifications, preventing fraud, and generating aggregated analytics. We never use your data for advertising or sell it to third parties.",
  },
  {
    title: "3. Who We Share Data With",
    body: "We share data only with trusted service providers essential to operating BirthdayCORE: Stripe (payment processing), Mux (video compilation and delivery), Google Translate (language translation services), and Flutterwave (payment processing for select regions). Each provider is contractually required to protect your data and use it only for the services they provide to us.",
  },
  {
    title: "4. Data Storage and Security",
    body: "Your data is stored securely using industry-standard encryption at rest and in transit. We use Supabase for database services with row-level security policies. Media files are stored in secure cloud storage. We conduct regular security reviews and implement access controls to protect your information.",
  },
  {
    title: "5. Your Rights (GDPR)",
    body: "If you are in the European Union, you have the right to: access your personal data, rectify inaccurate data, erase your data (right to be forgotten), restrict processing, data portability, and object to processing. To exercise any of these rights, contact us through our Support page. We will respond within 30 days.",
  },
  {
    title: "6. Cookie Policy",
    body: "BirthdayCORE uses essential cookies for authentication and session management. Optional cookies are used for analytics and experience improvements. You can manage your cookie preferences through the cookie consent banner. Essential cookies cannot be disabled as they are required for the platform to function.",
  },
  {
    title: "7. Children's Privacy",
    body: "BirthdayCORE is not intended for users under 18 years of age. We do not knowingly collect personal data from anyone under 18. If we become aware that a user is under 18, we will immediately delete their account and all associated data. If you believe a minor is using BirthdayCORE, please contact us immediately.",
  },
  {
    title: "8. Contact Information",
    body: "For any privacy-related questions, concerns, or data requests, please contact our Data Protection team through the Support page at /support or email privacy@birthdaycore.com. For EU residents, you also have the right to lodge a complaint with your local data protection authority.",
  },
];

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="text-xs text-muted-foreground mb-2">Last updated: March 8, 2026</p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">
          Privacy <span className="text-gradient-gold">Policy</span>
        </h1>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-semibold text-gradient-gold mb-2">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;

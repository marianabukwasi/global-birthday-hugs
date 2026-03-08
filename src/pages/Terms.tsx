import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const sections = [
  {
    title: "1. Introduction",
    body: "Welcome to BirthdayCORE. These Terms of Service govern your use of the BirthdayCORE platform, including all features, content, and services offered. By accessing or using BirthdayCORE, you agree to be bound by these terms. If you do not agree, please do not use the platform.",
  },
  {
    title: "2. Who Can Use BirthdayCORE",
    body: "You must be at least 18 years old to create an account on BirthdayCORE. By registering, you confirm that you are 18 or older. If we discover that an account holder is under 18, the account will be terminated immediately and no refunds will be issued for any contributions or purchases made.",
  },
  {
    title: "3. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. BirthdayCORE reserves the right to suspend or terminate accounts that violate these terms.",
  },
  {
    title: "4. Payments and Subscriptions",
    body: "Certain features on BirthdayCORE may involve payments processed through Stripe. All payment information is handled securely by our payment processor. You agree to provide accurate billing information. Refunds are subject to our refund policy.",
  },
  {
    title: "5. Birthday Pot and Cashout Policy",
    body: "The Birthday Pot collects monetary gifts from Givers on behalf of Receivers. Funds are held securely via Stripe Connect. Receivers may cash out their Birthday Pot after their birthday reveal. Processing fees and platform fees may apply. BirthdayCORE is not responsible for disputes between Givers and Receivers regarding gift amounts.",
  },
  {
    title: "6. User Content",
    body: "By submitting content (photos, videos, messages) to BirthdayCORE, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content within the platform. You retain ownership of your content. You are solely responsible for ensuring your content does not violate any laws or third-party rights.",
  },
  {
    title: "7. Content Reporting and Removal",
    body: "Users may report inappropriate or harmful content through our reporting system. BirthdayCORE reviews all reports and reserves the right to remove content or suspend accounts that violate community guidelines. We aim to process reports within 48 hours.",
  },
  {
    title: "8. Intellectual Property",
    body: "The BirthdayCORE name, logo, design, and all associated branding are the intellectual property of BirthdayCORE. You may not reproduce, distribute, or create derivative works without our prior written consent. The platform's code, algorithms, and unique features are proprietary.",
  },
  {
    title: "9. Privacy and Data",
    body: "Your privacy is important to us. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your data. By using BirthdayCORE, you consent to our data practices as described in the Privacy Policy.",
  },
  {
    title: "10. Limitation of Liability",
    body: "BirthdayCORE is provided \"as is\" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you have paid to BirthdayCORE in the twelve months preceding the claim.",
  },
  {
    title: "11. Governing Law",
    body: "These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of BirthdayCORE shall be resolved through binding arbitration or in the courts of competent jurisdiction.",
  },
  {
    title: "12. Contact Information",
    body: "If you have questions about these Terms of Service, please contact us through our Support page or email us at support@birthdaycore.com.",
  },
];

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="text-xs text-muted-foreground mb-2">Last updated: March 8, 2026</p>
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">
          Terms of <span className="text-gradient-gold">Service</span>
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

export default Terms;

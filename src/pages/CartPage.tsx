import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Copy, Globe, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateAmount, updateMessage, distributeEvenly, duplicateMessage, clearCart, total } = useCart();
  const { t } = useI18n();
  const [budget, setBudget] = useState("");
  const [globalMessage, setGlobalMessage] = useState("");

  const fee = total * 0.029 + (items.length > 0 ? 0.3 : 0);

  const handleSendAll = () => {
    if (items.length === 0) return;
    toast({ title: "Gifts sent! 🎁", description: `${items.length} gifts totaling $${total.toFixed(2)} are being processed.` });
    clearCart();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("cart.title")}
          </h1>
          <p className="text-muted-foreground">{t("cart.subtitle")}</p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-card border border-border p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">{t("cart.empty")}</h3>
            <p className="text-muted-foreground mb-6">{t("cart.emptyHint")}</p>
            <Button onClick={() => navigate("/discover")} variant="outline" className="border-border text-foreground">
              {t("nav.discover")}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Budget */}
            <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-4">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">{t("cart.totalBudget")}</label>
              <div className="relative flex-1 max-w-[160px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  min={1}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-7 bg-secondary/50 border-border text-foreground"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-border text-foreground"
                onClick={() => { const b = parseFloat(budget); if (b > 0) distributeEvenly(b); }}
              >
                {t("cart.distributeEvenly")}
              </Button>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {items.map((item, i) => (
                <motion.div
                  key={item.recipientId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl bg-card border border-border p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {item.country}
                      </p>
                    </div>
                    <div className="relative w-24">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        type="number"
                        min={1}
                        value={item.amount}
                        onChange={(e) => updateAmount(item.recipientId, parseFloat(e.target.value) || 1)}
                        className="pl-7 bg-secondary/50 border-border text-foreground text-sm"
                      />
                    </div>
                    <button onClick={() => removeItem(item.recipientId)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <Textarea
                    value={item.message}
                    onChange={(e) => updateMessage(item.recipientId, e.target.value)}
                    placeholder={t("cart.messagePlaceholder")}
                    className="bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground text-sm min-h-[60px] resize-none"
                  />
                </motion.div>
              ))}
            </div>

            {/* Global message */}
            <div className="rounded-xl bg-card border border-border p-4 space-y-3">
              <label className="text-sm font-medium text-foreground">{t("cart.message")}</label>
              <Textarea
                value={globalMessage}
                onChange={(e) => setGlobalMessage(e.target.value)}
                placeholder={t("cart.messagePlaceholder")}
                className="bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground min-h-[80px] resize-none"
              />
              <Button
                size="sm"
                variant="outline"
                className="border-border text-foreground gap-2"
                onClick={() => { if (globalMessage.trim()) duplicateMessage(globalMessage); }}
              >
                <Copy className="w-4 h-4" /> {t("cart.duplicateAll")}
              </Button>
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-card border border-border p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} gifts)</span>
                <span className="text-foreground">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cart.fee")}</span>
                <span className="text-muted-foreground">${fee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${(total + fee).toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">{t("cart.deliveryNote")}</p>

            <Button
              onClick={handleSendAll}
              className="w-full h-12 bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 text-lg gap-2"
            >
              <CreditCard className="w-5 h-5" /> {t("cart.sendAll")}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;

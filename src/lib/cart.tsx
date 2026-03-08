import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  recipientId: string;
  name: string;
  country: string;
  amount: number; // dollars
  message: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "amount" | "message">) => void;
  removeItem: (recipientId: string) => void;
  updateAmount: (recipientId: string, amount: number) => void;
  updateMessage: (recipientId: string, message: string) => void;
  distributeEvenly: (totalBudget: number) => void;
  duplicateMessage: (message: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateAmount: () => {},
  updateMessage: () => {},
  distributeEvenly: () => {},
  duplicateMessage: () => {},
  clearCart: () => {},
  total: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Omit<CartItem, "amount" | "message">) => {
    setItems((prev) => {
      if (prev.find((i) => i.recipientId === item.recipientId)) return prev;
      return [...prev, { ...item, amount: 1, message: "" }];
    });
  }, []);

  const removeItem = useCallback((recipientId: string) => {
    setItems((prev) => prev.filter((i) => i.recipientId !== recipientId));
  }, []);

  const updateAmount = useCallback((recipientId: string, amount: number) => {
    setItems((prev) => prev.map((i) => (i.recipientId === recipientId ? { ...i, amount: Math.max(1, amount) } : i)));
  }, []);

  const updateMessage = useCallback((recipientId: string, message: string) => {
    setItems((prev) => prev.map((i) => (i.recipientId === recipientId ? { ...i, message } : i)));
  }, []);

  const distributeEvenly = useCallback((totalBudget: number) => {
    setItems((prev) => {
      if (prev.length === 0) return prev;
      const each = Math.floor((totalBudget / prev.length) * 100) / 100;
      return prev.map((i) => ({ ...i, amount: Math.max(1, each) }));
    });
  }, []);

  const duplicateMessage = useCallback((message: string) => {
    setItems((prev) => prev.map((i) => ({ ...i, message })));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.amount, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateAmount, updateMessage, distributeEvenly, duplicateMessage, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

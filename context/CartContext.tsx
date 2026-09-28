"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CartItem, ServiceItem } from "@/types";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (service: ServiceItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Dynamic Backend Cart Fetching
  const fetchCartFromBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        if (data && data.items && Array.isArray(data.items)) {
          setCart(data.items);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user cart from backend:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartFromBackend();
    } else {
      setCart([]);
    }
  }, [isAuthenticated, user?.email, fetchCartFromBackend]);

  const syncCartToBackend = useCallback(async (newCart: CartItem[]) => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newCart, email: user?.email }),
      });
    } catch (err) {
      console.error("Failed to sync cart to backend:", err);
    }
  }, [user?.email]);

  const addToCart = useCallback((service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === service.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem: CartItem = {
          ...service,
          quantity: 1,
        };
        updated = [...prev, newItem];
      }
      syncCartToBackend(updated);
      return updated;
    });
  }, [syncCartToBackend]);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      syncCartToBackend(updated);
      return updated;
    });
  }, [syncCartToBackend]);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      syncCartToBackend(updated);
      return updated;
    });
  }, [syncCartToBackend]);

  const clearCart = useCallback(() => {
    setCart([]);
    syncCartToBackend([]);
  }, [syncCartToBackend]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const contextValue = useMemo(() => ({
    cart,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
  }), [
    cart,
    cartCount,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cart: [],
      cartCount: 0,
      isCartOpen: false,
      setIsCartOpen: () => {},
      openCart: () => {},
      closeCart: () => {},
      addToCart: () => {},
      updateQuantity: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      isLoading: false,
    };
  }
  return context;
}

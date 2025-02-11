"use client";
import { createContext, useContext, useState } from "react";

// 創建 Context
const CartContext = createContext();

// cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 加入商品到購物車
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // 移除商品
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  console.log(cart);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

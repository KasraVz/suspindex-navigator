import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  bookingDate?: Date;
  bookingTime?: string;
  status?: string;
}

export interface UnpaidOrder {
  id: string;
  testName: string;
  amount: number;
  dateAdded: string;
  bookingDate?: Date;
  bookingTime?: string;
  status?: string;
}

interface OrderContextType {
  cartItems: CartItem[];
  unpaidOrders: UnpaidOrder[];
  addToCart: (items: CartItem[]) => void;
  removeFromCart: (id: string) => void;
  addToUnpaidOrders: (items: UnpaidOrder[]) => void;
  removeFromUnpaidOrders: (id: string) => void;
  clearCart: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrder[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedUnpaid = localStorage.getItem('unpaidOrders');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Parse dates back from strings
        const cartWithDates = parsedCart.map((item: any) => ({
          ...item,
          bookingDate: item.bookingDate ? new Date(item.bookingDate) : undefined
        }));
        setCartItems(cartWithDates);
      } catch (error) {
        console.error('Error parsing saved cart items:', error);
      }
    }
    
    if (savedUnpaid) {
      try {
        const parsedUnpaid = JSON.parse(savedUnpaid);
        // Parse dates back from strings
        const unpaidWithDates = parsedUnpaid.map((item: any) => ({
          ...item,
          bookingDate: item.bookingDate ? new Date(item.bookingDate) : undefined
        }));
        setUnpaidOrders(unpaidWithDates);
      } catch (error) {
        console.error('Error parsing saved unpaid orders:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('unpaidOrders', JSON.stringify(unpaidOrders));
  }, [unpaidOrders]);

  const addToCart = (items: CartItem[]) => {
    setCartItems(prev => [...prev, ...items]);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const addToUnpaidOrders = (items: UnpaidOrder[]) => {
    setUnpaidOrders(prev => [...prev, ...items]);
  };

  const removeFromUnpaidOrders = (id: string) => {
    setUnpaidOrders(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <OrderContext.Provider
      value={{
        cartItems,
        unpaidOrders,
        addToCart,
        removeFromCart,
        addToUnpaidOrders,
        removeFromUnpaidOrders,
        clearCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
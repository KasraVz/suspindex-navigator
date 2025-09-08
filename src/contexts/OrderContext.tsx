import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  bookingDate?: Date;
  bookingTime?: string;
  status?: string;
  bundleId?: string;
}

export interface UnpaidOrder {
  id: string;
  testName: string;
  amount: number;
  dateAdded: string;
  bookingDate?: Date;
  bookingTime?: string;
  status?: string;
  bundleId?: string;
}

export interface BookedItem {
  id: string;
  testName: string;
  bookingDate: Date;
  bookingTime: string;
  type: string;
  testTime: string;
}

export interface PaidItem {
  id: string;
  testName: string;
  amount: number;
  datePaid: string;
  bookingDate?: Date;
  bookingTime?: string;
}

interface OrderContextType {
  cartItems: CartItem[];
  unpaidOrders: UnpaidOrder[];
  bookedItems: BookedItem[];
  paidItems: PaidItem[];
  addToCart: (items: CartItem[]) => void;
  removeFromCart: (id: string) => void;
  addToUnpaidOrders: (items: UnpaidOrder[]) => void;
  removeFromUnpaidOrders: (id: string) => void;
  removeUnpaidBundle: (bundleId: string) => void;
  addToBookedItems: (items: BookedItem[]) => void;
  removeFromBookedItems: (id: string) => void;
  addToPaidItems: (items: PaidItem[]) => void;
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
  const [bookedItems, setBookedItems] = useState<BookedItem[]>([]);
  const [paidItems, setPaidItems] = useState<PaidItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedUnpaid = localStorage.getItem('unpaidOrders');
    const savedBooked = localStorage.getItem('bookedItems');
    const savedPaid = localStorage.getItem('paidItems');
    
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

    if (savedBooked) {
      try {
        const parsedBooked = JSON.parse(savedBooked);
        const bookedWithDates = parsedBooked.map((item: any) => ({
          ...item,
          bookingDate: new Date(item.bookingDate)
        }));
        setBookedItems(bookedWithDates);
      } catch (error) {
        console.error('Error parsing saved booked items:', error);
      }
    }

    if (savedPaid) {
      try {
        const parsedPaid = JSON.parse(savedPaid);
        const paidWithDates = parsedPaid.map((item: any) => ({
          ...item,
          bookingDate: item.bookingDate ? new Date(item.bookingDate) : undefined
        }));
        setPaidItems(paidWithDates);
      } catch (error) {
        console.error('Error parsing saved paid items:', error);
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

  useEffect(() => {
    localStorage.setItem('bookedItems', JSON.stringify(bookedItems));
  }, [bookedItems]);

  useEffect(() => {
    localStorage.setItem('paidItems', JSON.stringify(paidItems));
  }, [paidItems]);

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

  const removeUnpaidBundle = (bundleId: string) => {
    setUnpaidOrders(prev => prev.filter(item => item.bundleId !== bundleId));
  };

  const addToBookedItems = (items: BookedItem[]) => {
    setBookedItems(prev => [...prev, ...items]);
  };

  const removeFromBookedItems = (id: string) => {
    setBookedItems(prev => prev.filter(item => item.id !== id));
  };

  const addToPaidItems = (items: PaidItem[]) => {
    setPaidItems(prev => [...prev, ...items]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <OrderContext.Provider
      value={{
        cartItems,
        unpaidOrders,
        bookedItems,
        paidItems,
        addToCart,
        removeFromCart,
        addToUnpaidOrders,
        removeFromUnpaidOrders,
        removeUnpaidBundle,
        addToBookedItems,
        removeFromBookedItems,
        addToPaidItems,
        clearCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
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
  testStatus?: "not_taken" | "taken" | "scheduled";
  kycStatus?: "pending" | "approved" | "rejected";
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
  removeOrder: (id: string) => boolean;
  canRemoveOrder: (id: string) => boolean;
  bookOrder: (orderId: string, bookingData: { bookingDate: Date; bookingTime: string; testTime: string }) => void;
  cancelBooking: (id: string) => void;
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

  // Initialize mock data if localStorage is empty
  const initializeMockData = () => {
    const mockUnpaidOrders: UnpaidOrder[] = [
      {
        id: "unpaid-1",
        testName: "FPA",
        amount: 85,
        dateAdded: "2024-01-15",
        status: "pending",
        testStatus: "not_taken",
        kycStatus: "pending"
      },
      {
        id: "unpaid-2", 
        testName: "GEB",
        amount: 75,
        dateAdded: "2024-01-10",
        bookingDate: new Date("2024-02-20"),
        bookingTime: "2:00 PM",
        status: "booked",
        testStatus: "scheduled",
        kycStatus: "pending"
      },
      {
        id: "bundle-1-fpa",
        testName: "FPA",
        amount: 85,
        dateAdded: "2024-01-05",
        bundleId: "bundle-001",
        bookingDate: new Date("2024-02-25"),
        bookingTime: "10:00 AM",
        status: "booked",
        testStatus: "scheduled",
        kycStatus: "pending"
      },
      {
        id: "bundle-1-geb",
        testName: "GEB", 
        amount: 75,
        dateAdded: "2024-01-05",
        bundleId: "bundle-001",
        bookingDate: new Date("2024-02-26"),
        bookingTime: "2:00 PM",
        status: "booked",
        testStatus: "scheduled",
        kycStatus: "pending"
      },
      {
        id: "bundle-1-eea",
        testName: "EEA",
        amount: 95,
        dateAdded: "2024-01-05", 
        bundleId: "bundle-001",
        status: "pending",
        testStatus: "not_taken",
        kycStatus: "pending"
      }
    ];

    const mockBookedItems: BookedItem[] = [
      {
        id: "unpaid-2",
        testName: "GEB",
        bookingDate: new Date("2024-02-20"),
        bookingTime: "2:00 PM",
        type: "Individual Assessment",
        testTime: "90 minutes"
      },
      {
        id: "bundle-1-fpa",
        testName: "FPA",
        bookingDate: new Date("2024-02-25"),
        bookingTime: "10:00 AM",
        type: "Bundle Assessment",
        testTime: "120 minutes"
      },
      {
        id: "bundle-1-geb", 
        testName: "GEB",
        bookingDate: new Date("2024-02-26"),
        bookingTime: "2:00 PM",
        type: "Bundle Assessment",
        testTime: "90 minutes"
      }
    ];

    const mockPaidItems: PaidItem[] = [
      {
        id: "paid-1",
        testName: "CPA",
        amount: 120,
        datePaid: "2023-12-15",
        bookingDate: new Date("2023-12-20"),
        bookingTime: "9:00 AM"
      },
      {
        id: "paid-2",
        testName: "MBA",
        amount: 150,
        datePaid: "2024-02-01"
      }
    ];

    setUnpaidOrders(mockUnpaidOrders);
    setBookedItems(mockBookedItems);
    setPaidItems(mockPaidItems);
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedUnpaid = localStorage.getItem('unpaidOrders');
    const savedBooked = localStorage.getItem('bookedItems');
    const savedPaid = localStorage.getItem('paidItems');
    
    // Initialize mock data if no saved data exists
    if (!savedUnpaid && !savedBooked && !savedPaid) {
      initializeMockData();
      return;
    }
    
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

  // Unified order removal - only allow if unpaid and not taken
  const canRemoveOrder = (id: string): boolean => {
    const unpaidOrder = unpaidOrders.find(order => order.id === id);
    if (!unpaidOrder) return false;
    
    // Check if it's paid
    const isPaid = paidItems.some(item => item.id === id);
    if (isPaid) return false;
    
    // Check if test is taken
    if (unpaidOrder.testStatus === "taken") return false;
    
    return true;
  };

  const removeOrder = (id: string): boolean => {
    if (!canRemoveOrder(id)) {
      return false;
    }

    try {
      // Remove from unpaid orders
      setUnpaidOrders(prev => prev.filter(item => item.id !== id));
      
      // Remove from booked items if exists
      setBookedItems(prev => prev.filter(item => item.id !== id));
      
      // Remove from cart if exists
      setCartItems(prev => prev.filter(item => item.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error removing order:', error);
      return false;
    }
  };

  const bookOrder = (orderId: string, bookingData: { bookingDate: Date; bookingTime: string; testTime: string }) => {
    // Update unpaid order with booking info
    setUnpaidOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            bookingDate: bookingData.bookingDate, 
            bookingTime: bookingData.bookingTime,
            testStatus: "scheduled" as const,
            status: "booked"
          }
        : order
    ));

    // Add to booked items
    const unpaidOrder = unpaidOrders.find(order => order.id === orderId);
    if (unpaidOrder) {
      const bookedItem: BookedItem = {
        id: orderId,
        testName: unpaidOrder.testName,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        type: unpaidOrder.bundleId ? "Bundle Assessment" : "Individual Assessment",
        testTime: bookingData.testTime
      };
      
      setBookedItems(prev => {
        // Avoid duplicates
        const exists = prev.some(item => item.id === orderId);
        if (exists) return prev;
        return [...prev, bookedItem];
      });
    }
  };

  const cancelBooking = (id: string) => {
    // Update unpaid order to remove booking info but keep order
    setUnpaidOrders(prev => prev.map(order => 
      order.id === id 
        ? { 
            ...order, 
            bookingDate: undefined, 
            bookingTime: undefined,
            testStatus: "not_taken" as const,
            status: "pending"
          }
        : order
    ));

    // Remove from booked items
    setBookedItems(prev => prev.filter(item => item.id !== id));
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
        removeOrder,
        canRemoveOrder,
        bookOrder,
        cancelBooking,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
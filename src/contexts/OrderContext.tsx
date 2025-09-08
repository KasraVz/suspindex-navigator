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
  orderId: string;
  testName: string;
  amount: number;
  dateAdded: string;
  bookingDate?: Date;
  bookingTime?: string;
  status?: string;
  bundleId?: string;
  assessmentType?: string;
  testStatus?: 'not_taken' | 'in_progress' | 'completed';
  kycStatus?: 'pending' | 'approved' | 'rejected';
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
  orderId: string;
  testName: string;
  amount: number;
  datePaid: string;
  bookingDate?: Date;
  bookingTime?: string;
  assessmentType?: string;
  testStatus?: 'not_taken' | 'in_progress' | 'completed';
  kycStatus?: 'pending' | 'approved' | 'rejected';
}

export interface UnifiedOrder {
  id: string;
  orderId: string;
  testName: string;
  amount: number;
  paymentStatus: 'paid' | 'unpaid';
  testStatus: 'not_taken' | 'in_progress' | 'completed';
  kycStatus: 'pending' | 'approved' | 'rejected';
  overallStatus: 'pending_payment' | 'pending_kyc' | 'ready_to_take' | 'in_progress' | 'completed';
  dateAdded?: string;
  datePaid?: string;
  bookingDate?: Date;
  bookingTime?: string;
  bundleId?: string;
  assessmentType?: string;
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
  removeOrder: (id: string) => boolean;
  getAllOrders: () => UnifiedOrder[];
  canRemoveOrder: (id: string) => boolean;
  clearCart: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  console.log('useOrders called, context:', context);
  if (!context) {
    console.error('OrderContext is undefined - OrderProvider not found in component tree');
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  console.log('OrderProvider rendering');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrder[]>([]);
  const [bookedItems, setBookedItems] = useState<BookedItem[]>([]);
  const [paidItems, setPaidItems] = useState<PaidItem[]>([]);

  // Simple initialization without complex mock data
  useEffect(() => {
    console.log('OrderProvider useEffect running');
    
    const savedCart = localStorage.getItem('cartItems');
    const savedUnpaid = localStorage.getItem('unpaidOrders');
    const savedBooked = localStorage.getItem('bookedItems');
    const savedPaid = localStorage.getItem('paidItems');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
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
        const unpaidWithDates = parsedUnpaid.map((item: any) => ({
          ...item,
          bookingDate: item.bookingDate ? new Date(item.bookingDate) : undefined
        }));
        setUnpaidOrders(unpaidWithDates);
      } catch (error) {
        console.error('Error parsing saved unpaid orders:', error);
      }
    } else {
      // Add simple mock data only if no saved data
      setUnpaidOrders([{
        id: 'unpaid-1',
        orderId: 'ORD-2024-001',
        testName: 'Financial Planning & Analysis (FPA)',
        amount: 299,
        dateAdded: '2024-01-15',
        assessmentType: 'FPA',
        testStatus: 'not_taken',
        kycStatus: 'approved',
        status: 'unpaid'
      }]);
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

  const canRemoveOrder = (id: string): boolean => {
    // Check if order exists in unpaid orders
    const unpaidOrder = unpaidOrders.find(order => order.id === id);
    if (!unpaidOrder) return false;
    
    // Only allow removal if test hasn't been taken
    return unpaidOrder.testStatus === 'not_taken';
  };

  const removeOrder = (id: string): boolean => {
    if (!canRemoveOrder(id)) return false;

    // Remove from unpaid orders
    setUnpaidOrders(prev => prev.filter(order => order.id !== id));
    
    // Remove from booked items if it exists there
    setBookedItems(prev => prev.filter(item => item.id !== id));
    
    return true;
  };

  const getAllOrders = (): UnifiedOrder[] => {
    const allOrders: UnifiedOrder[] = [];

    // Add unpaid orders
    unpaidOrders.forEach(order => {
      allOrders.push({
        ...order,
        paymentStatus: 'unpaid',
        testStatus: order.testStatus || 'not_taken',
        kycStatus: order.kycStatus || 'pending',
        overallStatus: order.kycStatus === 'approved' ? 'pending_payment' : 'pending_kyc'
      });
    });

    // Add paid orders
    paidItems.forEach(item => {
      allOrders.push({
        ...item,
        id: item.id,
        dateAdded: item.datePaid,
        paymentStatus: 'paid',
        testStatus: item.testStatus || 'not_taken',
        kycStatus: item.kycStatus || 'approved',
        overallStatus: item.testStatus === 'completed' ? 'completed' : 
                      item.testStatus === 'in_progress' ? 'in_progress' : 'ready_to_take'
      });
    });

    return allOrders.sort((a, b) => 
      new Date(b.dateAdded || b.datePaid || '').getTime() - 
      new Date(a.dateAdded || a.datePaid || '').getTime()
    );
  };

  const contextValue = {
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
    removeOrder,
    getAllOrders,
    canRemoveOrder,
    clearCart,
  };

  console.log('OrderProvider context value:', contextValue);

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};
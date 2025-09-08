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

  // Initialize comprehensive mock data if localStorage is empty
  const initializeMockData = () => {
    console.log('🏗️  Initializing comprehensive mock data...');
    
    const mockUnpaidOrders: UnpaidOrder[] = [
      // Individual unpaid orders - various statuses
      {
        id: "1",
        testName: "FPA",
        amount: 85,
        dateAdded: "2024-01-15",
        status: "pending",
        testStatus: "not_taken",
        kycStatus: "pending"
      },
      {
        id: "2", 
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
        id: "3",
        testName: "EEA",
        amount: 95,
        dateAdded: "2024-01-08",
        status: "pending",
        testStatus: "not_taken",
        kycStatus: "rejected"
      },
      {
        id: "4",
        testName: "CPA",
        amount: 120,
        dateAdded: "2024-01-12",
        bookingDate: new Date("2024-02-15"),
        bookingTime: "10:00 AM",
        status: "booked",
        testStatus: "scheduled",
        kycStatus: "approved"
      },
      
      // FPA + GEB Professional Bundle
      {
        id: "5",
        testName: "FPA",
        amount: 80,
        dateAdded: "2024-01-05",
        bundleId: "FPA_GEB_001",
        bookingDate: new Date("2024-02-25"),
        bookingTime: "10:00 AM",
        status: "booked",
        testStatus: "scheduled",
        kycStatus: "pending"
      },
      {
        id: "6",
        testName: "GEB", 
        amount: 70,
        dateAdded: "2024-01-05",
        bundleId: "FPA_GEB_001",
        bookingDate: new Date("2024-02-26"),
        bookingTime: "2:00 PM",
        status: "booked",
        testStatus: "scheduled",
        kycStatus: "pending"
      },
      
      // All Assessments Complete Package Bundle
      {
        id: "7",
        testName: "FPA",
        amount: 75,
        dateAdded: "2024-01-03",
        bundleId: "ALL_ASSESSMENTS_001",
        status: "pending",
        testStatus: "not_taken",
        kycStatus: "pending"
      },
      {
        id: "8",
        testName: "GEB",
        amount: 70,
        dateAdded: "2024-01-03",
        bundleId: "ALL_ASSESSMENTS_001",
        status: "pending",
        testStatus: "not_taken",
        kycStatus: "pending"
      },
      {
        id: "9",
        testName: "EEA",
        amount: 85,
        dateAdded: "2024-01-03",
        bundleId: "ALL_ASSESSMENTS_001",
        status: "pending",
        testStatus: "not_taken",
        kycStatus: "pending"
      },
      
      // Foundation Bundle (FPA + EEA)
      {
        id: "10",
        testName: "FPA",
        amount: 80,
        dateAdded: "2024-01-07",
        bundleId: "FOUNDATION_001",
        bookingDate: new Date("2024-02-28"),
        bookingTime: "9:00 AM",
        status: "booked",
        testStatus: "scheduled",
        kycStatus: "approved"
      },
      {
        id: "11",
        testName: "EEA",
        amount: 80,
        dateAdded: "2024-01-07",
        bundleId: "FOUNDATION_001",
        status: "pending",
        testStatus: "not_taken",
        kycStatus: "approved"
      }
    ];

    const mockBookedItems: BookedItem[] = [
      // Individual bookings
      {
        id: "2",
        testName: "GEB",
        bookingDate: new Date("2024-02-20"),
        bookingTime: "2:00 PM",
        type: "Individual Assessment",
        testTime: "90 minutes"
      },
      {
        id: "4",
        testName: "CPA",
        bookingDate: new Date("2024-02-15"),
        bookingTime: "10:00 AM",
        type: "Individual Assessment",
        testTime: "120 minutes"
      },
      
      // Bundle bookings - FPA + GEB Professional Bundle
      {
        id: "5",
        testName: "FPA",
        bookingDate: new Date("2024-02-25"),
        bookingTime: "10:00 AM",
        type: "Bundle Assessment (FPA + GEB Professional)",
        testTime: "120 minutes"
      },
      {
        id: "6", 
        testName: "GEB",
        bookingDate: new Date("2024-02-26"),
        bookingTime: "2:00 PM",
        type: "Bundle Assessment (FPA + GEB Professional)",
        testTime: "90 minutes"
      },
      
      // Foundation Bundle booking
      {
        id: "10",
        testName: "FPA",
        bookingDate: new Date("2024-02-28"),
        bookingTime: "9:00 AM",
        type: "Bundle Assessment (Foundation)",
        testTime: "120 minutes"
      }
    ];

    const mockPaidItems: PaidItem[] = [
      // Completed orders - test taken, KYC approved
      {
        id: "101",
        testName: "CPA",
        amount: 120,
        datePaid: "2023-12-15",
        bookingDate: new Date("2023-12-20"),
        bookingTime: "9:00 AM"
      },
      {
        id: "102",
        testName: "MBA",
        amount: 150,
        datePaid: "2024-01-01"
      },
      
      // Paid bundle - Professional Bundle completed
      {
        id: "103",
        testName: "FPA",
        amount: 80,
        datePaid: "2023-11-20",
        bookingDate: new Date("2023-11-25"),
        bookingTime: "10:00 AM"
      },
      {
        id: "104",
        testName: "GEB",
        amount: 70,
        datePaid: "2023-11-20",
        bookingDate: new Date("2023-11-26"),
        bookingTime: "2:00 PM"
      },
      
      // Paid but waiting for test/KYC
      {
        id: "105",
        testName: "EEA",
        amount: 95,
        datePaid: "2024-01-20",
        bookingDate: new Date("2024-02-10"),
        bookingTime: "1:00 PM"
      },
      {
        id: "106",
        testName: "Advanced Analytics",
        amount: 180,
        datePaid: "2024-02-01"
      },
      
      // Paid with various completion states
      {
        id: "107",
        testName: "Leadership Assessment",
        amount: 200,
        datePaid: "2024-01-25",
        bookingDate: new Date("2024-02-05"),
        bookingTime: "11:00 AM"
      }
    ];

    setUnpaidOrders(mockUnpaidOrders);
    setBookedItems(mockBookedItems);
    setPaidItems(mockPaidItems);
    localStorage.setItem('orderDataVersion', DATA_VERSION);
    
    console.log('📊 Mock data summary:');
    console.log(`  • Unpaid Orders: ${mockUnpaidOrders.length} (${new Set(mockUnpaidOrders.map(o => o.testName)).size} unique tests)`);
    console.log(`  • Booked Items: ${mockBookedItems.length}`);
    console.log(`  • Paid Items: ${mockPaidItems.length}`);
    console.log(`  • Data Version: ${DATA_VERSION}`);
  };

  // Data version for forcing updates when mock data changes
  const DATA_VERSION = "2024-01-v2";

  // Clear localStorage and reinitialize
  const clearStorageAndReinitialize = () => {
    console.log('🔄 Clearing localStorage and reinitializing with fresh mock data...');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('unpaidOrders');
    localStorage.removeItem('bookedItems');
    localStorage.removeItem('paidItems');
    localStorage.removeItem('orderDataVersion');
    localStorage.setItem('orderDataVersion', DATA_VERSION);
    initializeMockData();
    console.log('✅ Fresh mock data initialized with version:', DATA_VERSION);
  };

  // Enhanced data validation with duplicate detection and variety checks
  const isValidData = (data: any[], requiredFields: string[], dataType: string) => {
    if (!Array.isArray(data) || data.length === 0) {
      console.log(`❌ Invalid ${dataType}: not an array or empty`);
      return false;
    }

    // Check required fields
    const hasRequiredFields = data.every(item => 
      typeof item === 'object' && 
      requiredFields.every(field => item.hasOwnProperty(field))
    );
    
    if (!hasRequiredFields) {
      console.log(`❌ Invalid ${dataType}: missing required fields`);
      return false;
    }

    // Check for duplicate IDs
    const ids = data.map(item => item.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.log(`❌ Invalid ${dataType}: duplicate IDs found`, ids.filter((id, index) => ids.indexOf(id) !== index));
      return false;
    }

    // For unpaid orders, check for comprehensive test variety (should have FPA, GEB, EEA, etc.)
    if (dataType === 'unpaidOrders') {
      const testNames = data.map(item => item.testName);
      const uniqueTests = new Set(testNames);
      const expectedTests = ['FPA', 'GEB', 'EEA'];
      const hasVariety = expectedTests.some(test => uniqueTests.has(test));
      
      if (!hasVariety || uniqueTests.size < 3) {
        console.log(`❌ Invalid ${dataType}: insufficient test variety. Found:`, Array.from(uniqueTests), 'Expected at least:', expectedTests);
        return false;
      }
    }

    console.log(`✅ Valid ${dataType}: ${data.length} items, ${uniqueIds.size} unique IDs`);
    return true;
  };

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('🚀 Initializing order data...');
    
    // Check data version first
    const savedVersion = localStorage.getItem('orderDataVersion');
    if (savedVersion !== DATA_VERSION) {
      console.log(`📊 Data version mismatch. Saved: ${savedVersion}, Required: ${DATA_VERSION}`);
      clearStorageAndReinitialize();
      return;
    }

    const savedCart = localStorage.getItem('cartItems');
    const savedUnpaid = localStorage.getItem('unpaidOrders');
    const savedBooked = localStorage.getItem('bookedItems');
    const savedPaid = localStorage.getItem('paidItems');

    let validDataCount = 0;
    let totalExpectedSources = 3; // unpaid, booked, paid (cart is optional)
    
    // Try to load and validate saved unpaid orders
    if (savedUnpaid) {
      try {
        const parsedUnpaid = JSON.parse(savedUnpaid);
        if (isValidData(parsedUnpaid, ['id', 'testName', 'amount'], 'unpaidOrders')) {
          const unpaidWithDates = parsedUnpaid.map((item: any) => ({
            ...item,
            bookingDate: item.bookingDate ? new Date(item.bookingDate) : undefined
          }));
          setUnpaidOrders(unpaidWithDates);
          validDataCount++;
        }
      } catch (error) {
        console.error('❌ Error parsing saved unpaid orders:', error);
      }
    }

    // Try to load and validate saved booked items
    if (savedBooked) {
      try {
        const parsedBooked = JSON.parse(savedBooked);
        if (isValidData(parsedBooked, ['id', 'testName', 'bookingDate'], 'bookedItems')) {
          const bookedWithDates = parsedBooked.map((item: any) => ({
            ...item,
            bookingDate: new Date(item.bookingDate)
          }));
          setBookedItems(bookedWithDates);
          validDataCount++;
        }
      } catch (error) {
        console.error('❌ Error parsing saved booked items:', error);
      }
    }

    // Try to load and validate saved paid items
    if (savedPaid) {
      try {
        const parsedPaid = JSON.parse(savedPaid);
        if (isValidData(parsedPaid, ['id', 'testName', 'amount'], 'paidItems')) {
          const paidWithDates = parsedPaid.map((item: any) => ({
            ...item,
            bookingDate: item.bookingDate ? new Date(item.bookingDate) : undefined
          }));
          setPaidItems(paidWithDates);
          validDataCount++;
        }
      } catch (error) {
        console.error('❌ Error parsing saved paid items:', error);
      }
    }

    // Try to load cart items (optional, no validation needed)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          const cartWithDates = parsedCart.map((item: any) => ({
            ...item,
            bookingDate: item.bookingDate ? new Date(item.bookingDate) : undefined
          }));
          setCartItems(cartWithDates);
        }
      } catch (error) {
        console.error('❌ Error parsing saved cart items:', error);
      }
    }
    
    // If we don't have ALL expected data sources with valid data, reinitialize
    if (validDataCount < totalExpectedSources) {
      console.log(`⚠️  Incomplete data detected. Valid sources: ${validDataCount}/${totalExpectedSources}`);
      clearStorageAndReinitialize();
    } else {
      console.log(`✅ All data sources loaded successfully (${validDataCount}/${totalExpectedSources})`);
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
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Voucher {
  id: string;
  code: string;
  testType: string; // FPA, EEA, Bundle, etc.
  discountType: 'percentage';
  discountValue: 100; // Always 100% for these vouchers
  isUsed: boolean;
  expiryDate: string;
  source: 'scholarship' | 'referral';
  applicationId?: string; // For scholarship vouchers
}

interface VoucherContextType {
  vouchers: Voucher[];
  addVoucher: (voucher: Omit<Voucher, 'id' | 'code'>) => string;
  useVoucher: (code: string) => boolean;
  getVoucherByCode: (code: string) => Voucher | null;
  isVoucherValid: (code: string, testType: string) => boolean;
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export const useVoucher = () => {
  const context = useContext(VoucherContext);
  if (!context) {
    throw new Error('useVoucher must be used within a VoucherProvider');
  }
  return context;
};

export const VoucherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  // Load vouchers from localStorage on mount
  useEffect(() => {
    const savedVouchers = localStorage.getItem('lovable-vouchers');
    if (savedVouchers) {
      setVouchers(JSON.parse(savedVouchers));
    }
  }, []);

  // Save vouchers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lovable-vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  const generateVoucherCode = (source: string, testType: string): string => {
    const timestamp = Date.now().toString().slice(-6);
    const prefix = source === 'scholarship' ? 'SCH' : 'REF';
    return `${prefix}-${testType}-${timestamp}`;
  };

  const addVoucher = (voucherData: Omit<Voucher, 'id' | 'code'>): string => {
    const newVoucher: Voucher = {
      ...voucherData,
      id: Date.now().toString(),
      code: generateVoucherCode(voucherData.source, voucherData.testType),
    };
    
    setVouchers(prev => [...prev, newVoucher]);
    return newVoucher.code;
  };

  const useVoucher = (code: string): boolean => {
    const voucher = vouchers.find(v => v.code === code && !v.isUsed);
    if (!voucher) return false;

    // Check if expired
    if (new Date() > new Date(voucher.expiryDate)) return false;

    setVouchers(prev => prev.map(v => 
      v.code === code ? { ...v, isUsed: true } : v
    ));
    return true;
  };

  const getVoucherByCode = (code: string): Voucher | null => {
    return vouchers.find(v => v.code === code) || null;
  };

  const isVoucherValid = (code: string, testType: string): boolean => {
    const voucher = vouchers.find(v => v.code === code);
    if (!voucher || voucher.isUsed) return false;
    if (new Date() > new Date(voucher.expiryDate)) return false;
    return voucher.testType === testType || voucher.testType === 'Bundle';
  };

  return (
    <VoucherContext.Provider
      value={{
        vouchers,
        addVoucher,
        useVoucher,
        getVoucherByCode,
        isVoucherValid,
      }}
    >
      {children}
    </VoucherContext.Provider>
  );
};
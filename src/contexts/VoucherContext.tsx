import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Voucher {
  id: string;
  code: string;
  testType: string; // 'FPA', 'EEA', 'GEB', etc.
  discount: number; // Always 100 for free tests
  status: 'available' | 'used';
  source: 'scholarship' | 'referral';
  expiryDate?: Date;
  createdAt: Date;
  usedAt?: Date;
}

interface VoucherContextType {
  vouchers: Voucher[];
  generateVoucher: (testType: string, source: 'scholarship' | 'referral') => string;
  useVoucher: (code: string) => boolean;
  getAvailableVouchers: () => Voucher[];
  getVoucherByCode: (code: string) => Voucher | undefined;
  isVoucherValid: (code: string, testType: string) => boolean;
}

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export const useVouchers = () => {
  const context = useContext(VoucherContext);
  if (!context) {
    throw new Error('useVouchers must be used within a VoucherProvider');
  }
  return context;
};

export const VoucherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const generateVoucher = (testType: string, source: 'scholarship' | 'referral'): string => {
    const prefix = source === 'scholarship' ? 'SCHOL' : 'REF';
    const year = new Date().getFullYear();
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${prefix}-${testType}-${year}-${randomId}`;
    
    const newVoucher: Voucher = {
      id: `voucher-${Date.now()}`,
      code,
      testType,
      discount: 100,
      status: 'available',
      source,
      createdAt: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    };

    setVouchers(prev => [...prev, newVoucher]);
    return code;
  };

  const useVoucher = (code: string): boolean => {
    const voucher = vouchers.find(v => v.code === code && v.status === 'available');
    if (!voucher) return false;

    setVouchers(prev => 
      prev.map(v => 
        v.code === code 
          ? { ...v, status: 'used' as const, usedAt: new Date() }
          : v
      )
    );
    return true;
  };

  const getAvailableVouchers = (): Voucher[] => {
    return vouchers.filter(v => v.status === 'available');
  };

  const getVoucherByCode = (code: string): Voucher | undefined => {
    return vouchers.find(v => v.code === code);
  };

  const isVoucherValid = (code: string, testType: string): boolean => {
    const voucher = getVoucherByCode(code);
    if (!voucher) return false;
    if (voucher.status !== 'available') return false;
    if (voucher.testType !== testType) return false;
    if (voucher.expiryDate && voucher.expiryDate < new Date()) return false;
    return true;
  };

  const value: VoucherContextType = {
    vouchers,
    generateVoucher,
    useVoucher,
    getAvailableVouchers,
    getVoucherByCode,
    isVoucherValid,
  };

  return (
    <VoucherContext.Provider value={value}>
      {children}
    </VoucherContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AffiliationCode {
  id: string;
  partnerName: string;
  partnerType: string;
  code: string;
  requestedTests: string[];
  discounts: Record<string, number>;
  usedDiscounts: Record<string, boolean>;
  completedTests: string[];
  expiryDate: string;
  contactEmail: string;
  dateAdded: string;
}

interface AffiliationContextType {
  affiliationCodes: AffiliationCode[];
  addAffiliationCode: (code: string) => boolean;
  removeAffiliationCode: (id: string) => void;
  getAvailableTests: (codeId: string) => string[];
  markTestCompleted: (codeId: string, testType: string) => void;
  markDiscountUsed: (codeId: string, testType: string) => void;
  getDiscountForTest: (testType: string, affiliationCodeId?: string) => number;
}

const AffiliationContext = createContext<AffiliationContextType | undefined>(undefined);

export const useAffiliation = () => {
  const context = useContext(AffiliationContext);
  if (!context) {
    throw new Error('useAffiliation must be used within an AffiliationProvider');
  }
  return context;
};

const mockAffiliationData: Record<string, Omit<AffiliationCode, 'id' | 'dateAdded'>> = {
  'TECHSTARS2024FPA': {
    partnerName: 'TechStars Accelerator',
    partnerType: 'Accelerator',
    code: 'TECHSTARS2024FPA',
    requestedTests: ['FPA', 'EEA'],
    discounts: { FPA: 20, EEA: 15 },
    usedDiscounts: { FPA: false, EEA: false },
    completedTests: [],
    expiryDate: '2024-12-31',
    contactEmail: 'mentors@techstars.com'
  },
  'YC24BUNDLE': {
    partnerName: 'Y Combinator',
    partnerType: 'Accelerator',
    code: 'YC24BUNDLE',
    requestedTests: ['FPA', 'GEB', 'EEA'],
    discounts: { FPA: 25, GEB: 30, EEA: 20 },
    usedDiscounts: { FPA: false, GEB: false, EEA: false },
    completedTests: [],
    expiryDate: '2024-11-30',
    contactEmail: 'partners@ycombinator.com'
  },
  'STANFORD2024': {
    partnerName: 'Stanford StartX',
    partnerType: 'University Program',
    code: 'STANFORD2024',
    requestedTests: ['GEB', 'EEA'],
    discounts: { GEB: 35, EEA: 25 },
    usedDiscounts: { GEB: false, EEA: false },
    completedTests: [],
    expiryDate: '2024-10-15',
    contactEmail: 'startx@stanford.edu'
  }
};

export const AffiliationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [affiliationCodes, setAffiliationCodes] = useState<AffiliationCode[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('affiliationCodes');
    if (stored) {
      setAffiliationCodes(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('affiliationCodes', JSON.stringify(affiliationCodes));
  }, [affiliationCodes]);

  const addAffiliationCode = (code: string): boolean => {
    const mockData = mockAffiliationData[code];
    if (!mockData) {
      return false; // Invalid code
    }

    // Check if code already exists
    if (affiliationCodes.some(existing => existing.code === code)) {
      return false; // Code already added
    }

    const newAffiliationCode: AffiliationCode = {
      id: `aff-${Date.now()}`,
      ...mockData,
      dateAdded: new Date().toISOString()
    };

    setAffiliationCodes(prev => [...prev, newAffiliationCode]);
    return true;
  };

  const removeAffiliationCode = (id: string) => {
    setAffiliationCodes(prev => prev.filter(code => code.id !== id));
  };

  const getAvailableTests = (codeId: string): string[] => {
    const code = affiliationCodes.find(c => c.id === codeId);
    if (!code) return [];
    
    return code.requestedTests.filter(test => !code.completedTests.includes(test));
  };

  const markTestCompleted = (codeId: string, testType: string) => {
    setAffiliationCodes(prev => prev.map(code => 
      code.id === codeId
        ? { ...code, completedTests: [...code.completedTests, testType] }
        : code
    ));
  };

  const markDiscountUsed = (codeId: string, testType: string) => {
    setAffiliationCodes(prev => prev.map(code => 
      code.id === codeId
        ? { ...code, usedDiscounts: { ...code.usedDiscounts, [testType]: true } }
        : code
    ));
  };

  const getDiscountForTest = (testType: string, affiliationCodeId?: string): number => {
    if (!affiliationCodeId) return 0;
    
    const code = affiliationCodes.find(c => c.id === affiliationCodeId);
    if (!code || code.usedDiscounts[testType]) return 0;
    
    return code.discounts[testType] || 0;
  };

  return (
    <AffiliationContext.Provider value={{
      affiliationCodes,
      addAffiliationCode,
      removeAffiliationCode,
      getAvailableTests,
      markTestCompleted,
      markDiscountUsed,
      getDiscountForTest
    }}>
      {children}
    </AffiliationContext.Provider>
  );
};
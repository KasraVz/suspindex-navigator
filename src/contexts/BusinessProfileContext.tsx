import { createContext, useContext, useState, ReactNode } from "react";

export interface BusinessProfileData {
  startupName: string;
  startupWebsite: string;
  primaryIndustry: string;
  developmentStage: string;
  targetEcosystem: string;
}

interface BusinessProfileContextType {
  businessProfile: BusinessProfileData;
  updateBusinessProfile: (updates: Partial<BusinessProfileData>) => void;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | undefined>(undefined);

export const useBusinessProfile = () => {
  const context = useContext(BusinessProfileContext);
  if (!context) {
    throw new Error('useBusinessProfile must be used within a BusinessProfileProvider');
  }
  return context;
};

// Mock data - this would come from user registration data
const initialBusinessData: BusinessProfileData = {
  startupName: "TechFlow Solutions",
  startupWebsite: "https://www.techflowsolutions.com",
  primaryIndustry: "Software & SaaS",
  developmentStage: "Building Initial Traction/Early Customers",
  targetEcosystem: "Silicon Valley"
};

interface BusinessProfileProviderProps {
  children: ReactNode;
}

export const BusinessProfileProvider = ({ children }: BusinessProfileProviderProps) => {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfileData>(initialBusinessData);

  const updateBusinessProfile = (updates: Partial<BusinessProfileData>) => {
    setBusinessProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <BusinessProfileContext.Provider value={{ businessProfile, updateBusinessProfile }}>
      {children}
    </BusinessProfileContext.Provider>
  );
};
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface FrameContextType {
  selectedFrame: string | null;
  setSelectedFrame: (url: string | null) => void;
}

const FrameContext = createContext<FrameContextType | undefined>(undefined);

export const FrameProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const value = useMemo(() => ({ selectedFrame, setSelectedFrame }), [selectedFrame]);

  return (
    <FrameContext.Provider value={value}>
      {children}
    </FrameContext.Provider>
  );
};

export const useFrame = () => {
  const context = useContext(FrameContext);
  if (!context) {
    throw new Error('useFrame must be used within a FrameProvider');
  }
  return context;
};

import { createContext, useContext, useState } from 'react';

interface CoinContextType {
  selectedCoinSymbol: string; // Store only the symbol
  setSelectedCoinSymbol: (symbol: string) => void;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export function CoinProvider({ children }: { children: React.ReactNode }) {
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string>('BTC'); // Default to BTC

  return (
    <CoinContext.Provider value={{ selectedCoinSymbol, setSelectedCoinSymbol }}>
      {children}
    </CoinContext.Provider>
  );
}

export const useCoin = () => {
  const context = useContext(CoinContext);
  if (!context) throw new Error('useCoin must be used within CoinProvider');
  return context;
};

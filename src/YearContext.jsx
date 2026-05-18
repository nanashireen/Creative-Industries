import { createContext, useContext, useState } from 'react';

const YearContext = createContext();

export function YearProvider({ children }) {
  const [selectedYear, setSelectedYear] = useState(null);
  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYear() {
  return useContext(YearContext);
}
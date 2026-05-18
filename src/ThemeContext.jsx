import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isLight, setIsLight] = useState(false);
  const toggle = () => setIsLight(prev => !prev);
  return (
    <ThemeContext.Provider value={{ isLight, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
import { createContext, useContext, useState } from "react";

const BuyContext = createContext(null);

export function BuyProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <BuyContext.Provider value={{ open, setOpen }}>
      {children}
    </BuyContext.Provider>
  );
}

export function useBuy() {
  return useContext(BuyContext);
}

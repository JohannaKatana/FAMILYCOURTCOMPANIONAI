import React, { createContext, useContext, useState } from "react";
import { mockFloridaCase } from "../data/mockData";

type CaseContextType = {
  activeCase: typeof mockFloridaCase | null;
  setActiveCase: (c: typeof mockFloridaCase | null) => void;
};

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [activeCase, setActiveCase] = useState<typeof mockFloridaCase | null>(mockFloridaCase);

  return (
    <CaseContext.Provider value={{ activeCase, setActiveCase }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error("useCase must be used within a CaseProvider");
  }
  return context;
}
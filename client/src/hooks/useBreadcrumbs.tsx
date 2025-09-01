import React, { createContext, useContext, useState } from "react";

export interface CrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbContextProps {
  crumbs: CrumbItem[];
  setCrumbs: (items: CrumbItem[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextProps | undefined>(
  undefined
);

export function BreadcrumbsProvider({ children }: { children: React.ReactNode }) {
  const [crumbs, setCrumbs] = useState<CrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ crumbs, setCrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbsProvider");
  }
  return ctx;
}

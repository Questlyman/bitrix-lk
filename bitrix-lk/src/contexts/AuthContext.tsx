import { createContext, useState } from "react";
import type { Company } from "../models/Models";
type AuthContextValue = {
  company: Company | null;
  setCompany: (company: Company | null) => void;
};
export const AuthContext = createContext<AuthContextValue>({
  company: null,
  setCompany: () => {},
});
const STORAGE_KEY = "lk.company.v1";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [company, _setCompany] = useState<Company | null>(() => {
    try {
      const key: string | null = localStorage.getItem(STORAGE_KEY);
      return key ? JSON.parse(key) : null;
    } catch {
      return null;
    }
  });

  const setCompany = (next: Company | null) => {
    _setCompany(next);
    try {
      if (next) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      _setCompany(null);
    }
  };
  return (
    <AuthContext.Provider value={{ company, setCompany }}>
      {children}
    </AuthContext.Provider>
  );
};

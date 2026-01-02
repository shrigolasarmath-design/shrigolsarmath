import React, { createContext, useState, useContext } from 'react';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  transactions: Array<{
    id: string;
    type: 'seva' | 'donation';
    amount: number;
    date: string;
    details: string;
  }>;
}

interface UserContextType {
  user: User | null;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, phone: string, email: string) => Promise<boolean>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (phone: string, otp: string) => {
    return false;
  };

  const logout = () => setUser(null);

  const register = async (name: string, phone: string, email: string) => {
    // TODO: Integrate with backend
    setUser({
      id: phone,
      name,
      phone,
      email,
      transactions: [],
    });
    return true;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

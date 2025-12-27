'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Use public key for client-side operations
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const validateEnvVariables = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are missing.');
    throw new Error('Supabase environment variables are not set.');
  }
};

validateEnvVariables();

console.log('Supabase client initialized:', supabase);


interface AuthContextType {
  isLoggedIn: boolean;
  authLoaded: boolean;
  isUserLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  logoutUser: () => void;
  setLoggedIn: (value: boolean) => void;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedInState] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedInState] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Restore authentication state from localStorage on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    const userAuth = localStorage.getItem('userAuth');
    
    if (adminAuth === 'true') {
      setIsLoggedInState(true);
      console.log('Restored admin authentication from localStorage');
    }
    
    if (userAuth === 'true') {
      setIsUserLoggedInState(true);
      console.log('Restored user authentication from localStorage');
    }
    
    setMounted(true);
    console.log('AuthProvider mounted, auth restoration complete');
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { data: admin, error } = await supabase
        .from('admins')
        .select('password_hash')
        .eq('username', username)
        .single();

      if (error || !admin) {
        console.error('Admin not found or error:', error);
        return false;
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
      if (isPasswordValid) {
        return true; // Do not redirect yet; wait for OTP verification
      }

      console.error('Invalid password.');
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedInState(false);
    localStorage.removeItem('adminAuth');
  }, []);

  const logoutUser = useCallback(() => {
    setIsUserLoggedInState(false);
    localStorage.removeItem('userAuth');
    router.push('/');
  }, [router]);

  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, password_hash')
        .eq('email', email)
        .single();

      if (error || !user) {
        console.error('User not found or error:', error);
        return false;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (isPasswordValid) {
        setIsUserLoggedInState(true);
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userEmail', email);
        console.log('User logged in successfully');
        router.push('/');
        return true;
      }

      console.error('Invalid password.');
      return false;
    } catch (error) {
      console.error('Error during user login:', error);
      return false;
    }
  }, [router]);

  const setLoggedIn = useCallback((value: boolean) => {
    setIsLoggedInState(value);
    if (value) {
      localStorage.setItem('adminAuth', 'true');
      console.log('Set admin authentication to true and saved to localStorage');
    } else {
      localStorage.removeItem('adminAuth');
    }
  }, []);

  const sendOtp = async (phone: string) => {
    try {
      const response = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        console.error('Failed to send OTP:', await response.json());
        return false;
      }

      console.log('OTP sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      console.log('OTP verification response:', response);
      if (response.ok) {
        console.log('OTP verified successfully, setting logged in state');
        setLoggedIn(true);
        console.log('Admin successfully logged in after OTP verification');
        router.push('/admin/dashboard');
        return true;
      } else {
        console.error('Failed OTP verification:', await response.json());
        return false;
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      return false;
    }
  }, [setLoggedIn, router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, authLoaded: mounted, isUserLoggedIn, login, loginUser, logout, logoutUser, setLoggedIn, sendOtp, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

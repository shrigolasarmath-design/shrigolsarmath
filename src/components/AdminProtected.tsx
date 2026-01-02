"use client";

import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminProtected({ children }: { children: ReactNode }) {
  const { isLoggedIn, authLoaded } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && authLoaded && !isLoggedIn) {
      router.replace("/admin/login");
    }
  }, [isLoggedIn, isMounted, authLoaded, router]);

  if (!isMounted || !authLoaded) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

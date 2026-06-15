"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

export function StoreHydration() {
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  return null;
}

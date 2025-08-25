"use client";

import { useEffect, useState } from "react";

export function ClientGate({
  splash,
  children,
}: {
  splash: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // On attend la première frame côté client
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) return <>{splash}</>;
  return <>{children}</>;
}

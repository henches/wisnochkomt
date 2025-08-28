"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/"); // redirigez où vous voulez (ex: /admin)
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setErr(data?.error ?? "Échec de connexion");
    }
  }

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, minWidth: 280 }}>
        <h1>Connexion</h1>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
}
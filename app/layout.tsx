import type { Metadata } from "next";
import { BACKGROUND_COLOR } from "./constants";
import { ClientGate } from "./_components/ClientGate";
import { App } from "antd";

export const metadata: Metadata = {
  title: "Mon App",
  description: "Application Next.js PWA",
};

function Splash() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BACKGROUND_COLOR,
        color: 'white'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{ fontSize: "2.1rem" }}>WIE'S NOCH KOMM'T</div>
        <p style={{ opacity: 0.7 }}>Chargement…</p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        {/* Métadonnées PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
      </head>
      <body
        style={{
          height: "100vh",
          display: "flex",
          backgroundColor: BACKGROUND_COLOR,
        }}
      >
        <ClientGate splash={<Splash />}>
          <App />
          {children}
        </ClientGate>
      </body>
    </html>
  );
}

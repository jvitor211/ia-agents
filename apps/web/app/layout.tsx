import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "ia-agents MVP",
  description: "Cursor particular MVP"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Kyndex - Peer-to-Peer Skills Exchange',
  description: 'Exchange skills and knowledge with people around you',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sonora - Afinador de Guitarra',
  description:
    'Afinador de guitarra en tiempo real que detecta notas y frecuencias usando el micrófono',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

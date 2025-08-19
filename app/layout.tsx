import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sonora - Afinador de Guitarra en Tiempo Real',
  description:
    'Afinador de guitarra profesional en tiempo real que detecta notas y frecuencias usando el micrófono. Afina tu guitarra, bajo, ukelele y otros instrumentos de cuerda con precisión.',
  keywords: [
    'afinador guitarra',
    'afinador tiempo real',
    'afinador online',
    'afinador guitarra acustica',
    'afinador guitarra electrica',
    'afinador instrumentos cuerda',
    'detector notas',
    'detector frecuencias',
    'afinador microfono',
    'afinador web',
    'afinador gratis',
  ].join(', '),
  authors: [{ name: 'Sonora Team' }],
  creator: 'Sonora',
  publisher: 'Sonora',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sonora-rho.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sonora - Afinador de Guitarra en Tiempo Real',
    description:
      'Afinador de guitarra profesional en tiempo real que detecta notas y frecuencias usando el micrófono. Afina tu guitarra, bajo, ukelele y otros instrumentos de cuerda con precisión.',
    url: 'https://sonora-rho.vercel.app',
    siteName: 'Sonora',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sonora - Afinador de Guitarra en Tiempo Real',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sonora - Afinador de Guitarra en Tiempo Real',
    description:
      'Afinador de guitarra profesional en tiempo real que detecta notas y frecuencias usando el micrófono.',
    images: ['/og-image.png'],
    creator: '@sonora',
    site: '@sonora',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'music',
  classification: 'music tools',
  other: {
    'application-name': 'Sonora',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Sonora',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#000000',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#000000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

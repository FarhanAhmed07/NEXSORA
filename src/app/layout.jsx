import './globals.css';
export const metadata = {
  metadataBase: new URL('https://nexora-solutions-nexora-solutions6.vercel.app'),
  title: { default: 'Nexora Solutions | Web, Mobile, AI & Custom Software', template: '%s | Nexora Solutions' },
  description: 'Nexora Solutions designs and builds high-performance websites, mobile apps, AI assistants and custom business software.',
  keywords: ['software development agency','web development','mobile app development','Flutter apps','AI automation','custom software','UI UX design'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Nexora Solutions', title: 'Nexora Solutions | Digital Products & Software', description: 'Websites, mobile apps, AI experiences and custom software built around your business.' },
  twitter: { card: 'summary', title: 'Nexora Solutions', description: 'Web, mobile, AI and custom software development.' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
};
export const viewport = { themeColor: '#080b14', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
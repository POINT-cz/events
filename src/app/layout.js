import { Inter, JetBrainsMono } from 'next/font/google'; // Nebo libovolný Google font jako náhrada
import './globals.css';

// 1. Definice fontů
const fontSans = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

const fontMono = JetBrainsMono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="cs" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="bg-[#f4f4f4] text-black font-sans antialiased selection:bg-[#E4664F] selection:text-white">
        {children}
      </body>
    </html>
  );
}
import './globals.css';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const googleSansLike = Plus_Jakarta_Sans({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'POINT | Akce a Workshopy',
  description: 'Přehled aktuálních akcí, přednášek a workshopů v prostorech POINT Olomouc.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs" className={`${googleSansLike.variable} ${mono.variable}`}>
      <body className="font-sans bg-[#f4f4f4] text-black antialiased selection:bg-black selection:text-white overflow-x-hidden w-full min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
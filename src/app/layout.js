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

export default function RootLayout({ children }) {
  return (
    <html lang="cs" className={`${googleSansLike.variable} ${mono.variable}`}>
      <body className="bg-[#f4f4f4] text-black antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
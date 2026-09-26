import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body className="bg-[#f4f4f4] text-black font-sans antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
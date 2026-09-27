import './globals.css';

export const metadata = {
  title: 'POINT Events — Workshopy, přednášky a komunitní akce',
  description: 'Přehled vypsaných událostí, workshopů a rezervace vstupenek v prostoru POINT Olomouc.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body className="bg-[#f4f4f4] text-black antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
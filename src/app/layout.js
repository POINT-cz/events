import './globals.css';

export const metadata = {
  title: 'POINT | Akce a Workshopy',
  description: 'Přehled aktuálních akcí, přednášek a workshopů v prostorech POINT Olomouc.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
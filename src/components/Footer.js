'use client';

export default function Footer({ setShowGdprModal, setShowVopModal }) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 text-center text-[10px] sm:text-xs relative z-10 pointer-events-auto w-full mt-auto">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p className="text-white font-bold text-sm mb-4">BREAKING POINT s.r.o.</p>
        <p>IČ: 14290553 | DIČ: CZ14290553</p>
        <p>Mrštíkovo nám. 6/14, 779 00 Olomouc</p>
        <p className="pt-2 text-slate-500">Zapsáno v obchodním rejstříku u Krajského soudu v Ostravě, oddíl C, vložka 88557.</p>
        <p className="pt-2">Kontakt: <a href="mailto:hello@pointspace.cz" className="text-slate-300 hover:text-white transition-colors cursor-none">hello@pointspace.cz</a></p>
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
           <button onClick={() => setShowGdprModal(true)} className="hover:text-white transition-colors cursor-none">Ochrana osobních údajů (GDPR)</button>
           <button onClick={() => setShowVopModal(true)} className="hover:text-white transition-colors cursor-none">Obchodní a Storno podmínky</button>
        </div>
      </div>
    </footer>
  );
}
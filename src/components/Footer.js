'use client';

export default function Footer({ setShowGdprModal, setShowVopModal }) {
  return (
    <footer className="bg-black text-neutral-400 py-12 text-center text-xs relative z-10 pointer-events-auto w-full mt-auto border-t-2 border-black font-mono uppercase">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p className="text-white font-bold text-sm mb-4 tracking-wider">BREAKING POINT s.r.o.</p>
        <p>IČ: 14290553 | DIČ: CZ14290553</p>
        <p>Mrštíkovo nám. 6/14, 779 00 Olomouc</p>
        <p className="pt-2 text-neutral-500 text-[10px]">Zapsáno v obchodním rejstříku u Krajského soudu v Ostravě, oddíl C, vložka 88557.</p>
        <p className="pt-2">Kontakt: <a href="mailto:hello@pointspace.cz" className="text-white hover:text-[#E4664F] transition-none cursor-pointer underline">hello@pointspace.cz</a></p>
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-[11px] font-bold">
           <button onClick={() => setShowGdprModal(true)} className="hover:text-white transition-none cursor-pointer underline">Ochrana osobních údajů (GDPR)</button>
           <button onClick={() => setShowVopModal(true)} className="hover:text-white transition-none cursor-pointer underline">Obchodní a Storno podmínky</button>
        </div>
      </div>
    </footer>
  );
}
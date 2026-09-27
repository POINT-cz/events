'use client';

export default function Footer({ setShowGdprModal, setShowVopModal }) {
  return (
    <footer className="bg-black text-neutral-500 py-8 sm:py-10 text-center text-[11px] relative z-10 pointer-events-auto w-full mt-auto border-t border-neutral-800 font-mono uppercase">
      <div className="max-w-4xl mx-auto px-4 space-y-3">
        
        {/* Nenápadný řádek s firemními údaji */}
        <div className="text-[10px] text-neutral-600 tracking-wider flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
          <span className="text-neutral-400 font-bold">BREAKING POINT s.r.o.</span>
          <span>•</span>
          <span>IČ: 14290553</span>
          <span>•</span>
          <span>DIČ: CZ14290553</span>
          <span>•</span>
          <span>Mrštíkovo nám. 6/14, 779 00 Olomouc</span>
        </div>

        {/* Zápis v rejstříku (velmi jemný) */}
        <p className="text-[9px] text-neutral-600 tracking-wide">
          Zapsáno v OR u Krajského soudu v Ostravě, oddíl C, vložka 88557.
        </p>

        {/* Kontakt */}
        <p className="pt-1 text-neutral-400">
          Kontakt: <a href="mailto:hello@pointspace.cz" className="text-white hover:text-[#E4664F] transition-colors cursor-pointer underline">hello@pointspace.cz</a>
        </p>
        
        {/* GDPR / VOP odkazy */}
        <div className="mt-4 pt-4 border-t border-neutral-900 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 text-[10px] font-bold text-neutral-400">
           <button 
             type="button"
             onClick={() => setShowGdprModal(true)} 
             className="hover:text-white transition-colors cursor-pointer underline text-center py-1 touch-manipulation"
           >
             Ochrana osobních údajů (GDPR)
           </button>
           <button 
             type="button"
             onClick={() => setShowVopModal(true)} 
             className="hover:text-white transition-colors cursor-pointer underline text-center py-1 touch-manipulation"
           >
             Obchodní a Storno podmínky
           </button>
        </div>
      </div>
    </footer>
  );
}
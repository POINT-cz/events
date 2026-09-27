'use client';

export default function Footer({ setShowGdprModal, setShowVopModal }) {
  return (
    <footer className="bg-black text-neutral-400 py-10 sm:py-12 text-center text-xs relative z-10 pointer-events-auto w-full mt-auto border-t border-neutral-800 font-mono uppercase">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p className="text-white font-bold text-sm mb-3 sm:mb-4 tracking-wider">BREAKING POINT s.r.o.</p>
        <p className="leading-relaxed">IČ: 14290553 | DIČ: CZ14290553</p>
        <p className="leading-relaxed">Mrštíkovo nám. 6/14, 779 00 Olomouc</p>
        <p className="pt-2 text-neutral-500 text-[10px] leading-relaxed max-w-lg mx-auto">Zapsáno v obchodním rejstříku u Krajského soudu v Ostravě, oddíl C, vložka 88557.</p>
        
        {/* Kontaktní údaje: telefon + e-mail malým */}
        <div className="pt-2 space-y-1 text-neutral-300">
          <p>Telefon: <a href="tel:+420777123456" className="text-white hover:text-[#E4664F] transition-colors cursor-pointer underline">+420 777 123 456</a></p>
          <p className="lowercase text-[11px]">E-mail: <a href="mailto:hello@pointspace.cz" className="text-white hover:text-[#E4664F] transition-colors cursor-pointer underline">hello@pointspace.cz</a></p>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 text-[11px] font-bold">
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
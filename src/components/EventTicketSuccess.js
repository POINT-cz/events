'use client';

export default function EventTicketSuccess({ lastCreatedRes, setBookingStep, setSelectedEvent, setLastCreatedRes }) {
  return (
    <div className="max-w-md mx-auto w-full bg-white border border-neutral-300 p-6 sm:p-10 text-center space-y-6 font-mono animate-in fade-in">
      <div className="w-14 h-14 bg-black text-white font-bold flex items-center justify-center mx-auto text-xl mb-2">✓</div>
      <div>
        <h3 className="text-base font-bold uppercase tracking-widest text-black mb-1">Objednávka přijata</h3>
        <p className="text-xs font-bold text-neutral-500 uppercase">VS: {lastCreatedRes.variable_symbol}</p>
      </div>
      
      <div className="p-6 bg-[#f4f4f4] border border-neutral-300 w-full space-y-3 text-left">
        <p className="text-xs font-bold uppercase text-black leading-relaxed">
          Děkujeme za vaši objednávku. Detaily a platební údaje vám zašleme e-mailem v nejbližší době.
        </p>
      </div>

      <button 
        onClick={() => { setBookingStep(1); setSelectedEvent(null); setLastCreatedRes(null); window.history.replaceState({}, document.title, "/"); }} 
        className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-neutral-800 cursor-pointer transition-colors"
      >
        Hotovo, vrátit se na začátek
      </button>
    </div>
  );
}
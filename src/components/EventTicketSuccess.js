'use client';

export default function EventTicketSuccess({ lastCreatedRes, qrCodeUrl, setBookingStep, setSelectedEvent, setLastCreatedRes }) {
  return (
    <div className="max-w-md mx-auto w-full bg-white border-2 border-black p-6 sm:p-8 text-center space-y-6 font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="w-14 h-14 bg-black text-white font-bold rounded-full flex items-center justify-center mx-auto text-xl mb-2">✓</div>
      <div>
        <h3 className="text-base font-bold uppercase tracking-widest text-black mb-1">Vstupenka rezervována</h3>
        <p className="text-xs font-bold text-neutral-500 uppercase">VS: {lastCreatedRes.variable_symbol}</p>
      </div>
      <div className="p-6 bg-[#f4f4f4] border-2 border-black w-full space-y-3">
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Platba" className="mx-auto w-40 h-40 border-2 border-black" />
        ) : (
          <div className="w-40 h-40 bg-neutral-300 animate-pulse mx-auto border-2 border-black" />
        )}
        <div className="mt-4">
          <p className="text-2xl font-extrabold text-black">{lastCreatedRes.total_price} Kč</p>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1 block">Naskenujte v bankovní aplikaci</span>
        </div>
      </div>
      <button 
        onClick={() => { setBookingStep(1); setSelectedEvent(null); setLastCreatedRes(null); window.history.replaceState({}, document.title, "/"); }} 
        className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-neutral-800 cursor-pointer"
      >
        Hotovo, vrátit se na začátek
      </button>
    </div>
  );
}
'use client';

export default function EventBookingForm({
  user,
  selectedEvent,
  selectedVariant,
  formData,
  setFormData,
  honeypot,
  setHoneypot,
  aresLoading,
  loadFromAres,
  gdprConsent,
  setGdprConsent,
  setShowGdprModal,
  setShowVopModal,
  setIsLoginMode,
  setShowAuthModal,
  setBookingStep,
  handleClientSubmit,
  isSubmitting,
  formatDateCzech
}) {
  return (
    <form onSubmit={handleClientSubmit} className="max-w-2xl mx-auto w-full bg-white border-2 border-black p-6 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      
      {/* Honeypot proti botům */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input type="text" id="bot-check" name="bot-check" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex="-1" autoComplete="off" />
      </div>

      {!user && (
        <div className="bg-[#f4f4f4] border-2 border-black p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">Pro rychlejší rezervaci se přihlaste.</span>
          <button type="button" onClick={() => { setIsLoginMode(true); setShowAuthModal(true); }} className="text-xs font-mono font-bold uppercase tracking-widest bg-black text-white px-4 py-2 hover:bg-neutral-800 cursor-pointer">Přihlásit se</button>
        </div>
      )}

      {selectedEvent && selectedVariant && (
        <div className="bg-black text-white border-2 border-black p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-1">Vstupenka na akci</div>
            <div className="font-bold text-sm uppercase">{selectedEvent.title} <span className="text-[#E4664F]">({selectedVariant.title})</span></div>
            <div className="text-xs mt-1 text-neutral-300">{formatDateCzech(selectedEvent.date)} • {selectedEvent.time}</div>
          </div>
          <div className="text-xl font-bold text-[#E4664F]">{selectedVariant.price} Kč</div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-4">Kontaktní údaje</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono">
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Jméno *</label><input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold uppercase outline-none" /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Příjmení *</label><input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold uppercase outline-none" /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">E-mail *</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold outline-none" /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Telefon *</label><input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold outline-none" /></div>
        </div>
      </div>
      
      <div className="font-mono">
        <h4 className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-2 mb-4 flex items-center justify-between">Fakturační údaje <span className="text-[10px] text-neutral-400">Volitelné</span></h4>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
            <div className="flex-1 w-full"><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">IČO pro načtení z ARES</label><input type="text" placeholder="IČO..." value={formData.ico} onChange={e => setFormData({...formData, ico: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold outline-none" /></div>
            <button type="button" onClick={loadFromAres} disabled={aresLoading} className="w-full sm:w-auto bg-black text-white text-xs font-bold uppercase tracking-widest px-5 py-3.5 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer">{aresLoading ? 'Načítám...' : 'Načíst ARES'}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Název firmy</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold uppercase outline-none" /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">DIČ</label><input type="text" value={formData.dic} onChange={e => setFormData({...formData, dic: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold uppercase outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            <div className="sm:col-span-3"><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Ulice a č.p.</label><input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold uppercase outline-none" /></div>
            <div className="sm:col-span-2"><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Město</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold uppercase outline-none" /></div>
            <div className="sm:col-span-1"><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">PSČ</label><input type="text" value={formData.psc} onChange={e => setFormData({...formData, psc: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-bold uppercase outline-none" /></div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t-2 border-black font-mono">
         <div className="flex items-start gap-2 mb-6">
            <input type="checkbox" id="gdprConsent" required checked={gdprConsent} onChange={e => setGdprConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-black cursor-pointer" />
            <label htmlFor="gdprConsent" className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-700 leading-snug cursor-pointer">
               Souhlasím se <span onClick={(e) => { e.preventDefault(); setShowGdprModal(true); }} className="underline font-bold cursor-pointer">zpracováním údajů</span> a s <span onClick={(e) => { e.preventDefault(); setShowVopModal(true); }} className="underline font-bold cursor-pointer">VOP</span>. *
            </label>
         </div>
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button type="button" onClick={() => setBookingStep(1)} className="text-xs font-bold uppercase tracking-widest underline cursor-pointer hover:text-[#E4664F]">‹ Zpět na výběr</button>
            <button type="submit" disabled={isSubmitting || !gdprConsent} className="w-full sm:w-auto bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer">
              Závazně koupit vstupenku
            </button>
         </div>
      </div>
    </form>
  );
}
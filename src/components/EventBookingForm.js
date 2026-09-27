'use client';

export default function EventBookingForm({
  user,
  selectedEvent,
  selectedVariant,
  formData,
  setFormData,
  customAnswers,
  setCustomAnswers,
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
    <div className="max-w-3xl mx-auto w-full animate-in fade-in space-y-6 pt-2 sm:pt-4 pb-12 px-3 sm:px-0 font-mono">
      
      {/* Hlavička s přechodem zpět */}
      <div className="bg-white border border-neutral-300 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-300">
        <div>
          <button 
            type="button" 
            onClick={() => setBookingStep(1)} 
            className="text-xs font-bold uppercase text-neutral-500 hover:text-black cursor-pointer mb-1 inline-block touch-manipulation"
          >
            ← Zpět na detail akce
          </button>
          <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-black">Dokončení rezervace</h2>
        </div>
        <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
          <div className="text-[11px] sm:text-xs font-bold text-neutral-500 uppercase">{selectedVariant?.title}</div>
          <div className="text-base sm:text-lg font-extrabold text-black">{selectedVariant?.price} Kč</div>
        </div>
      </div>

      <form onSubmit={handleClientSubmit} className="space-y-6">
        
        {/* HONEYPOT PROTI SPAMU */}
        <div className="hidden" aria-hidden="true">
          <input 
            type="text" 
            name="website_hp" 
            value={honeypot} 
            onChange={e => setHoneypot(e.target.value)} 
            tabIndex={-1} 
            autoComplete="off" 
          />
        </div>

        {/* OSOBNÍ ÚDAJE */}
        <div className="bg-white border border-neutral-300 p-4 sm:p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 pb-2">1. Kontaktní údaje</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Jméno *</label>
              <input 
                type="text" 
                required 
                value={formData.firstName} 
                onChange={e => setFormData({...formData, firstName: e.target.value})} 
                className="w-full bg-[#f4f4f4] border border-neutral-300 p-3 text-xs font-bold uppercase outline-none focus:border-black" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Příjmení *</label>
              <input 
                type="text" 
                required 
                value={formData.lastName} 
                onChange={e => setFormData({...formData, lastName: e.target.value})} 
                className="w-full bg-[#f4f4f4] border border-neutral-300 p-3 text-xs font-bold uppercase outline-none focus:border-black" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">E-mail *</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                className="w-full bg-[#f4f4f4] border border-neutral-300 p-3 text-xs font-bold outline-none focus:border-black" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Telefon *</label>
              <input 
                type="tel" 
                required 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                className="w-full bg-[#f4f4f4] border border-neutral-300 p-3 text-xs font-bold outline-none focus:border-black" 
              />
            </div>
          </div>
        </div>

        {/* DYNAMICKÝ DOTAZNÍK S TEXTAREAMI PRO POHODLNÉ PSANÍ */}
        {selectedEvent.custom_questions && selectedEvent.custom_questions.length > 0 && (
          <div className="bg-white border border-neutral-300 p-4 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 pb-2">2. Doplňující otázky k akci</h3>
            <div className="space-y-4">
              {selectedEvent.custom_questions.map((q) => (
                <div key={q.id}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    {q.question} {q.required && <span className="text-red-600">*</span>}
                  </label>
                  <textarea 
                    rows={3}
                    required={q.required}
                    value={customAnswers[q.id] || ''}
                    onChange={e => setCustomAnswers({...customAnswers, [q.id]: e.target.value})}
                    placeholder="Vaše odpověď (text se automaticky zalamuje dolů)..."
                    className="w-full bg-[#f4f4f4] border border-neutral-300 p-3 text-xs font-medium outline-none focus:border-black resize-y"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAKTURAČNÍ ÚDAJE / FIRMA */}
        <div className="bg-white border border-neutral-300 p-4 sm:p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">3. Firemní / Fakturační údaje (nepovinné)</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">IČO pro načtení z ARES</label>
              <input 
                type="text" 
                value={formData.ico} 
                onChange={e => setFormData({...formData, ico: e.target.value})} 
                className="w-full bg-[#f4f4f4] border border-neutral-300 p-3 text-xs font-bold outline-none focus:border-black" 
              />
            </div>
            <button 
              type="button" 
              onClick={loadFromAres} 
              disabled={aresLoading} 
              className="bg-black text-white hover:bg-neutral-800 px-4 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-40 w-full sm:w-auto text-center"
            >
              {aresLoading ? 'Načítám...' : 'Načíst ARES'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Název firmy</label>
              <input 
                type="text" 
                value={formData.company} 
                onChange={e => setFormData({...formData, company: e.target.value})} 
                className="w-full bg-[#f4f4f4] border border-neutral-300 p-3 text-xs font-bold uppercase outline-none focus:border-black" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">DIČ</label>
              <input 
                type="text" 
                value={formData.dic} 
                onChange={e => setFormData({...formData, dic: e.target.value})} 
                className="w-full bg-[#f4f4f4] border border-neutral-300 p-3 text-xs font-bold uppercase outline-none focus:border-black" 
              />
            </div>
          </div>
        </div>

        {/* SOUHLAS A ODESLÁNÍ */}
        <div className="bg-white border border-neutral-300 p-4 sm:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="gdpr" 
              required 
              checked={gdprConsent} 
              onChange={e => setGdprConsent(e.target.checked)} 
              className="mt-0.5 w-4 h-4 accent-black cursor-pointer shrink-0" 
            />
            <label htmlFor="gdpr" className="text-xs text-neutral-700 leading-relaxed cursor-pointer">
              Souhlasím se zpracováním osobních údajů a s{' '}
              <button type="button" onClick={() => setShowVopModal(true)} className="underline font-bold text-black hover:text-[#E4664F]">obchodními podmínkami</button>.*
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-black text-white hover:bg-[#E4664F] py-4 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-40 active:scale-[0.99] touch-manipulation"
          >
            {isSubmitting ? 'Zpracovávám rezervaci...' : `Závazně objednat za ${selectedVariant?.price} Kč`}
          </button>
        </div>

      </form>
    </div>
  );
}
'use client';

export default function EventDetail({ 
  selectedEvent, 
  selectedVariant, 
  setSelectedVariant, 
  setIsDescExpanded, 
  isDescExpanded, 
  setBookingStep, 
  setSelectedEvent, 
  favoriteEvents, 
  toggleFavorite, 
  formatDateCzech 
}) {
  if (!selectedEvent) return null;

  return (
    <div className="w-full bg-white border-2 border-black animate-in fade-in">
      {/* Hlavička s obrázkem */}
      <div className="h-64 sm:h-[420px] w-full bg-black relative border-b-2 border-black">
        <img 
          src={selectedEvent.image_url || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'} 
          className="w-full h-full object-cover opacity-60" 
          alt={selectedEvent.title} 
        />
        <button 
          onClick={() => setSelectedEvent(null)} 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white border-2 border-black text-black px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-none z-20 cursor-pointer"
        >
          ‹ Zpět na přehled
        </button>
        <div className="absolute bottom-0 left-0 p-6 sm:p-12 w-full bg-gradient-to-t from-black via-black/80 to-transparent">
          <span className="bg-[#E4664F] text-white text-[10px] font-mono font-bold px-3 py-1 uppercase tracking-wider mb-2 inline-block border border-black">
            {selectedEvent.category || 'Workshop'}
          </span>
          <h1 className="text-2xl sm:text-5xl font-mono font-extrabold text-white mb-2 uppercase tracking-tight">{selectedEvent.title}</h1>
          <div className="text-[#E4664F] font-mono font-bold uppercase tracking-widest text-xs sm:text-sm">{formatDateCzech(selectedEvent.date)}</div>
        </div>
      </div>
      
      {/* Hlavní obsah detailu */}
      <div className="p-6 sm:p-12 flex flex-col md:flex-row gap-8 sm:gap-12 max-w-6xl mx-auto">
        <div className="flex-1 min-w-0">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black">O co jde</h3>
              <button 
                onClick={(e) => toggleFavorite(e, selectedEvent.id)} 
                className={`transition-none cursor-pointer flex items-center justify-center ${favoriteEvents.includes(selectedEvent.id) ? 'text-[#E4664F]' : 'text-neutral-400 hover:text-black'}`}
              >
                <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${favoriteEvents.includes(selectedEvent.id) ? 'animate-pop fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div className="relative font-mono">
              <p className={`text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap break-words ${!isDescExpanded ? 'line-clamp-6' : ''}`}>
                {selectedEvent.description}
              </p>
              <button 
                onClick={() => setIsDescExpanded(!isDescExpanded)} 
                className="text-black text-xs font-mono font-bold uppercase underline mt-3 cursor-pointer"
              >
                {isDescExpanded ? 'Sbalit text' : 'Číst dále ›'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Výběr cenových balíčků / vstupenek */}
        <div className="w-full md:w-96 shrink-0 self-start">
          <div className="bg-white p-6 sm:p-8 border-2 border-black space-y-6 md:sticky md:top-24 font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b-2 border-black pb-2">Vyberte variantu vstupenky</div>
            
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-700">
              <li className="flex items-center gap-3"><span className="text-base">📅</span> <span className="font-bold text-black">{formatDateCzech(selectedEvent.date)}</span></li>
              <li className="flex items-center gap-3"><span className="text-base">⏰</span> <span className="font-bold text-black">{selectedEvent.time}</span></li>
            </ul>

            <div className="space-y-3 pt-2 border-t-2 border-black">
              {selectedEvent.variants?.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                return (
                  <div 
                    key={variant.id} 
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 border-2 transition-none cursor-pointer ${isSelected ? 'border-black bg-[#E4664F] text-white' : 'border-black bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs uppercase tracking-wider">{variant.title}</span>
                      <span className="font-bold text-xs uppercase">{variant.price} Kč</span>
                    </div>
                    <p className={`text-[10px] uppercase ${isSelected ? 'text-white/90' : 'text-neutral-600'}`}>{variant.description}</p>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setBookingStep(2)} 
              disabled={!selectedVariant} 
              className="w-full py-4 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
            >
              {selectedVariant ? `Koupit (${selectedVariant.price} Kč)` : 'Vyberte balíček'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mapa */}
      <div className="w-full border-t-2 border-black mt-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-8 pb-4 font-mono">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-black mb-1">Kde to bude?</h3>
          <p className="text-xs sm:text-sm text-neutral-700 font-bold uppercase">POINT - Mrštíkovo nám. 6/14, Olomouc</p>
        </div>
        <div className="w-full h-64 sm:h-[400px] bg-neutral-200 border-t-2 border-black">
          <iframe 
            src="https://maps.google.com/maps?q=Mr%C5%A1t%C3%ADkovo%20n%C3%A1m.%206/14,%20Olomouc&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{border:0, filter: 'grayscale(100%) contrast(1.1)'}} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
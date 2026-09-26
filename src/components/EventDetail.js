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
    <div className="w-full bg-[#f4f4f4] text-black font-mono animate-in fade-in pb-12">
      
      {/* 1. TOP NAV / ZPĚT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <button 
          onClick={() => setSelectedEvent(null)} 
          className="bg-white border-2 border-black text-black px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
        >
          <span>‹</span> Zpět na přehled akcí
        </button>
      </div>

      {/* 2. HLAVNÍ HEADER AKCE (Brutalistní box s obrázkem a informacemi) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 mb-8">
          
          {/* Obrázek akce */}
          <div className="lg:col-span-7 h-72 sm:h-[450px] bg-black relative border-b-2 lg:border-b-0 lg:border-r-2 border-black">
            <img 
              src={selectedEvent.image_url || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'} 
              className="w-full h-full object-cover" 
              alt={selectedEvent.title} 
            />
            <div className="absolute top-4 right-4">
              <span className="text-white text-xs font-mono font-bold px-3 py-1.5 uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#E4664F' }}>
                {selectedEvent.category || 'Workshop'}
              </span>
            </div>
          </div>

          {/* Základní meta info v hlavičce */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#f4f4f4]">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b-2 border-black pb-2">
                Detail události
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tighter text-black leading-tight">
                {selectedEvent.title}
              </h1>
              <div className="text-sm font-bold uppercase tracking-widest" style={{ color: '#E4664F' }}>
                {formatDateCzech(selectedEvent.date)}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t-2 border-black space-y-3">
              <div className="flex items-center gap-3 text-xs uppercase font-bold bg-white border-2 border-black p-3">
                <span className="text-base">📅</span> <span>{formatDateCzech(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase font-bold bg-white border-2 border-black p-3">
                <span className="text-base">⏰</span> <span>{selectedEvent.time}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* 3. HLAVNÍ OBSAH (Popis + Výběr vstupenky) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Levá strana: O co jde */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black">O co jde</h3>
            <button 
              onClick={(e) => toggleFavorite(e, selectedEvent.id)} 
              className={`p-2 border-2 border-black transition-all cursor-pointer flex items-center justify-center bg-[#f4f4f4] hover:bg-black hover:text-white ${favoriteEvents.includes(selectedEvent.id) ? 'bg-black text-white' : 'text-neutral-500'}`}
              style={favoriteEvents.includes(selectedEvent.id) ? { backgroundColor: '#E4664F', borderColor: '#black', color: '#fff' } : {}}
            >
              <svg className={`w-5 h-5 ${favoriteEvents.includes(selectedEvent.id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <p className={`text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap break-words ${!isDescExpanded ? 'line-clamp-6' : ''}`}>
              {selectedEvent.description}
            </p>
            <button 
              onClick={() => setIsDescExpanded(!isDescExpanded)} 
              className="text-black text-xs font-bold uppercase underline tracking-widest cursor-pointer inline-block pt-2"
            >
              {isDescExpanded ? '‹ Sbalit text' : 'Číst dále ›'}
            </button>
          </div>
        </div>
        
        {/* Pravá strana: Výběr cenových balíčků / vstupenek */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 border-2 border-black space-y-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-3">
              Vyberte variantu vstupenky
            </div>

            <div className="space-y-3">
              {selectedEvent.variants?.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                return (
                  <div 
                    key={variant.id} 
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 border-2 transition-all cursor-pointer ${isSelected ? 'border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-black bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}
                    style={isSelected ? { backgroundColor: '#E4664F' } : {}}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs uppercase tracking-wider">{variant.title}</span>
                      <span className="font-bold text-sm uppercase">{variant.price} Kč</span>
                    </div>
                    <p className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-neutral-600'}`}>{variant.description}</p>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setBookingStep(2)} 
              disabled={!selectedVariant} 
              className="w-full py-4 bg-black text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-40 cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              {selectedVariant ? `Pokračovat k nákupu (${selectedVariant.price} Kč)` : 'Vyberte balíček výše'}
            </button>
          </div>
        </div>

      </div>
      
      {/* 4. MAPA (Brutalistní sekce) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-12">
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="p-6 border-b-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-1">Kde to bude?</h3>
              <p className="text-xs sm:text-sm text-neutral-700 font-bold uppercase">POINT - Mrštíkovo nám. 6/14, Olomouc</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-3 py-1 bg-black text-white border border-black">Hlavní sídlo</span>
          </div>
          <div className="w-full h-64 sm:h-[350px] bg-neutral-200">
            <iframe 
              src="https://maps.google.com/maps?q=Mr%C5%A1t%C3%ADkovo%20n%C3%A1m.%206/14,%20Olomouc&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{border:0, filter: 'grayscale(100%) contrast(1.2)'}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

    </div>
  );
}
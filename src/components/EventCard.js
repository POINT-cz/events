'use client';

export default function EventCard({ event, isFav, toggleFavorite, onSelect, formatDateCzech, lowestPrice }) {
  return (
    <div 
      onClick={onSelect} 
      className="bg-white border border-neutral-300 overflow-hidden flex flex-col group relative h-[320px] sm:h-[340px] cursor-pointer hover:border-black transition-all active:scale-[0.99] touch-manipulation"
    >
      {/* Tlačítko oblíbených */}
      <button 
        type="button"
        onClick={(e) => toggleFavorite(e, event.id)} 
        className={`absolute top-3 left-3 z-40 p-2 sm:p-2.5 border transition-all flex items-center justify-center cursor-pointer shadow-sm ${isFav ? 'bg-[#E4664F] border-[#E4664F] text-white' : 'bg-white/90 backdrop-blur-xs border-neutral-300 text-black hover:border-black'}`}
        style={isFav ? { backgroundColor: '#E4664F', borderColor: '#E4664F', color: '#fff' } : {}}
      >
        <svg className={`w-4 h-4 ${isFav ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Kategorie */}
      <div className="absolute top-3 right-3 z-40 bg-white/90 backdrop-blur-xs text-black text-[10px] font-mono font-bold px-2.5 py-1 border border-neutral-300 uppercase tracking-wider shadow-sm">
        {event.category || 'Workshop'}
      </div>

      {/* Obrázek nahoře v kartě */}
      <div className="h-42 sm:h-48 w-full bg-neutral-100 relative border-b border-neutral-300 overflow-hidden">
        <img 
          src={event.image_url || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={event.title} 
        />
      </div>
      
      {/* Obsah karty dole s hover efektem */}
      <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 relative z-20 font-mono bg-white">
        <h3 className="text-xs sm:text-base font-bold text-black uppercase tracking-tight line-clamp-1 mb-1 sm:mb-2">{event.title}</h3>
        
        {/* Výchozí info (na mobilu viditelné pořád, na desktopu mizí při hoveru) */}
        <div className="flex flex-col items-start gap-1 text-neutral-600 text-[11px] sm:text-xs uppercase transition-opacity duration-350 sm:group-hover:opacity-0">
          <span>📅 {formatDateCzech(event.date)}</span>
          <span>⏰ {event.time}</span>
          <span className="font-bold text-black mt-0.5 sm:mt-1">od {lowestPrice} Kč</span>
        </div>

        {/* Text objevující se na hover (na dotykových zařízeních lze případně kliknout rovnou na kartu, na desktopu funguje animovaný hover) */}
        <div className="absolute inset-x-3.5 sm:inset-x-4 bottom-3.5 sm:bottom-4 bg-white opacity-100 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 z-30 pt-1">
          <p className="hidden sm:block text-[11px] text-neutral-700 line-clamp-2 mb-3 leading-relaxed">{event.description || 'Přijďte se podívat na naši exkluzivní akci.'}</p>
          <span className="inline-block border border-black text-white bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-[#E4664F] hover:border-[#E4664F] transition-colors w-full text-center sm:w-auto">Detail akce ›</span>
        </div>
      </div>
    </div>
  );
}
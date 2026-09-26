'use client';

export default function EventCard({ event, isFav, toggleFavorite, onSelect, formatDateCzech, lowestPrice }) {
  return (
    <div 
      onClick={onSelect} 
      className="bg-black border-2 border-black overflow-hidden flex flex-col group relative h-[300px] sm:h-[320px] cursor-pointer hover:border-[#E4664F] transition-colors"
    >
      {/* Tlačítko oblíbených */}
      <button 
        onClick={(e) => toggleFavorite(e, event.id)} 
        className={`absolute top-3 left-3 z-40 p-2 border-2 transition-none flex items-center justify-center ${isFav ? 'bg-[#E4664F] border-black text-white' : 'bg-white border-black text-black hover:bg-neutral-200'}`}
      >
        <svg className={`w-4 h-4 ${isFav ? 'animate-pop' : ''}`} fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Kategorie */}
      <div className="absolute top-3 right-3 z-40 bg-black text-white text-[10px] font-mono font-bold px-2 py-1 border border-white/40 uppercase tracking-wider">
        {event.category || 'Workshop'}
      </div>

      {/* Obrázek */}
      <div className="absolute inset-0 z-0">
        <img 
          src={event.image_url || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'} 
          className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" 
          alt={event.title} 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
      
      {/* Obsah karty s hover efektem */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 z-20 font-mono">
        <h3 className="text-lg font-bold text-white mb-2 uppercase drop-shadow-md leading-tight">{event.title}</h3>
        
        {/* Výchozí info (mizí při hoveru) */}
        <div className="flex flex-col items-start gap-1 text-white/90 text-xs uppercase drop-shadow-md transition-opacity duration-300 group-hover:opacity-0">
          <span>📅 {formatDateCzech(event.date)}</span>
          <span>⏰ {event.time}</span>
          <span className="font-bold text-[#E4664F] mt-1">od {lowestPrice} Kč</span>
        </div>

        {/* Text objevující se na hover */}
        <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">
          <p className="text-xs text-neutral-300 line-clamp-2 mb-3 leading-relaxed">{event.description || 'Přijďte se podívat na naši exkluzivní akci.'}</p>
          <span className="inline-block border border-[#E4664F] text-[#E4664F] bg-black/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">Detail akce ›</span>
        </div>
      </div>
    </div>
  );
}
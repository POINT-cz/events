'use client';

export default function EventCard({ event, isFav, toggleFavorite, onSelect, formatDateCzech, lowestPrice }) {
  return (
    <div 
      onClick={onSelect} 
      className="bg-white border border-neutral-200 rounded-2xl overflow-hidden flex flex-col group relative h-[320px] sm:h-[340px] cursor-pointer hover:border-black/40 hover:shadow-xl transition-all duration-300"
    >
      {/* Tlačítko oblíbených */}
      <button 
        onClick={(e) => toggleFavorite(e, event.id)} 
        className={`absolute top-4 left-4 z-40 p-2.5 rounded-xl border transition-all flex items-center justify-center shadow-sm ${
          isFav 
            ? 'bg-[#E4664F] border-[#E4664F] text-white' 
            : 'bg-white/90 backdrop-blur-md border-neutral-200 text-neutral-700 hover:bg-neutral-100'
        }`}
      >
        <svg className={`w-4 h-4 ${isFav ? 'animate-pop' : ''}`} fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Kategorie */}
      <div className="absolute top-4 right-4 z-40 bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-medium px-3 py-1 rounded-full border border-neutral-200 shadow-sm uppercase tracking-wider">
        {event.category || 'Workshop'}
      </div>

      {/* Obrázek */}
      <div className="relative h-[180px] w-full overflow-hidden bg-neutral-100">
        <img 
          src={event.image_url || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={event.title} 
        />
      </div>
      
      {/* Obsah karty */}
      <div className="flex flex-col justify-between flex-1 p-5 relative bg-white">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 mb-2 line-clamp-1 group-hover:text-[#E4664F] transition-colors">
            {event.title}
          </h3>
          
          {/* Výchozí info (mizí při hoveru) */}
          <div className="flex flex-col gap-1 text-neutral-500 text-xs transition-opacity duration-300 group-hover:opacity-0">
            <span>📅 {formatDateCzech(event.date)} • {event.time}</span>
            <span className="font-semibold text-neutral-900 mt-1">od {lowestPrice} Kč</span>
          </div>
        </div>

        {/* Text objevující se na hover */}
        <div className="absolute inset-x-5 bottom-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-white pt-1">
          <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed">
            {event.description || 'Přijďte se podívat na naši exkluzivní akci.'}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-900 text-xs">od {lowestPrice} Kč</span>
            <span className="inline-flex items-center text-xs font-semibold text-[#E4664F]">
              Detail akce <span className="ml-1">›</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

export default function AdminEventsTable({ 
  dbEvents, 
  formatDateCzech, 
  handleToggleHideEvent, 
  handleDeleteEvent, 
  setAdminEventForm, 
  setShowAdminEventModal 
}) {
  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in space-y-6 pt-4 pb-12 pointer-events-auto font-mono">
      <div className="flex justify-between items-center bg-white p-5 border-2 border-black">
        <h2 className="text-xl font-bold uppercase tracking-wider text-black">Správa událostí a balíčků</h2>
        <button 
          onClick={() => { 
            setAdminEventForm({ id: null, title: '', date: '', time: '17:00 - 20:00', category: 'Workshop', description: '', image_url: '', requires_checkin: false, is_hidden: false, variants: [{ id: '1', title: 'Základní vstupenka', description: 'Vstup na akci', price: 500, capacity: 20 }] }); 
            setShowAdminEventModal(true); 
          }} 
          className="bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-3 hover:bg-neutral-800 cursor-pointer"
        >
          + Vytvořit Event
        </button>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead>
              <tr className="bg-[#f4f4f4] text-black font-bold text-xs uppercase tracking-wider border-b-2 border-black">
                <th className="p-4">Název akce</th>
                <th className="p-4">Kategorie</th>
                <th className="p-4">Termín</th>
                <th className="p-4">Balíčky</th>
                <th className="p-4 text-right">Rychlé akce</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {dbEvents.length === 0 ? (
                 <tr><td colSpan="5" className="p-8 text-center uppercase text-neutral-500">Zatím nejsou vytvořeny žádné akce.</td></tr>
              ) : (
                dbEvents.map(event => (
                  <tr key={event.id} className="hover:bg-[#f4f4f4] transition-none text-xs sm:text-sm">
                    <td className="p-4 font-bold text-black">
                      {event.title}
                      {event.is_hidden && <span className="ml-2 text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase">Skryto</span>}
                    </td>
                    <td className="p-4"><span className="bg-[#f4f4f4] border border-black text-black px-2 py-1 text-xs font-bold uppercase">{event.category || 'Workshop'}</span></td>
                    <td className="p-4 text-neutral-700">{formatDateCzech(event.date)} <span className="text-[10px] text-neutral-400 block">{event.time}</span></td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {event.variants?.map(v => (
                          <div key={v.id} className="text-xs bg-[#f4f4f4] border border-black px-2 py-1 inline-block mr-1">
                            <strong>{v.title}</strong>: {v.price} Kč ({v.capacity}m)
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex justify-end gap-1.5">
                          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/?event=${event.id}`); alert('URL akce zkopírována do schránky!'); }} className="text-xs bg-[#f4f4f4] border-2 border-black text-black font-bold px-3 py-2 hover:bg-black hover:text-white cursor-pointer" title="Kopírovat URL">🔗</button>
                          <button onClick={() => handleToggleHideEvent(event.id, event.is_hidden)} className={`text-xs font-bold px-3 py-2 border-2 border-black cursor-pointer ${event.is_hidden ? 'bg-black text-white' : 'bg-[#f4f4f4] text-black'}`} title={event.is_hidden ? 'Zviditelnit' : 'Skrýt'}>{event.is_hidden ? '👁️' : '🚫'}</button>
                          <button onClick={() => { setAdminEventForm(event); setShowAdminEventModal(true); }} className="text-xs bg-[#f4f4f4] border-2 border-black text-black font-bold px-3 py-2 hover:bg-black hover:text-white cursor-pointer">Upravit</button>
                          <button onClick={() => handleDeleteEvent(event.id)} className="text-xs bg-red-100 border-2 border-red-600 text-red-700 font-bold px-3 py-2 hover:bg-red-600 hover:text-white cursor-pointer">Smazat</button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
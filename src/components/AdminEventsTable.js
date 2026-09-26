'use client';

import { useState } from 'react';

export default function AdminEventsTable({ 
  dbEvents, 
  reservations = [], 
  formatDateCzech, 
  handleToggleHideEvent, 
  handleDeleteEvent, 
  setAdminEventForm, 
  setShowAdminEventModal,
  handleUpdateReservationStatus,
  handleDeleteReservation
}) {
  const [activeEventIdForReservations, setActiveEventIdForReservations] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const selectedEventForRes = dbEvents.find(e => e.id === activeEventIdForReservations);
  const eventReservations = reservations.filter(r => r.event_id === activeEventIdForReservations);

  const handleCopyEventUrl = (eventId) => {
    const url = `${window.location.origin}/?event=${eventId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* HLAVIČKA ADMINISTRACE AKCÍ */}
      <div className="bg-white border border-neutral-300 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-black">Správa akcí a rezervací</h2>
          <p className="text-xs text-neutral-500 uppercase mt-1">Přehled všech vypsaných událostí a jejich účastníků</p>
        </div>
        <button 
          onClick={() => {
            setAdminEventForm({
              id: null, title: '', date: '', time: '17:00 - 20:00', category: 'Workshop',
              description: '', image_url: '', requires_checkin: false, is_hidden: false,
              variants: [{ id: '1', title: 'Základní vstupenka', description: 'Vstup na akci', price: 500, capacity: 20 }]
            });
            setShowAdminEventModal(true);
          }}
          className="bg-black text-white hover:bg-neutral-800 px-5 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer border border-neutral-300 transition-colors"
        >
          + Vytvořit novou akcí
        </button>
      </div>

      {/* HLAVNÍ TABULKA EVENTŮ */}
      <div className="bg-white border border-neutral-300 p-6 sm:p-8 overflow-hidden">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 pb-2 border-b border-neutral-300">Seznam akcí</h3>
        
        {dbEvents.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 uppercase text-xs">Zatím nebyly vytvořeny žádné akce.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-300 text-neutral-500 uppercase text-[10px]">
                  <th className="py-3 px-4">Akce / Datum</th>
                  <th className="py-3 px-4">Kategorie</th>
                  <th className="py-3 px-4">Kapacita / Rezervace</th>
                  <th className="py-3 px-4">Stav</th>
                  <th className="py-3 px-4 text-right">Správa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {dbEvents.map((ev) => {
                  const evRes = reservations.filter(r => r.event_id === ev.id && r.status !== 'cancelled');
                  const totalCap = ev.variants?.reduce((sum, v) => sum + (Number(v.capacity) || 0), 0) || 0;
                  
                  return (
                    <tr key={ev.id} className="hover:bg-[#f4f4f4] transition-colors">
                      <td className="py-4 px-4 font-bold">
                        <div className="uppercase text-black">{ev.title}</div>
                        <div className="text-[10px] text-neutral-500 font-normal">📅 {formatDateCzech(ev.date)} • ⏰ {ev.time}</div>
                      </td>
                      
                      <td className="py-4 px-4 uppercase">
                        <span className="px-2 py-0.5 border border-neutral-300 text-[10px] font-bold bg-[#f4f4f4]">
                          {ev.category || 'Workshop'}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold">
                        <span className="text-black">{evRes.length}</span> / {totalCap} míst
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${ev.is_hidden ? 'bg-neutral-200 text-neutral-600 border-neutral-300' : 'bg-green-100 text-green-800 border-green-300'}`}>
                          {ev.is_hidden ? 'Skryto' : 'Veřejné'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => handleCopyEventUrl(ev.id)}
                          className="bg-neutral-100 text-black hover:bg-neutral-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-300"
                          title="Zkopírovat odkaz na event"
                        >
                          {copiedId === ev.id ? '✓ Zkopírováno' : 'Kopírovat URL'}
                        </button>
                        <button 
                          onClick={() => setActiveEventIdForReservations(ev.id)}
                          className="bg-black text-white hover:bg-[#E4664F] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-300"
                        >
                          Účastníci ({evRes.length})
                        </button>
                        <button 
                          onClick={() => {
                            setAdminEventForm({
                              id: ev.id,
                              title: ev.title,
                              date: ev.date,
                              time: ev.time,
                              category: ev.category || 'Workshop',
                              description: ev.description,
                              image_url: ev.image_url || '',
                              requires_checkin: ev.requires_checkin || false,
                              is_hidden: ev.is_hidden || false,
                              variants: ev.variants || [{ id: '1', title: 'Vstupenka', description: '', price: ev.price || 500, capacity: ev.capacity || 10 }]
                            });
                            setShowAdminEventModal(true);
                          }}
                          className="bg-neutral-200 hover:bg-neutral-300 text-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-300"
                        >
                          Upravit
                        </button>
                        <button 
                          onClick={() => handleToggleHideEvent(ev.id, ev.is_hidden)}
                          className="text-neutral-600 hover:text-black px-2 py-1.5 text-[10px] font-bold uppercase cursor-pointer"
                        >
                          {ev.is_hidden ? 'Zveřejnit' : 'Skrýt'}
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="text-red-600 hover:text-red-800 px-1 py-1.5 text-xs font-bold uppercase cursor-pointer"
                          title="Smazat event"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILNÍ SEZNAM ÚČASTNÍKŮ VYBRANÉ AKCE */}
      {activeEventIdForReservations && selectedEventForRes && (
        <div className="bg-white border-2 border-black p-6 sm:p-8 animate-in fade-in">
          <div className="flex justify-between items-center mb-6 border-b border-neutral-300 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#E4664F] text-white border border-neutral-300 mb-1 inline-block">Správa účastníků</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-black">{selectedEventForRes.title}</h3>
              <p className="text-xs text-neutral-500 uppercase">Termín: {formatDateCzech(selectedEventForRes.date)} • {selectedEventForRes.time}</p>
            </div>
            <button 
              onClick={() => setActiveEventIdForReservations(null)}
              className="bg-black text-white hover:bg-neutral-800 px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer border border-neutral-300"
            >
              ✕ Zavřít přehled účastníků
            </button>
          </div>

          {eventReservations.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 uppercase text-xs">Na tuto akce zatím nejsou žádné rezervace.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-300 text-neutral-500 uppercase text-[10px]">
                    <th className="py-3 px-3">Zákazník</th>
                    <th className="py-3 px-3">Balíček / Poznámka</th>
                    <th className="py-3 px-3">Cena</th>
                    <th className="py-3 px-3">Stav platby</th>
                    <th className="py-3 px-3 text-right">Správa platby</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {eventReservations.map((res) => {
                    const customer = res.customers || {};
                    return (
                      <tr key={res.id} className="hover:bg-[#f4f4f4]">
                        <td className="py-3 px-3">
                          <div className="font-bold uppercase">{customer.first_name || ''} {customer.last_name || ''}</div>
                          <div className="text-[10px] text-neutral-500 lowercase">{customer.email} {customer.phone ? `• ${customer.phone}` : ''}</div>
                          {customer.company_name && <div className="text-[10px] text-neutral-600 uppercase">Firma: {customer.company_name} (IČO: {customer.ico})</div>}
                        </td>
                        
                        <td className="py-3 px-3 uppercase font-medium">
                          {res.notes || 'Vstupenka'}
                          <div className="text-[10px] text-neutral-500 font-mono">VS: {res.variable_symbol}</div>
                        </td>

                        <td className="py-3 px-3 font-bold whitespace-nowrap">
                          {res.total_price} Kč
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase border ${
                            res.status === 'paid' ? 'bg-green-100 text-green-800 border-green-300' :
                            res.status === 'cancelled' ? 'bg-red-100 text-red-800 border-green-300' :
                            'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {res.status === 'paid' ? 'Zaplaceno' : res.status === 'cancelled' ? 'Stornováno' : 'Čeká na platbu'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right space-x-2 whitespace-nowrap">
                          {res.status !== 'paid' && (
                            <button 
                              onClick={() => handleUpdateReservationStatus(res.id, 'paid')}
                              className="bg-black text-white hover:bg-[#E4664F] px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer border border-neutral-300"
                            >
                              Potvrdit platbu
                            </button>
                          )}
                          {res.status !== 'cancelled' && (
                            <button 
                              onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                              className="bg-neutral-200 text-black hover:bg-neutral-300 px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer border border-neutral-300"
                            >
                              Stornovat
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteReservation(res.id)}
                            className="text-red-600 hover:text-red-800 font-bold p-1 text-xs cursor-pointer"
                            title="Trvale smazat"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
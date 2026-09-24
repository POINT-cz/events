'use client';

import { useState, useRef, useEffect } from 'react';

export default function Header({ 
  view, setView, user, 
  setShowAuthModal, handleLogout, displayName,
  setIsLoginMode, setIsForgotPasswordMode, setResetEmailSent, setGdprConsent,
  setBookingStep, setSelectedEvent
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // --- ZABEZPEČENÍ ADMINA ---
  const ADMIN_EMAIL = 'hello@pointspace.cz'; 
  const isAdmin = user && user.email === ADMIN_EMAIL;

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm w-full">
      <div className="px-4 sm:px-8 py-3 grid grid-cols-1 md:grid-cols-3 items-center gap-3 md:gap-0 max-w-7xl mx-auto w-full">
        
        {/* LEVÁ STRANA: Logo + případně mobilní login */}
        <div className="flex items-center shrink-0 justify-between md:justify-start">
          <div className="cursor-pointer pointer-events-auto flex items-center" onClick={() => { setView('events_portal'); setBookingStep(1); setSelectedEvent(null); }}>
            <img src="/logo.png" alt="POINT Logo" className="h-6 sm:h-7 w-auto object-contain" />
          </div>
          
          {!user && (
             <div className="md:hidden">
               <button onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-colors shadow-sm pointer-events-auto">Přihlásit se</button> 
             </div>
          )}
        </div>
        
        {/* STŘED: Akce a Oblíbené - přesně uprostřed obrazovky */}
        <div className="flex justify-center items-center pointer-events-auto w-full overflow-x-auto hide-scrollbar">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl shadow-inner whitespace-nowrap items-center shrink-0">
            <button onClick={() => { setView('events_portal'); setBookingStep(1); setSelectedEvent(null); }} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${view === 'events_portal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Katalog akcí</button>
            <button onClick={() => { setView('client_favorites'); }} className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${view === 'client_favorites' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              <span className="text-red-500">❤️</span> Oblíbené
            </button>
          </div>
        </div>

        {/* PRAVÁ STRANA: Zpět na rezervace prostor + Uživatel / Login */}
        <div className="hidden md:flex items-center space-x-3 text-sm font-medium justify-end">
          <a href="https://rezervace.pointspace.cz" className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer pointer-events-auto shadow-sm">
            <span>←</span> Zpět na rezervace prostor
          </a>

          {user ? (
            <div className="relative pointer-events-auto" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className={`flex items-center gap-2 text-xs font-semibold transition-colors px-3 py-2 rounded-xl border border-gray-200 bg-white hover:border-slate-300 ${(view === 'client_dashboard' || view === 'client_profile' || view === 'admin') ? 'border-slate-300 text-slate-900 shadow-sm' : 'text-slate-700'} max-w-[160px]`}>
                <div className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center shrink-0 text-xs">👤</div>
                <span className="truncate">{displayName}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in flex flex-col p-1.5">
                  
                  {/* ADMIN TLAČÍTKO - ZOBRAZÍ SE POUZE POKUD JSI ADMIN */}
                  {isAdmin && (
                    <button onClick={() => { setView('admin'); setShowUserMenu(false); }} className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer pointer-events-auto mb-1">
                      <span>⚙️</span> Administrace akcí
                    </button>
                  )}

                  <button onClick={() => { setView('client_profile'); setShowUserMenu(false); }} className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer pointer-events-auto">Můj profil</button>
                  <button onClick={() => { setView('client_dashboard'); setShowUserMenu(false); }} className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer pointer-events-auto">Moje vstupenky</button>
                  <button onClick={() => { setView('client_favorites'); setShowUserMenu(false); }} className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer pointer-events-auto flex items-center gap-2"><span className="text-red-500">❤️</span> Oblíbené akce</button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button onClick={handleLogout} className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer pointer-events-auto">Odhlásit se</button>
                </div>
              )}
            </div>
          ) : ( 
            <button onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors shadow-sm pointer-events-auto shrink-0">Přihlásit se</button> 
          )}
        </div>
      </div>
    </header>
  );
}
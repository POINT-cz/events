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
    <header className="bg-[#f4f4f4] border-b-2 border-black sticky top-0 z-40 w-full">
      <div className="px-4 sm:px-8 py-3 grid grid-cols-1 md:grid-cols-3 items-center gap-3 md:gap-0 max-w-7xl mx-auto w-full">
        
        {/* LEVÁ STRANA: Logo + případně mobilní login */}
        <div className="flex items-center shrink-0 justify-between md:justify-start">
          <div className="cursor-pointer pointer-events-auto flex items-center" onClick={() => { setView('events_portal'); setBookingStep(1); setSelectedEvent(null); }}>
            <img src="/logo.png" alt="POINT Logo" className="h-6 sm:h-7 w-auto object-contain mix-blend-multiply" />
          </div>
          
          {!user && (
             <div className="md:hidden">
               <button onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} className="text-[11px] font-bold text-white bg-black hover:bg-[#E4664F] px-3 py-1.5 rounded-none transition-colors pointer-events-auto border-2 border-black uppercase tracking-wider">Přihlásit se</button> 
             </div>
          )}
        </div>
        
        {/* STŘED: Akce a Oblíbené - přesně uprostřed obrazovky */}
        <div className="flex justify-center items-center pointer-events-auto w-full overflow-x-auto hide-scrollbar">
          <div className="flex space-x-1 bg-white p-1 rounded-none border-2 border-black whitespace-nowrap items-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button onClick={() => { setView('events_portal'); setBookingStep(1); setSelectedEvent(null); }} className={`px-4 py-1.5 text-xs font-bold rounded-none transition-all ${view === 'events_portal' ? 'bg-black text-white' : 'text-black hover:text-[#E4664F]'}`}>Katalog akcí</button>
            <button onClick={() => { setView('client_favorites'); }} className={`px-4 py-1.5 text-xs font-bold rounded-none transition-all flex items-center gap-1.5 ${view === 'client_favorites' ? 'bg-black text-white' : 'text-black hover:text-[#E4664F]'}`}>
              <span className="text-[#E4664F]">❤️</span> Oblíbené
            </button>
          </div>
        </div>

        {/* PRAVÁ STRANA: Zpět na rezervace prostor + Uživatel / Login */}
        <div className="hidden md:flex items-center space-x-3 text-sm font-medium justify-end">
          <a href="https://rezervace.pointspace.cz" className="px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-wider rounded-none border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-all flex items-center gap-1.5 cursor-pointer pointer-events-auto">
            <span>←</span> Zpět na prostory
          </a>

          {user ? (
            <div className="relative pointer-events-auto" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className={`flex items-center gap-2 text-xs font-bold uppercase transition-colors px-3 py-1.5 border-2 border-black bg-white ${(view === 'client_dashboard' || view === 'client_profile' || view === 'admin') ? 'bg-black text-white' : 'text-black hover:bg-black hover:text-white'} max-w-[160px]`}>
                <div className="w-5 h-5 bg-[#f4f4f4] text-black border border-black flex items-center justify-center shrink-0 text-xs">👤</div>
                <span className="truncate">{displayName}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-hidden z-50 animate-in fade-in flex flex-col">
                  
                  {/* ADMIN TLAČÍTKO - ZOBRAZÍ SE POUZE POKUD JSI ADMIN */}
                  {isAdmin && (
                    <button onClick={() => { setView('admin'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-bold uppercase text-[#E4664F] hover:bg-black hover:text-white transition-colors border-b-2 border-black flex items-center gap-2 cursor-pointer pointer-events-auto">
                      <span>⚙️</span> Administrace akcí
                    </button>
                  )}

                  <button onClick={() => { setView('client_profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-mono font-medium text-black hover:bg-black hover:text-white transition-colors cursor-pointer pointer-events-auto border-b border-gray-100">Můj profil</button>
                  <button onClick={() => { setView('client_dashboard'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-mono font-medium text-black hover:bg-black hover:text-white transition-colors cursor-pointer pointer-events-auto border-b border-gray-100">Moje vstupenky</button>
                  <button onClick={() => { setView('client_favorites'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-mono font-medium text-black hover:bg-black hover:text-white transition-colors cursor-pointer pointer-events-auto border-b border-gray-100 flex items-center gap-2"><span className="text-[#E4664F]">❤️</span> Oblíbené akce</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs font-mono font-bold uppercase text-[#E4664F] hover:bg-black hover:text-white transition-colors cursor-pointer pointer-events-auto">Odhlásit se</button>
                </div>
              )}
            </div>
          ) : ( 
            <button onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} className="text-xs font-bold uppercase tracking-wider text-white bg-black hover:bg-[#E4664F] px-4 py-2 rounded-none transition-colors pointer-events-auto shrink-0 border-2 border-black">Přihlásit se</button> 
          )}
        </div>
      </div>
    </header>
  );
}
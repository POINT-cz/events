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
    <header className="bg-white border-b border-neutral-300 sticky top-0 z-40 w-full pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* LEVÁ STRANA: Logo + Navigace pro eventy */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="cursor-pointer flex items-center" onClick={() => { setView('events_portal'); setBookingStep(1); setSelectedEvent(null); }}>
            <img src="/logo.png" alt="POINT Logo" className="h-6 sm:h-7 w-auto object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-1 border border-neutral-300 p-1 bg-[#f4f4f4]">
            <button 
              onClick={() => { setView('events_portal'); setBookingStep(1); setSelectedEvent(null); }} 
              className={`px-4 py-1.5 text-xs font-mono font-bold uppercase transition-none cursor-pointer ${view === 'events_portal' ? 'bg-[#E4664F] text-white' : 'bg-white text-black hover:bg-neutral-200'}`}
            >
              KATALOG AKCÍ //
            </button>
            <button 
              onClick={() => setView('client_favorites')} 
              className={`px-4 py-1.5 text-xs font-mono font-bold uppercase transition-none cursor-pointer flex items-center gap-1.5 ${view === 'client_favorites' ? 'bg-[#E4664F] text-white' : 'bg-white text-black hover:bg-neutral-200'}`}
            >
              <span>❤️</span> OBLÍBENÉ
            </button>
          </nav>
        </div>

        {/* PRAVÁ STRANA: Zpět na prostory + Profil/Login */}
        <div className="flex items-center gap-3">
          <a 
            href="https://rezervace.pointspace.cz" 
            className="hidden lg:flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white px-4 py-2.5 border border-neutral-300 hover:border-black transition-none cursor-pointer"
          >
            <span>←</span> PROSTORY & COWORK
          </a>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black bg-white px-3.5 py-2.5 border border-neutral-300 hover:border-black transition-none cursor-pointer"
              >
                <div className="w-5 h-5 bg-[#f4f4f4] border border-neutral-300 text-black flex items-center justify-center text-[10px]">👤</div>
                <span className="max-w-[120px] truncate">{displayName}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-300 shadow-xl py-1 z-50 flex flex-col">
                  {isAdmin && (
                    <button onClick={() => { setView('admin'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-mono font-bold uppercase text-[#E4664F] hover:bg-[#f4f4f4] border-b border-neutral-200 flex items-center gap-2 cursor-pointer">
                      <span>⚙️</span> ADMINISTRACE AKCÍ
                    </button>
                  )}
                  <button onClick={() => { setView('client_profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-mono font-medium text-black hover:bg-[#f4f4f4] cursor-pointer">MŮJ PROFIL</button>
                  <button onClick={() => { setView('client_dashboard'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-mono font-medium text-black hover:bg-[#f4f4f4] cursor-pointer">MOJE VSTUPENKY</button>
                  <button onClick={() => { setView('client_favorites'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-xs font-mono font-medium text-black hover:bg-[#f4f4f4] cursor-pointer">OBLÍBENÉ AKCE</button>
                  <div className="h-px bg-neutral-300 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs font-mono font-bold uppercase text-[#E4664F] hover:bg-[#f4f4f4] cursor-pointer">ODHLÁSIT SE</button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} 
              className="text-xs font-mono font-bold uppercase tracking-widest text-white bg-black hover:bg-[#E4664F] px-4 py-2.5 border border-black transition-none cursor-pointer"
            >
              PŘIHLÁSIT SE
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
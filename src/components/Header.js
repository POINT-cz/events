'use client';

import { useState, useRef, useEffect } from 'react';

export default function Header({ 
  view, setView, section, setSection, user, isAdmin, 
  resetClientView, setShowAuthModal, handleLogout, displayName,
  setIsLoginMode, setIsForgotPasswordMode, setResetEmailSent, setGdprConsent
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const logoHeight = "h-7 sm:h-8"; 

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
    <header className="bg-[#f4f4f4] border-b border-neutral-300 sticky top-0 z-40 w-full overflow-x-hidden">
      <div className="px-3 sm:px-8 py-3.5 sm:py-4 flex flex-col md:grid md:grid-cols-3 items-center gap-3 sm:gap-4 max-w-7xl mx-auto w-full">
        
        {/* 1. SLOUPEC: Logo */}
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
          <div className="cursor-pointer pointer-events-auto flex items-center py-1" onClick={() => { setView('events_portal'); setSection('catalog'); }}>
            <img 
              src="/logo.png" 
              alt="POINT SPACE" 
              className={`${logoHeight} w-auto object-contain block`}
              onError={(e) => {
                if (e.target.src.endsWith('.png')) {
                  e.target.src = '/logo.png';
                }
              }}
            />
          </div>
          
          {/* Mobilní tlačítko přihlášení (pokud uživatel není přihlášený) */}
          {!user && (
             <div className="md:hidden">
               <button 
                 type="button"
                 onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} 
                 className="text-xs font-mono font-bold uppercase tracking-widest text-white bg-[#E4664F] hover:bg-[#d42506] px-3 py-2 transition-colors pointer-events-auto cursor-pointer active:scale-95 touch-manipulation"
               >
                 Přihlásit
               </button> 
             </div>
          )}
        </div>
        
        {/* 2. SLOUPEC: Katalog akcí / Oblíbené */}
        <div className="flex justify-center items-center pointer-events-auto w-full">
          <div className="flex border border-neutral-300 bg-neutral-300 p-[1px] gap-[1px] w-full max-w-sm sm:max-w-md">
            <button 
              type="button"
              onClick={() => { setView('events_portal'); setSection('catalog'); }} 
              className={`flex-1 py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-center transition-all cursor-pointer touch-manipulation ${section === 'catalog' && view === 'events_portal' ? 'bg-[#E4664F] text-white' : 'bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}
            >
              Katalog akcí
            </button>
            <button 
              type="button"
              onClick={() => { setView('events_portal'); setSection('favorites'); }} 
              className={`flex-1 py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-center transition-all cursor-pointer touch-manipulation ${section === 'favorites' && view === 'events_portal' ? 'bg-[#E4664F] text-white' : 'bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}
            >
              Oblíbené
            </button>
          </div>
        </div>

        {/* 3. SLOUPEC: Odkaz na rezervace a uživatel */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono font-bold uppercase tracking-widest justify-between md:justify-end w-full md:w-auto">
          <a 
            href="https://rezervace.pointspace.cz" 
            className="px-2.5 sm:px-3 py-2 border border-neutral-300 text-black hover:border-black hover:bg-black hover:text-white transition-all flex items-center gap-1 cursor-pointer pointer-events-auto text-[11px] sm:text-xs"
          >
            Rezervace <span>↗</span>
          </a>

          {user ? (
            <div className="relative pointer-events-auto" ref={userMenuRef}>
              <button 
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className={`flex items-center gap-1.5 sm:gap-2 font-mono font-bold transition-colors text-[11px] sm:text-xs ${(view === 'client_dashboard' || view === 'client_profile' || view === 'admin') ? 'bg-[#E4664F] text-white px-2.5 sm:px-3 py-2' : 'text-black border border-neutral-300 hover:border-black px-2.5 sm:px-3 py-2'} cursor-pointer touch-manipulation`}
              >
                <span>[👤]</span>
                <span className="truncate max-w-[80px] sm:max-w-[120px]">{displayName}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#f4f4f4] border border-neutral-300 shadow-lg z-50 flex flex-col">
                  {isAdmin && (
                    <button 
                      type="button"
                      onClick={() => { setView('admin'); setShowUserMenu(false); }} 
                      className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-[#E4664F] hover:bg-black hover:text-white transition-colors border-b border-neutral-300 flex items-center gap-2 cursor-pointer pointer-events-auto"
                    >
                      <span>⚙️</span> Administrace
                    </button>
                  )}

                  <button 
                    type="button"
                    onClick={() => { setView('client_profile'); setShowUserMenu(false); }} 
                    className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors border-b border-neutral-300 cursor-pointer pointer-events-auto"
                  >
                    Můj profil
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setView('client_dashboard'); setShowUserMenu(false); }} 
                    className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors border-b border-neutral-300 cursor-pointer pointer-events-auto"
                  >
                    Moje vstupenky
                  </button>
                  <button 
                    type="button"
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors cursor-pointer pointer-events-auto"
                  >
                    Odhlásit se
                  </button>
                </div>
              )}
            </div>
          ) : ( 
            <button 
              type="button"
              onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} 
              className="hidden md:inline-block text-xs font-mono font-bold uppercase tracking-widest text-white bg-[#E4664F] hover:bg-[#d42506] px-4 py-2 transition-colors pointer-events-auto cursor-pointer active:scale-95 touch-manipulation"
            >
              Přihlásit se
            </button> 
          )}
        </div>
      </div>
    </header>
  );
}
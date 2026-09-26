'use client';

import { useState, useRef, useEffect } from 'react';

export default function Header({ 
  view, setView, section, setSection, user, 
  setShowAuthModal, handleLogout, displayName,
  setIsLoginMode, setIsForgotPasswordMode, setResetEmailSent, setGdprConsent
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const logoHeight = "h-8"; 

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
    <header className="bg-[#f4f4f4] border-b border-neutral-300 sticky top-0 z-50 w-full">
      <div className="px-4 sm:px-8 py-4 flex flex-col md:grid md:grid-cols-3 items-center gap-4 max-w-7xl mx-auto w-full">
        
        {/* 1. SLOUPEC: Logo */}
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
          <div className="cursor-pointer flex items-center py-1" onClick={() => { setView('client'); setSection('catalog'); }}>
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
          
          {/* Mobilní tlačítko přihlášení */}
          {!user && (
             <div className="md:hidden">
               <button 
                 onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} 
                 className="text-xs font-mono font-bold uppercase tracking-widest text-white bg-[#E4664F] hover:bg-[#d42506] px-3 py-2 cursor-pointer transition-colors"
               >
                 Přihlásit
               </button> 
             </div>
          )}
        </div>
        
        {/* 2. SLOUPEC: Katalog akcí / Oblíbené (Opravené klikání) */}
        <div className="flex justify-center items-center w-full overflow-x-auto z-10">
          <div className="flex border border-neutral-300 bg-neutral-300 p-[1px] gap-[1px] w-full max-w-xs">
            <button 
              type="button"
              onClick={() => { setView('client'); setSection('catalog'); }} 
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-widest text-center transition-all cursor-pointer ${section === 'catalog' && view === 'client' ? 'bg-[#E4664F] text-white' : 'bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}
            >
              Katalog akcí
            </button>
            <button 
              type="button"
              onClick={() => { setView('client'); setSection('favorites'); }} 
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-widest text-center transition-all cursor-pointer ${section === 'favorites' && view === 'client' ? 'bg-[#E4664F] text-white' : 'bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}
            >
              Oblíbené
            </button>
          </div>
        </div>

        {/* 3. SLOUPEC: Odkaz na rezervace a uživatel */}
        <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-mono font-bold uppercase tracking-widest justify-between md:justify-end w-full md:w-auto">
          <a href="https://rezervace.pointspace.cz" className="px-3 py-2 border border-neutral-300 text-black hover:border-black hover:bg-black hover:text-white transition-all flex items-center gap-1.5 cursor-pointer">
            Rezervace prostor <span>↗</span>
          </a>

          {user ? (
            <div className="relative z-20" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 font-mono font-bold transition-colors text-black border border-neutral-300 hover:border-black px-3 py-2 cursor-pointer">
                <span>[👤]</span>
                <span className="truncate max-w-[100px] sm:max-w-none">{displayName}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#f4f4f4] border border-neutral-300 shadow-lg z-50 flex flex-col">
                  <button onClick={() => { setView('client_dashboard'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors border-b border-neutral-300 cursor-pointer">Moje vstupenky</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors cursor-pointer">Odhlásit se</button>
                </div>
              )}
            </div>
          ) : ( 
            <button 
              onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} 
              className="hidden md:inline-block text-xs font-mono font-bold uppercase tracking-widest text-white bg-[#E4664F] hover:bg-[#d42506] px-4 py-2 cursor-pointer transition-colors"
            >
              Přihlásit se
            </button> 
          )}
        </div>
      </div>
    </header>
  );
}
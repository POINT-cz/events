'use client';

import { useState, useRef, useEffect } from 'react';

export default function Header({ 
  view, setView, section, setSection, user, isAdmin, 
  resetClientView, setShowAuthModal, handleLogout, displayName,
  setIsLoginMode, setIsForgotPasswordMode, setResetEmailSent, setGdprConsent
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // ZDE MŮŽEŠ JEDNODUCHĚ MĚNIT VELIKOST LOGA (např. h-6, h-8, h-10, h-12)
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
    <header className="bg-[#f4f4f4] border-b border-neutral-300 sticky top-0 z-40 w-full">
      <div className="px-4 sm:px-8 py-4 flex flex-col md:grid md:grid-cols-3 items-center gap-4 max-w-7xl mx-auto w-full">
        
        {/* 1. SLOUPEC: Logo */}
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
          <div className="cursor-pointer pointer-events-auto flex items-center py-1" onClick={() => { setView('client'); setSection('studio'); }}>
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
               <button onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} className="text-xs font-mono font-bold uppercase tracking-widest text-white bg-[#E4664F] hover:bg-[#d42506] px-3 py-2 transition-colors pointer-events-auto cursor-pointer">Přihlásit</button> 
             </div>
          )}
        </div>
        
        {/* 2. SLOUPEC: Studio / Cowork / Space */}
        {(view === 'client' || view === 'client_dashboard' || view === 'client_profile') && (
          <div className="flex justify-center items-center pointer-events-auto w-full overflow-x-auto">
            <div className="flex border border-neutral-300 bg-neutral-300 p-[1px] gap-[1px] w-full max-w-md">
              <button onClick={() => setSection('studio')} className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-widest text-center transition-all cursor-pointer ${section === 'studio' && view === 'client' ? 'bg-[#E4664F] text-white' : 'bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}>Studio</button>
              <button onClick={() => setSection('cowork')} className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-widest text-center transition-all cursor-pointer ${section === 'cowork' && view === 'client' ? 'bg-[#E4664F] text-white' : 'bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}>Cowork</button>
              <button onClick={() => setSection('space')} className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-widest text-center transition-all cursor-pointer ${section === 'space' && view === 'client' ? 'bg-[#E4664F] text-white' : 'bg-[#f4f4f4] text-black hover:bg-neutral-200'}`}>Space</button>
            </div>
          </div>
        )}
        {view !== 'client' && view !== 'client_dashboard' && view !== 'client_profile' && <div className="hidden md:block"></div>}

        {/* 3. SLOUPEC: Akce a uživatel */}
        <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-mono font-bold uppercase tracking-widest justify-between md:justify-end w-full md:w-auto">
          <a href="https://events.pointspace.cz" className="px-3 py-2 border border-neutral-300 text-black hover:border-black hover:bg-black hover:text-white transition-all flex items-center gap-1.5 cursor-pointer pointer-events-auto">
            Akce <span>↗</span>
          </a>

          {user ? (
            <div className="relative pointer-events-auto" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className={`flex items-center gap-2 font-mono font-bold transition-colors ${(view === 'client_dashboard' || view === 'client_profile' || view === 'admin') ? 'bg-[#E4664F] text-white px-3 py-2' : 'text-black border border-neutral-300 hover:border-black px-3 py-2'} cursor-pointer`}>
                <span>[👤]</span>
                <span className="truncate max-w-[100px] sm:max-w-none">{displayName}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#f4f4f4] border border-neutral-300 shadow-none z-50 flex flex-col">
                  
                  {isAdmin && (
                    <button onClick={() => { setView('admin'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-[#E4664F] hover:bg-black hover:text-white transition-colors border-b border-neutral-300 flex items-center gap-2 cursor-pointer pointer-events-auto">
                      <span>⚙️</span> Administrace
                    </button>
                  )}

                  <button onClick={() => { setView('client_profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors border-b border-neutral-300 cursor-pointer pointer-events-auto">Můj profil</button>
                  <button onClick={() => { setView('client_dashboard'); setShowUserMenu(false); }} className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors border-b border-neutral-300 cursor-pointer pointer-events-auto">Moje rezervace</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors cursor-pointer pointer-events-auto">Odhlásit se</button>
                </div>
              )}
            </div>
          ) : ( 
            <button onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} className="hidden md:inline-block text-xs font-mono font-bold uppercase tracking-widest text-white bg-[#E4664F] hover:bg-[#d42506] px-4 py-2 transition-colors pointer-events-auto cursor-pointer">Přihlásit se</button> 
          )}
        </div>
      </div>
    </header>
  );
}
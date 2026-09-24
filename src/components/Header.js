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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-6">
          <div className="cursor-pointer flex items-center" onClick={() => { setView('events_portal'); setBookingStep(1); setSelectedEvent(null); }}>
            <img src="/logo.png" alt="POINT Logo" className="h-6 w-auto object-contain" />
          </div>

          {/* Hlavní přepínač uprostřed / vedle loga */}
          <nav className="hidden md:flex items-center bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => { setView('events_portal'); setBookingStep(1); setSelectedEvent(null); }} 
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'events_portal' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Katalog akcí
            </button>
            <button 
              onClick={() => setView('client_favorites')} 
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${view === 'client_favorites' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span>❤️</span> Oblíbené
            </button>
          </nav>
        </div>

        {/* Pravá strana: Zpět na prostory + Profil / Login */}
        <div className="flex items-center gap-3">
          <a 
            href="https://rezervace.pointspace.cz" 
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <span>←</span> Zpět na prostory
          </a>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="flex items-center gap-2 text-xs font-medium text-gray-800 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 bg-white transition-colors"
              >
                <div className="w-5 h-5 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-[10px]">👤</div>
                <span className="max-w-[120px] truncate">{displayName}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 flex flex-col">
                  {isAdmin && (
                    <button onClick={() => { setView('admin'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-gray-50 flex items-center gap-2">
                      <span>⚙️</span> Administrace
                    </button>
                  )}
                  <button onClick={() => { setView('client_profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Můj profil</button>
                  <button onClick={() => { setView('client_dashboard'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Moje vstupenky</button>
                  <button onClick={() => { setView('client_favorites'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Oblíbené akce</button>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Odhlásit se</button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} 
              className="text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Přihlásit se
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
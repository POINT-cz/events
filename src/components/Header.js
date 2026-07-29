'use client';

export default function Header({
  user, displayName, isAdmin, showUserMenu, setShowUserMenu, userMenuRef, view, setView, section, setSection, resetClientView, setBookingStep, handleLogout, setIsLoginMode, setIsForgotPasswordMode, setResetEmailSent, setShowAuthModal, setGdprConsent
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm w-full">
      <div className="px-4 sm:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center shrink-0">
          <img src="/logo.png" alt="POINT Logo" className="h-8 w-auto object-contain" />
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-6 text-sm font-medium justify-end min-w-0">
          {user ? (
            <div className="relative pointer-events-auto" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className={`flex items-center gap-2 text-sm font-bold transition-colors ${(view === 'client_dashboard' || view === 'client_profile' || view === 'client_favorites' || view === 'admin') ? 'text-red-600' : 'text-slate-800 hover:text-red-600'} max-w-[140px] sm:max-w-xs`}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0 text-base sm:text-lg">👤</div>
                <span className="hidden sm:inline capitalize truncate">{displayName}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in">
                  {isAdmin && (
                    <button onClick={() => { setView('admin'); setShowUserMenu(false); }} className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-b border-gray-100 flex items-center gap-2">
                      <span>⚙️</span> Administrace
                    </button>
                  )}
                  <button onClick={() => { setView('client_profile'); setShowUserMenu(false); }} className="w-full text-left px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Můj profil</button>
                  <button onClick={() => { setView('client_dashboard'); setShowUserMenu(false); }} className="w-full text-left px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Moje rezervace</button>
                  <button onClick={() => { setView('client_favorites'); setShowUserMenu(false); }} className="w-full text-left px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"><span className="text-red-500">❤️</span> Oblíbené akce</button>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Odhlásit se</button>
                </div>
              )}
            </div>
          ) : ( 
            <button onClick={() => { setIsLoginMode(true); setIsForgotPasswordMode(false); setResetEmailSent(false); setShowAuthModal(true); setGdprConsent(false); }} className="text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-sm pointer-events-auto shrink-0">Přihlásit se</button> 
          )}
        </div>
      </div>

      {(view === 'client' || view === 'client_dashboard' || view === 'client_profile' || view === 'client_favorites' || view === 'events_portal') && (
        <div className="px-4 sm:px-8 pb-4 flex justify-start sm:justify-center overflow-x-auto hide-scrollbar pointer-events-auto w-full">
          <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-xl shadow-inner whitespace-nowrap shrink-0">
            <button onClick={() => { setView('client'); setSection('studio'); resetClientView(); }} className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${section === 'studio' && view === 'client' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Studio</button>
            <button onClick={() => { setView('client'); setSection('cowork'); resetClientView(); }} className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${section === 'cowork' && view === 'client' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Cowork</button>
            <button onClick={() => { setView('client'); setSection('rental'); resetClientView(); }} className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${section === 'rental' && view === 'client' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Pronájem</button>
          </div>
        </div>
      )}
    </header>
  );
}
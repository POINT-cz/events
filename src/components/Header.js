'use client';

import Link from 'next/link';

export default function Header({ user, onOpenAuth }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo / Název */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight text-neutral-900">POINT</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">Events</span>
        </Link>

        {/* Navigace / Akce */}
        <div className="flex items-center gap-3">
          <Link 
            href="https://rezervace.pointspace.cz" 
            target="_blank"
            className="hidden sm:inline-flex text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 transition-colors"
          >
            Rezervace prostor
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-600 hidden md:inline">{user.email}</span>
              <button 
                onClick={onOpenAuth}
                className="text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-4 py-2 rounded-xl transition-colors border border-neutral-200"
              >
                Můj účet
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="text-xs font-semibold bg-[#E4664F] hover:bg-[#d25842] text-white px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow"
            >
              Přihlásit se
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
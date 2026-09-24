'use client';

export default function AuthModals({
  showRecoveryModal, handleRecoverySubmit, newRecoveryPassword, setNewRecoveryPassword,
  authLoading, showAuthModal, setShowAuthModal, isForgotPasswordMode, setIsForgotPasswordMode,
  isLoginMode, setIsLoginMode, resetEmailSent, authEmail, setAuthEmail, authPassword,
  setAuthPassword, gdprConsent, setGdprConsent, handleAuthSubmit
}) {
  return (
    <>
      {/* OBNOVA HESLA MODAL */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 pointer-events-auto p-6 sm:p-8 font-mono">
            <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-2">Nastavení nového hesla</h3>
            <p className="text-xs text-neutral-600 mb-6 uppercase">Zadejte nové heslo, kterým se budete odteď přihlašovat do systému.</p>
            <form onSubmit={handleRecoverySubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Nové heslo</label>
                <input type="password" required value={newRecoveryPassword} onChange={(e) => setNewRecoveryPassword(e.target.value)} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold outline-none" placeholder="Min. 6 znaků" minLength={6} />
              </div>
              <button type="submit" disabled={authLoading} className="w-full px-4 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-none disabled:opacity-50 cursor-pointer">
                {authLoading ? 'Ukládám...' : 'Změnit heslo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PŘIHLÁŠENÍ / REGISTRACE / ZAPOMENUTÉ HESLO MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 pointer-events-auto">
            {!isForgotPasswordMode ? (
              <div className="flex border-b-2 border-black">
                <button onClick={() => setIsLoginMode(true)} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-none cursor-pointer ${isLoginMode ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}`}>Přihlášení</button>
                <button onClick={() => setIsLoginMode(false)} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-none cursor-pointer ${!isLoginMode ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:text-black'}`}>Registrace</button>
              </div>
            ) : (
              <div className="p-6 sm:p-8 pb-0 border-b-2 border-black bg-[#f4f4f4]">
                <h3 className="text-lg font-bold text-black uppercase tracking-wider mb-2">Obnova hesla</h3>
                <p className="text-xs text-neutral-600 uppercase mb-4">Zadejte svůj e-mail a my vám zašleme odkaz pro resetování hesla.</p>
              </div>
            )}
            
            <form onSubmit={handleAuthSubmit} className="p-6 sm:p-8 space-y-5">
              {!isLoginMode && !isForgotPasswordMode && (
                <div className="bg-[#f4f4f4] p-3 border-2 border-black mb-4">
                  <p className="text-[10px] text-neutral-700 text-center uppercase font-bold">Registrací získáte možnost rychlejší rezervace a přehled o svých vstupenkách.</p>
                </div>
              )}
              
              {resetEmailSent && isForgotPasswordMode ? (
                <div className="bg-green-100 border-2 border-green-600 text-green-800 p-4 text-xs font-bold uppercase text-center">
                  Odkaz byl odeslán na váš e-mail. Zkontrolujte prosím i složku Spam.
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">E-mail</label>
                    <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold outline-none" placeholder="vas@email.cz" />
                  </div>

                  {!isForgotPasswordMode && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Heslo</label>
                      <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold outline-none" placeholder="Minimálně 6 znaků" minLength={6} />
                      {isLoginMode && (
                        <div className="text-right mt-2">
                          <button type="button" onClick={() => setIsForgotPasswordMode(true)} className="text-[10px] text-neutral-500 hover:text-black uppercase font-bold transition-none cursor-pointer underline">Zapomněli jste heslo?</button>
                        </div>
                      )}
                    </div>
                  )}

                  {!isLoginMode && !isForgotPasswordMode && (
                    <div className="flex items-start gap-2 pt-1 mb-2">
                      <input type="checkbox" id="authGdpr" required checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-black border-2 border-black cursor-pointer" />
                      <label htmlFor="authGdpr" className="text-[10px] text-neutral-700 leading-snug uppercase font-bold cursor-pointer">
                        Souhlasím se zpracováním osobních údajů a s Obchodními podmínkami. *
                      </label>
                    </div>
                  )}
                </>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {isForgotPasswordMode ? (
                  <>
                    {!resetEmailSent && (
                      <button type="submit" disabled={authLoading} className="w-full sm:flex-1 px-4 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-none disabled:opacity-50 order-1 sm:order-2 cursor-pointer">
                        {authLoading ? 'Odesílám...' : 'Odeslat odkaz'}
                      </button>
                    )}
                    <button type="button" onClick={() => { setIsForgotPasswordMode(false); setResetEmailSent(false); }} className={`w-full ${!resetEmailSent ? 'sm:flex-1' : ''} px-4 py-3.5 bg-[#f4f4f4] border-2 border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-none order-2 sm:order-1 cursor-pointer`}>
                      Zpět na přihlášení
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" disabled={authLoading} className="w-full sm:flex-1 px-4 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-none disabled:opacity-50 order-1 sm:order-2 cursor-pointer">
                      {authLoading ? 'Načítám...' : (isLoginMode ? 'Přihlásit se' : 'Vytvořit účet')}
                    </button>
                    <button type="button" onClick={() => setShowAuthModal(false)} className="w-full sm:flex-1 px-4 py-3.5 bg-[#f4f4f4] border-2 border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-none order-2 sm:order-1 cursor-pointer">
                      Zrušit
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
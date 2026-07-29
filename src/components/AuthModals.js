'use client';

export default function AuthModals({
  showAuthModal, setShowAuthModal,
  isLoginMode, setIsLoginMode,
  isForgotPasswordMode, setIsForgotPasswordMode,
  resetEmailSent, setResetEmailSent,
  authEmail, setAuthEmail,
  authPassword, setAuthPassword,
  authLoading, handleAuthSubmit,
  gdprConsent, setGdprConsent,
  setShowGdprModal, setShowVopModal,
  showRecoveryModal, setShowRecoveryModal,
  newRecoveryPassword, setNewRecoveryPassword,
  handleRecoverySubmit
}) {
  return (
    <>
      {/* OBNOVA HESLA MODAL */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-[250] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 pointer-events-auto p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nastavení nového hesla</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Zadejte nové heslo, kterým se budete odteď přihlašovat do systému.</p>
            <form onSubmit={handleRecoverySubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Nové heslo</label>
                <input type="password" required value={newRecoveryPassword} onChange={(e) => setNewRecoveryPassword(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" placeholder="Minimálně 6 znaků" minLength={6} />
              </div>
              <button type="submit" disabled={authLoading} className="group relative overflow-hidden w-full px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50">
                <span className="relative z-10 flex items-center justify-center h-full transition-transform duration-300 group-hover:-translate-y-12">
                  {authLoading ? 'Ukládám...' : 'Změnit heslo'}
                </span>
                <span className="absolute inset-0 z-10 flex items-center justify-center translate-y-12 group-hover:translate-y-0 transition-transform duration-300 text-sm">
                  Potvrdit
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PŘIHLÁŠENÍ / REGISTRACE / ZAPOMENUTÉ HESLO MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 pointer-events-auto">
            {!isForgotPasswordMode ? (
              <div className="flex border-b border-gray-100">
                <button onClick={() => setIsLoginMode(true)} className={`flex-1 py-4 text-sm font-bold transition-colors ${isLoginMode ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-400 hover:text-slate-600'}`}>Přihlášení</button>
                <button onClick={() => setIsLoginMode(false)} className={`flex-1 py-4 text-sm font-bold transition-colors ${!isLoginMode ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-400 hover:text-slate-600'}`}>Registrace</button>
              </div>
            ) : (
              <div className="p-6 sm:p-8 pb-0">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Obnova hesla</h3>
                <p className="text-xs sm:text-sm text-slate-500">Zadejte svůj e-mail a my vám zašleme odkaz pro resetování hesla.</p>
              </div>
            )}
            
            <form onSubmit={handleAuthSubmit} className="p-6 sm:p-8 space-y-5">
              {!isLoginMode && !isForgotPasswordMode && (<div className="bg-slate-50 p-3 rounded-lg border border-gray-100 mb-4"><p className="text-xs text-slate-500 text-center">Registrací získáte možnost rychlejší rezervace a přehled o svých termínech a fakturách.</p></div>)}
              
              {resetEmailSent && isForgotPasswordMode ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-medium text-center">
                  Odkaz byl odeslán na váš e-mail. Zkontrolujte prosím i složku Spam.
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">E-mail</label>
                    <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" placeholder="vas@email.cz" />
                  </div>

                  {!isForgotPasswordMode && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Heslo</label>
                      <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" placeholder="Minimálně 6 znaků" minLength={6} />
                      {isLoginMode && (
                        <div className="text-right mt-2">
                          <button type="button" onClick={() => setIsForgotPasswordMode(true)} className="text-[10px] sm:text-xs text-slate-400 hover:text-red-600 transition-colors font-medium">Zapomněli jste heslo?</button>
                        </div>
                      )}
                    </div>
                  )}

                  {!isLoginMode && !isForgotPasswordMode && (
                    <div className="flex items-start gap-2 pt-1 mb-2">
                      <input type="checkbox" id="authGdpr" required checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded cursor-none" />
                      <label htmlFor="authGdpr" className="text-[10px] sm:text-xs text-slate-500 leading-snug cursor-none">
                        Souhlasím se <span onClick={(e) => { e.preventDefault(); setShowGdprModal(true); }} className="text-red-600 hover:underline font-semibold cursor-none pointer-events-auto">zpracováním osobních údajů</span> a s <span onClick={(e) => { e.preventDefault(); setShowVopModal(true); }} className="text-red-600 hover:underline font-semibold cursor-none pointer-events-auto">Obchodními a storno podmínkami</span>. *
                      </label>
                    </div>
                  )}
                </>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {isForgotPasswordMode ? (
                  <>
                    {!resetEmailSent && <button type="submit" disabled={authLoading} className="w-full sm:flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 order-1 sm:order-2">{authLoading ? 'Odesílám...' : 'Odeslat odkaz'}</button>}
                    <button type="button" onClick={() => { setIsForgotPasswordMode(false); setResetEmailSent(false); }} className={`w-full ${!resetEmailSent ? 'sm:flex-1' : ''} px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors order-2 sm:order-1`}>Zpět na přihlášení</button>
                  </>
                ) : (
                  <>
                    <button type="submit" disabled={authLoading} className="w-full sm:flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50 order-1 sm:order-2">{authLoading ? 'Načítám...' : (isLoginMode ? 'Přihlásit se' : 'Vytvořit účet')}</button>
                    <button type="button" onClick={() => setShowAuthModal(false)} className="w-full sm:flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors order-2 sm:order-1">Zrušit</button>
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
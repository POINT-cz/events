export default function GlobalModals({
  showCookieBanner, handleAcceptCookies, showGdprModal, setShowGdprModal,
  showVopModal, setShowVopModal, isSubmitting, selectedTicket, setSelectedTicket,
  ticketQr, formatDateCzech
}) {
  return (
    <>
      {/* COOKIE BANNER */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#f4f4f4] text-black p-4 sm:p-6 z-[300] flex flex-col sm:flex-row justify-between items-center gap-4 border-t-2 border-black pointer-events-auto">
          <div className="text-xs sm:text-sm font-mono max-w-4xl text-center sm:text-left">
            Tento web používá pouze nezbytné technické soubory cookies, které jsou nutné pro správné fungování systému a udržení vašeho přihlášení. <span className="underline font-bold cursor-pointer hover:text-[#E4664F] transition-colors" onClick={() => setShowGdprModal(true)}>Více informací zde.</span>
          </div>
          <button onClick={handleAcceptCookies} className="shrink-0 bg-black text-white px-6 py-2.5 font-bold uppercase tracking-wider hover:bg-[#E4664F] transition-colors text-xs w-full sm:w-auto border-2 border-black">Rozumím</button>
        </div>
      )}

      {/* GDPR MODAL */}
      {showGdprModal && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto" onClick={() => setShowGdprModal(false)}>
          <div className="bg-[#f4f4f4] border-2 border-black p-6 sm:p-8 rounded-none w-full max-w-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[85vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-xl sm:text-2xl mb-4 text-black uppercase tracking-tight">Zásady zpracování osobních údajů (GDPR)</h3>
            <div className="text-xs sm:text-sm font-mono text-black/80 space-y-4">
              <p><strong>1. Správce osobních údajů</strong><br/>Správcem vašich osobních údajů je společnost BREAKING POINT s.r.o., IČ: 14290553, DIČ: CZ14290553, se sídlem Mrštíkovo nám. 6/14, 779 00 Olomouc. Osobní údaje zpracováváme v souladu s platnou legislativou.</p>
              <p><strong>2. Jaké údaje zpracováváme a proč</strong><br/>Zpracováváme vaše jméno, příjmení, e-mailovou adresu, telefonní číslo a případné fakturační údaje (IČO, DIČ, adresa). Tyto údaje potřebujeme k úspěšnému vytvoření a správě vaší rezervace, doručení elektronické vstupenky a komunikaci ohledně vašeho termínu.</p>
              <p><strong>3. Doba uchování</strong><br/>Osobní údaje uchováváme po dobu trvání vaší registrace v našem systému nebo po dobu nezbytnou k plnění zákonných povinností (např. účetní doklady pro fakturaci musíme uchovávat 10 let).</p>
              <p><strong>4. Předávání třetím stranám</strong><br/>Vaše údaje neprodáváme. Přístup k nim mají pouze prověření poskytovatelé, kteří pro nás zajišťují nezbytné technické služby (např. rozesílání e-mailů s potvrzením rezervace a cloudová databáze), vždy za dodržení přísných bezpečnostních standardů.</p>
              <p><strong>5. Vaše práva</strong><br/>Máte právo požadovat přístup ke svým osobním údajům, jejich opravu nebo výmaz. Stejně tak máte právo odvolat souhlas se zpracováním, vznést námitku nebo požádat o přenositelnost údajů. Své požadavky můžete zaslat na e-mail: hello@pointspace.cz.</p>
            </div>
            <div className="mt-8 pt-4 border-t-2 border-black flex justify-end">
              <button onClick={() => setShowGdprModal(false)} className="px-6 py-3 bg-black text-white rounded-none text-xs font-bold uppercase tracking-wider hover:bg-[#E4664F] transition-colors cursor-pointer border-2 border-black">Rozumím a zavřít</button>
            </div>
          </div>
        </div>
      )}

      {/* VOP A STORNO MODAL */}
      {showVopModal && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto" onClick={() => setShowVopModal(false)}>
          <div className="bg-[#f4f4f4] border-2 border-black p-6 sm:p-8 rounded-none w-full max-w-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[85vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-xl sm:text-2xl mb-4 text-black uppercase tracking-tight">Všeobecné obchodní a Storno podmínky</h3>
            <div className="text-xs sm:text-sm font-mono text-black/80 space-y-4">
              <p><strong>1. Úvodní ustanovení</strong><br/>Tyto Všeobecné obchodní podmínky (dále jen "VOP") upravují práva a povinnosti mezi společností BREAKING POINT s.r.o., IČ: 14290553 (dále jen "Provozovatel") a zákazníkem při využívání systému a nákupu vstupenek.</p>
              <p><strong>2. Rezervace a Platební podmínky</strong><br/>Rezervace/nákup vstupenky na akci se stává závaznou až po úplném uhrazení sjednané částky. Platba probíhá bankovním převodem (pomocí zaslaného QR kódu). Dokud není platba připsána na účet provozovatele, místo není garantováno.</p>
              <p><strong>3. Storno podmínky a vracení peněz</strong><br/>Klient má právo zrušit svou účast podle následujících pravidel:<br/>
              • Při zrušení <strong>více než 48 hodin před</strong> začátkem akce vracíme <strong>100 % částky</strong> zpět na účet.<br/>
              • Při zrušení <strong>méně než 48 hodin před</strong> začátkem akce zaplacená <strong>částka propadá v plné výši</strong> bez nároku na náhradu či vrácení.</p>
              <p><strong>4. Užívání prostor a odpovědnost</strong><br/>Zákazník se zavazuje užívat prostory ohleduplně a k účelům, ke kterým jsou určeny. Za případné škody na vybavení či majetku způsobené zákazníkem nese plnou odpovědnost zákazník a zavazuje se je v plné výši uhradit.</p>
            </div>
            <div className="mt-8 pt-4 border-t-2 border-black flex justify-end">
              <button onClick={() => setShowVopModal(false)} className="px-6 py-3 bg-black text-white rounded-none text-xs font-bold uppercase tracking-wider hover:bg-[#E4664F] transition-colors cursor-pointer border-2 border-black">Rozumím a zavřít</button>
            </div>
          </div>
        </div>
      )}

      {/* KLIENTSKÝ TICKET (QR) MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto" onClick={() => setSelectedTicket(null)}>
            <div className="bg-[#f4f4f4] border-2 border-black p-6 sm:p-8 rounded-none max-w-sm w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#E4664F] mb-1">Elektronická Vstupenka</div>
                <h3 className="font-bold text-xl mb-1 text-black uppercase">{selectedTicket.notes?.replace('Vstupenka na: ', '')}</h3>
                <p className="text-sm font-mono font-medium text-black/60 mb-6 sm:mb-8">{formatDateCzech(selectedTicket.date)}</p>
                
                <div className="bg-white p-4 border-2 border-black mb-6">
                  {ticketQr ? <img src={ticketQr} alt="QR Ticket" className="mx-auto w-48 h-48 sm:w-64 sm:h-64 mix-blend-multiply" /> : <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-200 animate-pulse mx-auto border-2 border-black" />}
                </div>
                
                <p className="text-[10px] text-black font-mono break-all bg-white p-2 border-2 border-black mb-2">ID: {selectedTicket.id}</p>
                <button onClick={() => setSelectedTicket(null)} className="mt-6 w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest transition-colors hover:bg-[#E4664F] cursor-pointer border-2 border-black">Zavřít</button>
            </div>
        </div>
      )}

      {/* ZPRACOVÁNÍ NÁKUPU */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-4">
           <div className="bg-[#f4f4f4] border-2 border-black p-10 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center max-w-sm w-full animate-in zoom-in-95">
              <div className="grow-dot mb-8"></div>
              <h3 className="font-bold text-lg text-black uppercase mb-1">Zpracovávám požadavek</h3>
              <p className="text-xs font-mono font-medium text-black/60 text-center">Ukládám do databáze...</p>
           </div>
        </div>
      )}
    </>
  );
}
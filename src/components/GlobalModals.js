'use client';

export default function GlobalModals({
  showCookieBanner,
  handleAcceptCookies,
  showGdprModal,
  setShowGdprModal,
  showVopModal,
  setShowVopModal
}) {
  return (
    <>
      {/* COOKIE BANNER */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 sm:p-6 z-[300] flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800 pointer-events-auto">
          <div className="text-xs sm:text-sm text-slate-300 max-w-4xl text-center sm:text-left">
            Tento web používá pouze nezbytné technické soubory cookies, které jsou nutné pro správné fungování rezervačního systému a udržení vašeho přihlášení. <span className="text-white font-semibold cursor-none" onClick={() => setShowGdprModal(true)}>Více informací zde.</span>
          </div>
          <button onClick={handleAcceptCookies} className="shrink-0 bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm w-full sm:w-auto">Rozumím</button>
        </div>
      )}

      {/* GDPR MODAL */}
      {showGdprModal && (
        <div className="fixed inset-0 z-[250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto" onClick={() => setShowGdprModal(false)}>
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-2xl shadow-xl overflow-y-auto max-h-[85vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-xl sm:text-2xl mb-4 text-slate-900">Zásady zpracování osobních údajů (GDPR)</h3>
            <div className="text-xs sm:text-sm text-slate-600 space-y-4">
              <p><strong>1. Správce osobních údajů</strong><br/>Správcem vašich osobních údajů je společnost BREAKING POINT s.r.o., IČ: 14290553, DIČ: CZ14290553, se sídlem Mrštíkovo nám. 6/14, 779 00 Olomouc. Osobní údaje zpracováváme v souladu s platnou legislativou.</p>
              <p><strong>2. Jaké údaje zpracováváme a proč</strong><br/>Zpracováváme vaše jméno, příjmení, e-mailovou adresu, telefonní číslo a případné fakturační údaje (IČO, DIČ, adresa). Tyto údaje potřebujeme k úspěšnému vytvoření a správě vaší rezervace, doručení elektronické vstupenky a komunikaci ohledně vašeho termínu.</p>
              <p><strong>3. Doba uchování</strong><br/>Osobní údaje uchováváme po dobu trvání vaší registrace v našem systému nebo po dobu nezbytnou k plnění zákonných povinností (např. účetní doklady pro fakturaci musíme uchovávat 10 let).</p>
              <p><strong>4. Předávání třetím stranám</strong><br/>Vaše údaje neprodáváme. Přístup k nim mají pouze prověření poskytovatelé, kteří pro nás zajišťují nezbytné technické služby (např. rozesílání e-mailů s potvrzením rezervace a cloudová databáze), vždy za dodržení přísných bezpečnostních standardů.</p>
              <p><strong>5. Vaše práva</strong><br/>Máte právo požadovat přístup ke svým osobním údajům, jejich opravu nebo výmaz. Stejně tak máte právo odvolat souhlas se zpracováním, vznést námitku nebo požádat o přenositelnost údajů. Své požadavky můžete zaslat na e-mail: hello@pointspace.cz.</p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowGdprModal(false)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors cursor-none">Rozumím a zavřít</button>
            </div>
          </div>
        </div>
      )}

      {/* VOP A STORNO MODAL */}
      {showVopModal && (
        <div className="fixed inset-0 z-[250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto" onClick={() => setShowVopModal(false)}>
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-2xl shadow-xl overflow-y-auto max-h-[85vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-xl sm:text-2xl mb-4 text-slate-900">Všeobecné obchodní a Storno podmínky</h3>
            <div className="text-xs sm:text-sm text-slate-600 space-y-4">
              <p><strong>1. Úvodní ustanovení</strong><br/>Tyto Všeobecné obchodní podmínky (dále jen "VOP") upravují práva a povinnosti mezi společností BREAKING POINT s.r.o., IČ: 14290553 (dále jen "Provozovatel") a zákazníkem při využívání rezervačního systému a prostor Pointu.</p>
              <p><strong>2. Rezervace a Platební podmínky</strong><br/>Rezervace prostor nebo vstupenky na akci se stává závaznou až po úplném uhrazení sjednané částky. Platba probíhá bankovním převodem (pomocí zaslaného QR kódu). Dokud není platba připsána na účet provozovatele, termín může být nabídnut jinému zájemci.</p>
              <p><strong>3. Storno podmínky a vracení peněz</strong><br/>Klient má právo zrušit svou rezervaci podle následujících pravidel:<br/>
              • Při zrušení <strong>více než 48 hodin před</strong> začátkem rezervace/akce vracíme <strong>100 % částky</strong> zpět na účet.<br/>
              • Při zrušení <strong>méně než 48 hodin před</strong> začátkem rezervace/akce zaplacená <strong>částka propadá v plné výši</strong> bez nároku na náhradu či vrácení.</p>
              <p><strong>4. Užívání prostor a odpovědnost</strong><br/>Zákazník se zavazuje užívat pronajaté prostory ohleduplně a k účelům, ke kterým jsou určeny. Za případné škody na vybavení či majetku způsobené zákazníkem nebo osobami, kterým umožnil vstup, nese plnou odpovědnost zákazník a zavazuje se je v plné výši uhradit.</p>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowVopModal(false)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors cursor-none">Rozumím a zavřít</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
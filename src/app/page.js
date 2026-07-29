'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { supabase } from '@/supabase';

// Sem si naimportuj své sdílené komponenty
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModals from '@/components/AuthModals';
import GlobalModals from '@/components/GlobalModals';

export default function EventsPortal() {
  // HLAVNÍ NAVIGACE
  const [view, setView] = useState('events_portal'); 

  // AUTENTIZACE A UŽIVATEL
  const [user, setUser] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [newRecoveryPassword, setNewRecoveryPassword] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // PROFIL A OBLÍBENÉ
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', company: '', ico: '', dic: '', billingAddress: '' });
  const [oldPassword, setOldPassword] = useState('');
  const [newProfilePassword, setNewProfilePassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  // PRÁVNÍ VĚCI & GLOBÁLNÍ MODALY
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showGdprModal, setShowGdprModal] = useState(false);
  const [showVopModal, setShowVopModal] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  // EVENTY STAVY
  const [dbEvents, setDbEvents] = useState([]);
  const [reservations, setResourcesReservations] = useState([]); // Pouze pro výpočet obsazenosti a sekci "Moje vstupenky"
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // VSTUPENKY STAVY (Zobrazování klientovi)
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketQr, setTicketQr] = useState('');

  // FORMULÁŘ A NÁKUPNÍ PROCES
  const [bookingStep, setBookingStep] = useState(1);
  const [lastCreatedRes, setLastCreatedRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [aresLoading, setAresLoading] = useState(false);
  const [honeypot, setHoneypot] = useState(''); 
  const cursorRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '', ico: '', dic: '', street: '', city: '', psc: '', paymentType: 'qr_code'
  });

  const formatDateCzech = (isoDate) => {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      return `${parseInt(parts[2], 10)}. ${parseInt(parts[1], 10)}. ${parts[0]}`;
    }
    return isoDate;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) { cursorRef.current.style.left = `${e.clientX}px`; cursorRef.current.style.top = `${e.clientY}px`; }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('point_cookie_consent');
    if (!consent) setShowCookieBanner(true);
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('point_cookie_consent', 'true');
    setShowCookieBanner(false);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowRecoveryModal(true);
        setShowAuthModal(false);
      }
      setUser(session?.user ?? null);
    });

    async function loadInitialData() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Načtení pouze těch rezervací, které mají event_id (potřebné pro kapacitu a moje vstupenky)
      const { data: bookingData } = await supabase.from('reservations')
        .select(`*, customers (first_name, last_name, email, company_name, ico)`)
        .not('event_id', 'is', null);
      if (bookingData) setResourcesReservations(bookingData);

      const { data: eventsData, error: eventsError } = await supabase.from('events').select('*').order('date', { ascending: true });
      
      const dummyEvents = [
        { id: 'dummy-1', title: 'Masterclass: Světlo v portrétu', date: '2026-08-15', time: '15:00 - 19:00', price: 2500, capacity: 12, requires_checkin: true, description: 'Naučte se pracovat s přirozeným i umělým světlem.', image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop' },
      ];

      if (!eventsError && eventsData) {
        setDbEvents(eventsData.length > 0 ? eventsData : dummyEvents);
        const params = new URLSearchParams(window.location.search);
        const urlEventId = params.get('event');
        if (urlEventId) {
          const targetEvent = (eventsData.length > 0 ? eventsData : dummyEvents).find(e => e.id === urlEventId);
          if (targetEvent) { setView('events_portal'); setSelectedEvent(targetEvent); setBookingStep(2); }
        }
      }
      setLoading(false);
    }
    loadInitialData();

    return () => { authListener.subscription.unsubscribe(); };
  }, []); 

  useEffect(() => {
    async function loadUserData() {
      if (user) {
        const { data: customerData } = await supabase.from('customers').select('*').eq('email', user.email).single();
        if (customerData) {
          setClientData(customerData);
          setFavoriteEvents(customerData.favorite_events || []);
          setFormData(prev => ({ ...prev, firstName: customerData.first_name || '', lastName: customerData.last_name || '', email: customerData.email || user.email, phone: customerData.phone || '', company: customerData.company_name || '', ico: customerData.ico || '', dic: customerData.dic || '', street: customerData.billing_address || '' }));
          setProfileForm({ firstName: customerData.first_name || '', lastName: customerData.last_name || '', phone: customerData.phone || '', company: customerData.company_name || '', ico: customerData.ico || '', dic: customerData.dic || '', billingAddress: customerData.billing_address || '' });
        } else { setFormData(prev => ({ ...prev, email: user.email })); }
      } else {
        setClientData(null);
        setFavoriteEvents([]);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', ico: '', dic: '', street: '', city: '', psc: '', paymentType: 'qr_code' });
      }
    }
    loadUserData();
  }, [user]);

  const handleShowTicket = async (res) => {
    setSelectedTicket(res);
    try {
      const url = await QRCode.toDataURL(res.id, { width: 300, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
      setTicketQr(url);
    } catch (err) { console.error(err); }
  };

  const toggleFavorite = async (e, eventId) => {
    e.stopPropagation();
    if (!user) {
      alert('Pro přidání do oblíbených se prosím přihlaste.');
      setIsLoginMode(true);
      setShowAuthModal(true);
      return;
    }
    let newFavs = [...favoriteEvents];
    if (newFavs.includes(eventId)) newFavs = newFavs.filter(id => id !== eventId);
    else newFavs.push(eventId);
    setFavoriteEvents(newFavs);

    if (clientData) {
      const { error } = await supabase.from('customers').update({ favorite_events: newFavs }).eq('id', clientData.id);
      if (error) console.error(error);
      else setClientData({ ...clientData, favorite_events: newFavs });
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    if (isForgotPasswordMode) {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail, { redirectTo: window.location.origin });
      if (error) alert(error.message);
      else setResetEmailSent(true);
      setAuthLoading(false);
      return;
    }

    if (!isLoginMode && !gdprConsent) {
       alert("Prosím odsouhlaste podmínky pro vytvoření účtu.");
       setAuthLoading(false);
       return;
    }

    if (isLoginMode) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) alert('Nesprávný e-mail nebo heslo.'); 
      else { setUser(data.user); setShowAuthModal(false); setAuthEmail(''); setAuthPassword(''); }
    } else {
      const { data, error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      if (error) alert(error.message); 
      else { setUser(data.user); alert('Účet vytvořen.'); setShowAuthModal(false); setAuthEmail(''); setAuthPassword(''); }
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    setUser(null);
    setShowUserMenu(false); 
    setView('events_portal'); 
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newRecoveryPassword });
    if (error) alert('Nepodařilo se změnit heslo: ' + error.message);
    else { alert('Heslo bylo úspěšně změněno.'); setShowRecoveryModal(false); setNewRecoveryPassword(''); }
    setAuthLoading(false);
  };

  const handleProfilePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newProfilePassword) return alert('Zadejte prosím původní i nové heslo.');
    if (newProfilePassword.length < 6) return alert('Nové heslo musí mít alespoň 6 znaků.');
    setSavingProfile(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword });
      if (signInError) { setSavingProfile(false); return alert('Původní heslo není správné.'); }

      const { error: updateError } = await supabase.auth.updateUser({ password: newProfilePassword });
      setSavingProfile(false);
      if (updateError) alert('Chyba při změně hesla: ' + updateError.message);
      else { alert('Heslo bylo úspěšně změněno.'); setOldPassword(''); setNewProfilePassword(''); }
    } catch (err) { setSavingProfile(false); alert('Chyba: ' + err.message); }
  };

  const getEventOccupancy = (eventId) => {
    return reservations.filter(r => r.event_id === eventId && r.status !== 'cancelled').length;
  };

  const calculateIban = (accountStr, bankCode) => {
    const parts = accountStr.split('-');
    let prefix = parts.length > 1 ? parts[0] : ''; let base = parts.length > 1 ? parts[1] : parts[0];
    prefix = prefix.replace(/\D/g, '').padStart(6, '0'); base = base.replace(/\D/g, '').padStart(10, '0');
    const cleanBank = bankCode.replace(/\D/g, '').padStart(4, '0');
    const digitString = `${cleanBank}${prefix}${base}123500`;
    const remainder = BigInt(digitString) % 97n;
    return `CZ${(98n - remainder).toString().padStart(2, '0')}${cleanBank}${prefix}${base}`;
  };

  const generateQrPayment = async (amount, vs) => {
    try { const iban = calculateIban("1234567890", "3030"); const qrString = `SPD*1.0*ACC:${iban}*AM:${amount}.00*CC:CZK*X-VS:${vs}*MSG:POINT`;
      const url = await QRCode.toDataURL(qrString, { width: 220, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } }); setQrCodeUrl(url);
    } catch (err) { console.error(err); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    const { data, error } = await supabase.from('customers').upsert({
      auth_id: user.id, email: user.email,
      first_name: profileForm.firstName, last_name: profileForm.lastName, phone: profileForm.phone,
      company_name: profileForm.company, ico: profileForm.ico, dic: profileForm.dic, billing_address: profileForm.billingAddress
    }, { onConflict: 'email' }).select().single();
    setSavingProfile(false);
    if (error) alert('Chyba při ukládání: ' + error.message);
    else { alert('Vaše údaje byly úspěšně uloženy.'); setClientData(data); }
  };

  const loadFromAres = async () => {
    if (!formData.ico && view !== 'client_profile') return alert('Zadejte prosím nejprve IČO firmy.');
    if (!profileForm.ico && view === 'client_profile') return alert('Zadejte prosím nejprve IČO firmy.');
    setAresLoading(true);
    const targetIco = view === 'client_profile' ? profileForm.ico : formData.ico;
    const cleanIco = targetIco.replace(/\s/g, '');
    try {
      const response = await fetch(`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${cleanIco}`);
      if (!response.ok) throw new Error('Subjekt nenalezen.');
      const data = await response.json();
      const adresa = data.sidlo || {};
      const ulice = adresa.nazevUlice || adresa.nazevObce || '';
      const cp = adresa.cisloPopisne || '';
      const co = adresa.cisloOrientacni ? `/${adresa.cisloOrientacni}` : '';
      const parsedAddress = `${ulice} ${cp}${co}, ${adresa.psc || ''} ${adresa.nazevObce || ''}`.trim();
      
      if(view === 'client_profile') { setProfileForm(prev => ({...prev, company: data.obchodniJmeno || '', dic: data.dic || '', billingAddress: parsedAddress })); } 
      else { setFormData(prev => ({ ...prev, company: data.obchodniJmeno || '', dic: data.dic || '', street: `${ulice} ${cp}${co}`.trim(), city: adresa.nazevObce || '', psc: adresa.psc || '' })); }
    } catch (err) { alert('Chyba při komunikaci s registrem ARES.'); } 
    finally { setAresLoading(false); }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) { console.warn("Detekován automatizovaný přístup."); return; }
    if (!gdprConsent) { alert("Pro pokračování je nutné souhlasit se zpracováním osobních údajů a obchodními podmínkami."); return; }

    setIsSubmitting(true);
    const fullBillingAddress = `${formData.street}, ${formData.psc} ${formData.city}`.trim();
    
    const { data: customerData, error: custError } = await supabase
      .from('customers').upsert({
        first_name: formData.firstName, last_name: formData.lastName, email: formData.email, phone: formData.phone,
        company_name: formData.company, ico: formData.ico, dic: formData.dic, billing_address: fullBillingAddress, auth_id: user ? user.id : null 
      }, { onConflict: 'email' }).select().single();
    if (custError) { alert(custError.message); setIsSubmitting(false); return; }

    const vs = Math.floor(100000 + Math.random() * 900000).toString();
    const finalPrice = selectedEvent.price;
    
    let insertData = { 
       customer_id: customerData.id, status: 'pending_payment', 
       payment_type: formData.paymentType, variable_symbol: vs, total_price: finalPrice,
       event_id: selectedEvent.id, date: selectedEvent.date, notes: `Vstupenka na: ${selectedEvent.title}`, 
       start_hour: 0, end_hour: 0, db_end_hour: 0
    };

    const { data: newBooking, error: bookError } = await supabase.from('reservations').insert(insertData).select(`*, customers (first_name, last_name, email, company_name, ico)`).single();
    if (bookError) { alert(bookError.message); setIsSubmitting(false); return; }
    
    await generateQrPayment(finalPrice, vs);

    try {
      const iban = calculateIban("1234567890", "3030"); // TADY PŘEPIŠ NA SVÉ ČÍSLO ÚČTU
      const spaydString = `SPD*1.0*ACC:${iban}*AM:${finalPrice}.00*CC:CZK*X-VS:${vs}*MSG:POINT`;
      const qrPaymentUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(spaydString)}&margin=10`;
      const qrTicketUrl = selectedEvent.requires_checkin ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${newBooking.id}&margin=10` : null;

      await supabase.functions.invoke('send-email', {
        body: {
          type: 'potvrzeni', to: formData.email, jmeno: formData.firstName,
          sluzba: selectedEvent.title, datum: formatDateCzech(insertData.date),
          cas: selectedEvent.time, cena: finalPrice, qrPaymentUrl: qrPaymentUrl, qrTicketUrl: qrTicketUrl
        }
      });
    } catch (emailErr) {
      console.error('E-mail se nepodařilo odeslat:', emailErr);
    }

    setResourcesReservations([...reservations, newBooking]);
    setLastCreatedRes({ ...newBooking, email: formData.email });
    setIsSubmitting(false); 
    setBookingStep(3);
  };

  const globalAnimationCss = `
    * { cursor: none !important; }
    @keyframes growDot { 0% { transform: scale(0); opacity: 0.2; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(0); opacity: 0.2; } }
    .grow-dot { width: 50px; height: 50px; background-color: #ef4444; border-radius: 50%; animation: growDot 1.5s ease-in-out infinite; }
    @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
    .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <style dangerouslySetInnerHTML={{__html: globalAnimationCss}} />
      <div className="grow-dot mb-8"></div>
      <div className="text-sm font-bold text-slate-800 animate-pulse">Načítám Events Systém...</div>
    </div>
  );

  const myReservations = reservations.filter(r => r.customers?.email === user?.email).sort((a, b) => new Date(b.date) - new Date(a.date));
  const displayName = clientData?.first_name ? clientData.first_name : user?.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col cursor-none selection:bg-red-100 selection:text-red-900 relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: globalAnimationCss}} />
      <div ref={cursorRef} className="fixed w-3 h-3 bg-red-500 rounded-full pointer-events-none z-[9999] hidden md:block" style={{ transform: 'translate(-50%, -50%)', left: '-100px', top: '-100px' }} />

      {/* ========================================================= */}
      {/* EXTERNÍ KOMPONENTY PRO HEADER, MODALY A FOOTER            */}
      {/* ========================================================= */}
      <GlobalModals 
        showCookieBanner={showCookieBanner} handleAcceptCookies={handleAcceptCookies} 
        showGdprModal={showGdprModal} setShowGdprModal={setShowGdprModal} 
        showVopModal={showVopModal} setShowVopModal={setShowVopModal} 
        isSubmitting={isSubmitting} selectedTicket={selectedTicket} 
        setSelectedTicket={setSelectedTicket} ticketQr={ticketQr} formatDateCzech={formatDateCzech} 
      />

      <AuthModals 
        showRecoveryModal={showRecoveryModal} handleRecoverySubmit={handleRecoverySubmit} 
        newRecoveryPassword={newRecoveryPassword} setNewRecoveryPassword={setNewRecoveryPassword} 
        authLoading={authLoading} showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal}
        isForgotPasswordMode={isForgotPasswordMode} setIsForgotPasswordMode={setIsForgotPasswordMode}
        isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode} resetEmailSent={setResetEmailSent} 
        authEmail={authEmail} setAuthEmail={setAuthEmail} authPassword={authPassword} setAuthPassword={setAuthPassword} 
        gdprConsent={gdprConsent} setGdprConsent={setGdprConsent} handleAuthSubmit={handleAuthSubmit} 
      />

      {/* Předpoklad: Header obsahuje tlačítko "Zpět na rezervace prostor" href="https://rezervace.pointspace.cz" */}
      <Header 
        user={user} displayName={displayName} view={view} setView={setView} 
        showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} handleLogout={handleLogout} 
        setIsLoginMode={setIsLoginMode} setIsForgotPasswordMode={setIsForgotPasswordMode} 
        setResetEmailSent={setResetEmailSent} setShowAuthModal={setShowAuthModal} setGdprConsent={setGdprConsent} 
        setBookingStep={setBookingStep} setSelectedEvent={setSelectedEvent}
      />

      <main className={`flex-1 ${view === 'events_portal' && selectedEvent ? 'p-0 w-full' : 'p-4 sm:p-8 max-w-6xl w-full mx-auto relative z-10'} flex flex-col mb-12`}>
        
        {/* ===================== KLIENT: OBLÍBENÉ AKCE ===================== */}
        {view === 'client_favorites' && (
          <div className="max-w-6xl mx-auto w-full animate-in fade-in space-y-8 pt-4 pb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-8 sm:mb-12">Moje oblíbené akce</h2>
            <div className="w-full">
              {dbEvents.filter(e => favoriteEvents.includes(e.id) && !e.is_hidden).length === 0 ? (
                  <div className="text-center p-8 sm:p-12 bg-white rounded-none border border-gray-100 text-slate-500">Zatím nemáte žádné oblíbené akce. Přidejte si je kliknutím na srdíčko v katalogu.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {dbEvents.filter(e => favoriteEvents.includes(e.id) && !e.is_hidden).map((event) => {
                    const isFav = true; 
                    return (
                      <div key={event.id} onClick={() => { setSelectedEvent(event); setIsDescExpanded(false); setView('events_portal'); }} className="bg-slate-900 rounded-none overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col group relative h-[320px] cursor-none border border-gray-200">
                         <button onClick={(e) => toggleFavorite(e, event.id)} className={`absolute top-4 left-4 z-40 p-2.5 rounded-full transition-all duration-300 pointer-events-auto flex items-center justify-center border ${isFav ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/30 scale-100' : 'bg-transparent border-white/60 text-white hover:border-white hover:scale-105'}`}>
                            <svg className={`w-5 h-5 transition-transform ${isFav ? 'animate-pop' : ''}`} fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                         </button>
                         <div className="absolute inset-0 z-0"><img src={event.image_url || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={event.title} /></div>
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                         <div className="absolute inset-0 flex flex-col justify-end p-6 z-20 overflow-hidden">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 transition-transform duration-500 group-hover:-translate-y-[110px] leading-tight drop-shadow-md">{event.title}</h3>
                            <div className="flex flex-col items-start gap-1 text-white/90 text-sm font-medium transition-opacity duration-300 group-hover:opacity-0 drop-shadow-md">
                              <span>📅 {formatDateCzech(event.date)}</span><span>⏰ {event.time}</span><span className="font-bold text-red-400 mt-1">💰 {event.price} Kč</span>
                            </div>
                         </div>
                         <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-30 pointer-events-none">
                            <p className="text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">{event.description || 'Přijďte se podívat na naši exkluzivní akci přímo v prostorech Pointu.'}</p>
                            <span className="inline-block border border-red-500 text-red-400 bg-slate-900/50 px-5 py-2 rounded-none text-xs font-bold uppercase backdrop-blur-sm">Detail akce</span>
                         </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== KLIENT: MOJE REZERVACE (Vstupenky) ===================== */}
        {view === 'client_dashboard' && (
          <div className="max-w-4xl mx-auto w-full animate-in fade-in space-y-6 sm:space-y-8 pt-4 pb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Moje vstupenky</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pointer-events-auto">
               {myReservations.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center text-slate-500">Zatím nemáte zakoupené žádné vstupenky.</div>
               ) : (
                  <div className="divide-y divide-gray-50">
                     {myReservations.map(res => {
                        const eventObj = dbEvents.find(e => e.id === res.event_id);
                        const needsTicket = eventObj && eventObj.requires_checkin;
                        return (
                          <div key={res.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition-colors gap-4 sm:gap-0">
                             <div className="flex-1 w-full">
                                <div className="flex items-center gap-3 mb-1">
                                   <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-700">Vstupenka</span>
                                   <span className="font-bold text-slate-900 text-sm sm:text-base">{formatDateCzech(res.date)}</span>
                                </div>
                                <div className="text-xs sm:text-sm text-slate-500">{res.notes}</div>
                             </div>
                             
                             <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                                <div className="text-left sm:text-right">
                                   <div className="font-bold text-slate-900">{res.total_price} Kč</div>
                                   <div className={`text-[11px] sm:text-xs font-semibold mt-1 ${res.status === 'paid' ? 'text-green-600' : res.status === 'cancelled' ? 'text-red-500' : 'text-amber-500'}`}>{res.status === 'paid' ? 'Zaplaceno' : res.status === 'cancelled' ? 'Zrušeno' : 'Čeká na schválení / platbu'}</div>
                                </div>
                                
                                {res.status === 'paid' && needsTicket && (
                                   <button onClick={() => handleShowTicket(res)} className="w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-slate-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                      <span className="text-base sm:text-lg">📷</span> Zobrazit vstupenku
                                   </button>
                                )}
                             </div>
                          </div>
                        )
                     })}
                  </div>
               )}
            </div>
          </div>
        )}

        {/* ===================== KLIENT: MŮJ PROFIL ===================== */}
        {view === 'client_profile' && (
          <div className="max-w-4xl mx-auto w-full animate-in fade-in space-y-6 sm:space-y-8 pt-4 pb-12 pointer-events-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Můj Profil</h2>
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
               
               <h3 className="text-lg sm:text-xl font-bold mb-6 text-slate-800">Osobní a fakturační údaje</h3>
               <form onSubmit={handleProfileSave} className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Jméno</label><input type="text" value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" /></div>
                   <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Příjmení</label><input type="text" value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" /></div>
                   <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Telefon</label><input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" /></div>
                 </div>
                 <div className="border-t border-gray-100 pt-6">
                   <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-4">
                     <div className="flex-1 w-full"><label className="block text-xs font-medium text-slate-500 mb-1.5">IČO pro načtení z ARES</label><input type="text" value={profileForm.ico} onChange={e => setProfileForm({...profileForm, ico: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" /></div>
                     <button type="button" onClick={loadFromAres} disabled={aresLoading} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-5 py-3.5 rounded-xl transition-all disabled:opacity-60">{aresLoading ? 'Načítám...' : 'Načíst ARES'}</button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div><label className="block text-xs font-medium text-slate-500 mb-1.5">Název firmy</label><input type="text" value={profileForm.company} onChange={e => setProfileForm({...profileForm, company: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" /></div>
                     <div><label className="block text-xs font-medium text-slate-500 mb-1.5">DIČ</label><input type="text" value={profileForm.dic} onChange={e => setProfileForm({...profileForm, dic: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" /></div>
                     <div className="sm:col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1.5">Fakturační adresa</label><input type="text" value={profileForm.billingAddress} onChange={e => setProfileForm({...profileForm, billingAddress: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none" /></div>
                   </div>
                 </div>
                 <div className="flex justify-end pt-4"><button type="submit" disabled={savingProfile} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-8 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-80">{savingProfile ? 'Ukládám...' : 'Uložit údaje'}</button></div>
               </form>

               {/* FORMULÁŘ PRO ZMĚNU HESLA */}
               <div className="mt-8 pt-8 border-t border-gray-100">
                 <h3 className="text-lg sm:text-xl font-bold mb-6 text-slate-800">Změna hesla</h3>
                 <form onSubmit={handleProfilePasswordChange} className="space-y-4">
                   <div className="max-w-sm">
                     <label className="block text-xs font-medium text-slate-500 mb-1.5">Původní heslo</label>
                     <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none mb-4" placeholder="Vaše aktuální heslo" />
                     <label className="block text-xs font-medium text-slate-500 mb-1.5">Nové heslo</label>
                     <input type="password" required value={newProfilePassword} onChange={(e) => setNewProfilePassword(e.target.value)} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 outline-none mb-4" placeholder="Minimálně 6 znaků" minLength={6} />
                     <button type="submit" disabled={savingProfile} className="group relative overflow-hidden bg-slate-900 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-80 w-full sm:w-auto h-12 px-8">
                       <span className="relative z-10 flex items-center justify-center h-full transition-transform duration-300 group-hover:-translate-y-12">
                         {savingProfile ? 'Ukládám...' : 'Změnit heslo'}
                       </span>
                       <span className="absolute inset-0 z-10 flex items-center justify-center translate-y-12 group-hover:translate-y-0 transition-transform duration-300 text-sm">
                         Potvrdit nové heslo
                       </span>
                     </button>
                   </div>
                 </form>
               </div>

            </div>
          </div>
        )}

        {/* ===================== KLIENT: PORTÁL EVENTŮ ===================== */}
        {view === 'events_portal' && (
           <div className={`flex-1 w-full animate-in fade-in slide-in-from-bottom-2 ${selectedEvent ? '' : 'space-y-8'}`}>
             
             {/* Krok 1: Výpis akcí a detail akce */}
             {bookingStep === 1 && !selectedEvent && (
               <div className="w-full px-4 sm:px-0">
                 <div className="flex flex-col items-center justify-center pt-4 pb-8 sm:pb-12 space-y-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Naše Akce</h2>
                    <p className="text-slate-500 text-sm max-w-lg px-4">Workshopy, přednášky a komunitní setkání přímo u nás v Pointu.</p>
                 </div>

                 {dbEvents.filter(e => !e.is_hidden).length === 0 ? (
                    <div className="text-center p-8 sm:p-12 bg-white rounded-none border border-gray-100 text-slate-500">Aktuálně nejsou vypsány žádné akce. Sledujte náš web pro novinky.</div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                     {dbEvents.filter(e => !e.is_hidden).map((event) => {
                       const occupied = getEventOccupancy(event.id);
                       const isFull = occupied >= event.capacity;
                       const isPast = new Date(event.date) < new Date(new Date().setHours(0,0,0,0));
                       const isFav = favoriteEvents.includes(event.id);
                       if (isPast) return null; 

                       return (
                         <div key={event.id} onClick={() => { setSelectedEvent(event); setIsDescExpanded(false); }} className="bg-slate-900 rounded-none overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col group relative h-[320px] cursor-none border border-gray-200">
                            <button onClick={(e) => toggleFavorite(e, event.id)} className={`absolute top-4 left-4 z-40 p-2.5 rounded-full transition-all duration-300 pointer-events-auto flex items-center justify-center border ${isFav ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/30 scale-100' : 'bg-transparent border-white/60 text-white hover:border-white hover:scale-105'}`}>
                               <svg className={`w-5 h-5 transition-transform ${isFav ? 'animate-pop' : ''}`} fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                               </svg>
                            </button>
                            <div className="absolute inset-0 z-0">
                               <img src={event.image_url || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={event.title} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                            
                            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 z-20 overflow-hidden">
                               <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 transition-transform duration-500 group-hover:-translate-y-[110px] leading-tight drop-shadow-md">{event.title}</h3>
                               <div className="flex flex-col items-start gap-1 text-white/90 text-sm font-medium transition-opacity duration-300 group-hover:opacity-0 drop-shadow-md">
                                 <span>📅 {formatDateCzech(event.date)}</span><span>⏰ {event.time}</span><span className="font-bold text-red-400 mt-1">💰 {event.price} Kč</span>
                               </div>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-30 pointer-events-none">
                               <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">{event.description || 'Přijďte se podívat na naši exkluzivní akci přímo v prostorech Pointu.'}</p>
                               <span className="inline-block border border-red-500 text-red-400 bg-slate-900/50 px-4 py-1.5 sm:px-5 sm:py-2 rounded-none text-[10px] sm:text-xs font-bold uppercase backdrop-blur-sm">Detail akce</span>
                            </div>
                         </div>
                       )
                     })}
                   </div>
                 )}
               </div>
             )}

             {bookingStep === 1 && selectedEvent && (
                <div className="w-full bg-white animate-in fade-in slide-in-from-bottom-4 relative">
                   <div className="h-64 sm:h-[450px] w-full bg-slate-900 relative rounded-none">
                      <img src={selectedEvent.image_url || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover opacity-60 rounded-none" alt={selectedEvent.title} />
                      <button onClick={() => setSelectedEvent(null)} className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-none text-xs sm:text-sm font-bold hover:bg-white/40 transition-colors z-20 cursor-none">‹ Zpět na přehled</button>
                      <div className="absolute bottom-0 left-0 p-6 sm:p-16 w-full bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent">
                         <h1 className="text-2xl sm:text-6xl font-bold text-white mb-2 sm:mb-3 leading-tight pr-8 sm:pr-12">{selectedEvent.title}</h1>
                         <div className="text-red-400 font-bold uppercase tracking-widest text-xs sm:text-sm">{formatDateCzech(selectedEvent.date)}</div>
                      </div>
                   </div>
                   
                   <div className="p-6 sm:p-12 flex flex-col md:flex-row gap-8 sm:gap-12 max-w-6xl mx-auto">
                      <div className="flex-1 min-w-0">
                         <div className="w-full overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wider text-sm">O co jde</h3>
                                <button onClick={(e) => toggleFavorite(e, selectedEvent.id)} className={`transition-all duration-300 pointer-events-auto cursor-pointer flex items-center justify-center ${favoriteEvents.includes(selectedEvent.id) ? 'text-red-500' : 'text-slate-300 hover:text-slate-400 hover:scale-110'}`}>
                                   <svg className={`w-6 h-6 sm:w-8 sm:h-8 transition-transform ${favoriteEvents.includes(selectedEvent.id) ? 'animate-pop fill-current drop-shadow-sm' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                   </svg>
                                </button>
                            </div>
                            <div className="relative">
                               <p className={`text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-wrap break-words transition-all duration-300 ${!isDescExpanded ? 'line-clamp-5' : ''}`}>{selectedEvent.description}</p>
                               <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="text-red-600 text-xs sm:text-sm font-bold mt-2 hover:underline pointer-events-auto cursor-pointer">{isDescExpanded ? 'Sbalit text' : 'Číst dále'}</button>
                            </div>
                         </div>
                      </div>
                      
                      <div className="w-full md:w-80 shrink-0 self-start">
                         <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200 shadow-xl md:sticky md:top-24">
                            <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Cena vstupenky</div>
                            <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 sm:mb-8">{selectedEvent.price} Kč</div>
                            <div className="mb-2 border-t border-gray-100 pt-6">
                              <ul className="space-y-4 text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8">
                                 <li className="flex items-center gap-3 sm:gap-4"><span className="text-base sm:text-lg">📅</span> <span className="font-medium text-slate-800">{formatDateCzech(selectedEvent.date)}</span></li>
                                 <li className="flex items-center gap-3 sm:gap-4"><span className="text-base sm:text-lg">⏰</span> <span className="font-medium text-slate-800">{selectedEvent.time}</span></li>
                              </ul>
                              {(() => {
                                const occupied = getEventOccupancy(selectedEvent.id);
                                const isFull = occupied >= selectedEvent.capacity;
                                return (
                                  <>
                                    <div className="flex items-center justify-between mb-2"><span className="text-[10px] sm:text-xs font-bold text-slate-500">Obsazenost</span><span className="text-[10px] sm:text-xs font-bold text-slate-900">{occupied} / {selectedEvent.capacity} míst</span></div>
                                    <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-none overflow-hidden"><div className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-slate-800'}`} style={{width: `${(occupied/selectedEvent.capacity)*100}%`}}></div></div>
                                    <button onClick={() => setBookingStep(2)} disabled={isFull} className={`w-full py-3 sm:py-4 mt-6 sm:mt-8 rounded-none text-xs sm:text-sm font-bold transition-all shadow-sm cursor-none ${isFull ? 'bg-slate-100 text-slate-400' : 'bg-red-600 hover:bg-red-700 text-white active:scale-95 hover:shadow-lg'}`}>{isFull ? 'Vyprodáno' : 'Sem chci jít'}</button>
                                  </>
                                )
                              })()}
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="w-full border-t border-gray-100 mt-4 pointer-events-auto">
                      <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-8 sm:pt-12 pb-4 sm:pb-6">
                         <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 uppercase tracking-wider text-sm">Kde to bude?</h3>
                         <p className="text-xs sm:text-base text-slate-600 font-medium">POINT - Mrštíkovo nám. 6/14, Olomouc</p>
                      </div>
                      <div className="w-full h-64 sm:h-[450px] bg-slate-100 relative">
                         <iframe src="https://maps.google.com/maps?q=Mr%C5%A1t%C3%ADkovo%20n%C3%A1m.%206/14,%20Olomouc&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0, filter: 'grayscale(100%) contrast(1.1) opacity(0.9)'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                      </div>
                   </div>
                </div>
             )}

             {/* KROK 2: Osobní údaje (Společný formulář) */}
             {bookingStep === 2 && (
               <form onSubmit={handleClientSubmit} className="max-w-2xl mx-auto w-full bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  
                  {/* Neviditelná past na roboty (Honeypot) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="bot-check">Leave this field blank</label>
                    <input type="text" id="bot-check" name="bot-check" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex="-1" autoComplete="off" />
                  </div>

                  {!user && (
                    <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                      <span className="text-xs sm:text-sm font-medium text-slate-600">Pro rychlejší rezervaci se můžete přihlásit.</span>
                      <button type="button" onClick={() => { setIsLoginMode(true); setShowAuthModal(true); }} className="w-full sm:w-auto text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-slate-300 transition-colors pointer-events-auto">Přihlásit se</button>
                    </div>
                  )}

                  {selectedEvent && (
                     <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 shadow-md border border-slate-800">
                        <div>
                          <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Vstupenka na akci</div>
                          <div className="font-bold text-base sm:text-lg">{selectedEvent.title}</div>
                          <div className="text-[10px] sm:text-xs mt-1 text-slate-300">{formatDateCzech(selectedEvent.date)} • {selectedEvent.time}</div>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-red-400">{selectedEvent.price} Kč</div>
                     </div>
                  )}

                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800 border-b border-gray-100 pb-2 sm:pb-3 mb-4 sm:mb-5">Kontaktní údaje</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Jméno *</label><input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                      <div><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Příjmení *</label><input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                      <div><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">E-mail *</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                      <div><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Telefon *</label><input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 border-b border-gray-100 pb-2 sm:pb-3 mb-4 sm:mb-5 flex items-center gap-2">Fakturační údaje <span className="text-[10px] sm:text-xs font-normal text-slate-400">(Volitelné)</span></h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                        <div className="flex-1 w-full"><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">IČO pro načtení z ARES</label><input type="text" placeholder="Zadejte IČO..." value={formData.ico} onChange={e => setFormData({...formData, ico: e.target.value})} className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                        <button type="button" onClick={loadFromAres} disabled={aresLoading} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-5 py-2.5 sm:py-3.5 rounded-xl transition-all disabled:opacity-60">{aresLoading ? 'Načítám...' : 'Načíst'}</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Název firmy</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                        <div><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">DIČ</label><input type="text" value={formData.dic} onChange={e => setFormData({...formData, dic: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 sm:gap-4">
                        <div className="sm:col-span-3"><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Ulice a č.p.</label><input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                        <div className="sm:col-span-2"><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">Město</label><input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                        <div className="sm:col-span-1"><label className="block text-[10px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">PSČ</label><input type="text" value={formData.psc} onChange={e => setFormData({...formData, psc: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:border-red-500 outline-none cursor-none transition-all" /></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                     <div className="flex items-start gap-2 mb-4">
                        <input type="checkbox" id="gdprConsent" required checked={gdprConsent} onChange={e => setGdprConsent(e.target.checked)} className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded cursor-none" />
                        <label htmlFor="gdprConsent" className="text-[10px] sm:text-xs text-slate-500 leading-snug cursor-none">
                           Souhlasím se <span onClick={(e) => { e.preventDefault(); setShowGdprModal(true); }} className="text-red-600 hover:underline font-semibold cursor-none pointer-events-auto">zpracováním osobních údajů</span> a s <span onClick={(e) => { e.preventDefault(); setShowVopModal(true); }} className="text-red-600 hover:underline font-semibold cursor-none pointer-events-auto">Obchodními a storno podmínkami</span>. *
                        </label>
                     </div>
                     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                       <button type="button" onClick={() => setBookingStep(1)} className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors order-2 sm:order-1">‹ Zpět na výběr</button>
                       <button type="submit" disabled={isSubmitting || !gdprConsent} className="w-full sm:w-auto text-white text-xs sm:text-sm font-semibold px-6 sm:px-8 py-3 sm:py-3.5 transition-all shadow-sm active:scale-95 disabled:opacity-80 order-1 sm:order-2 bg-red-600 hover:bg-red-700 rounded-none">
                         Závazně koupit vstupenku
                       </button>
                     </div>
                  </div>
               </form>
             )}

             {/* KROK 3: Shrnutí */}
             {bookingStep === 3 && lastCreatedRes && (
               <div className="max-w-md mx-auto w-full bg-white p-6 sm:p-8 rounded-2xl text-center space-y-4 sm:space-y-6 shadow-sm border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-lg sm:text-xl mb-2">✓</div>
                  <div><h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">Vstupenka rezervována</h3><p className="text-[10px] sm:text-xs font-medium text-slate-500">Variabilní symbol: {lastCreatedRes.variable_symbol}</p></div>
                  <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl inline-block border border-gray-100 w-full max-w-[280px]">
                    {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Platba" className="mx-auto w-32 h-32 sm:w-48 sm:h-48 rounded-lg mix-blend-multiply" /> : <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gray-200/50 rounded-lg animate-pulse mx-auto" />}
                    <div className="mt-4 sm:mt-5 text-center"><p className="text-xl sm:text-2xl font-bold text-slate-900">{lastCreatedRes.total_price} Kč</p><span className="text-[8px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Naskenujte v aplikaci</span></div>
                  </div>
                  <button onClick={() => { setBookingStep(1); setSelectedEvent(null); setLastCreatedRes(null); window.history.replaceState({}, document.title, "/"); }} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 sm:py-3.5 text-xs sm:text-sm transition-all shadow-sm rounded-none">Hotovo, vrátit se na začátek</button>
               </div>
             )}

           </div>
        )}

      </main>

      <Footer setShowGdprModal={setShowGdprModal} setShowVopModal={setShowVopModal} />
    </div>
  );
}
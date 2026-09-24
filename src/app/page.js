'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { supabase } from '@/supabase';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModals from '@/components/AuthModals';
import GlobalModals from '@/components/GlobalModals';

// Import nových komponent
import EventCard from '@/components/EventCard';
import EventDetail from '@/components/EventDetail';
import EventBookingForm from '@/components/EventBookingForm';
import EventTicketSuccess from '@/components/EventTicketSuccess';
import AdminEventsTable from '@/components/AdminEventsTable';

export default function EventsPortal() {
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

  // --- ZABEZPEČENÍ ADMINA ---
  const ADMIN_EMAIL = 'hello@pointspace.cz'; 
  const isAdmin = user && user.email === ADMIN_EMAIL;

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

  // EVENTY STAVY & FILTRACE
  const [dbEvents, setDbEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reservations, setResourcesReservations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  // BALÍČKY (VARIANTY) VÝBĚR
  const [selectedVariant, setSelectedVariant] = useState(null);

  // ADMIN EVENT MODAL STAVY
  const [showAdminEventModal, setShowAdminEventModal] = useState(false);
  const [adminEventForm, setAdminEventForm] = useState({ 
    id: null, 
    title: '', 
    date: '', 
    time: '17:00 - 20:00', 
    category: 'Workshop',
    description: '', 
    image_url: '', 
    requires_checkin: false, 
    is_hidden: false,
    variants: [{ id: '1', title: 'Základní vstupenka', description: 'Vstup na akci', price: 500, capacity: 20 }] 
  });

  // VSTUPENKY STAVY
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketQr, setTicketQr] = useState('');

  // FORMULÁŘ A NÁKUPNÍ PROCES & UNIVERZÁLNÍ LOADING
  const [bookingStep, setBookingStep] = useState(1);
  const [lastCreatedRes, setLastCreatedRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
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

  // --- RYCHLÉ NAČÍTÁNÍ DAT ---
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowRecoveryModal(true);
        setShowAuthModal(false);
      }
      setUser(session?.user ?? null);
    });

    async function loadInitialData() {
      try {
        setLoading(true);
        const [{ data: { session } }, { data: eventsData, error: eventsError }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.from('events').select('*').order('date', { ascending: true })
        ]);

        setUser(session?.user ?? null);

        const dummyEvents = [
          { 
            id: 'dummy-1', 
            title: 'Masterclass: Světlo v portrétu', 
            date: '2026-08-15', 
            time: '15:00 - 19:00', 
            category: 'Workshop',
            requires_checkin: true, 
            description: 'Naučte se pracovat s přirozeným i umělým světlem.', 
            image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop',
            variants: [
              { id: 'v1', title: 'Základní vstupenka', description: 'Vstup na přednášku', price: 1500, capacity: 10 },
              { id: 'v2', title: 'VIP + Mastermind', description: 'Přednáška + exkluzivní setkání', price: 2500, capacity: 5 }
            ]
          },
        ];

        if (!eventsError && eventsData) {
          const parsedEvents = eventsData.map(ev => ({
            ...ev,
            category: ev.category || 'Workshop',
            variants: ev.variants || [{ id: '1', title: 'Vstupenka', description: 'Standardní vstup', price: ev.price || 500, capacity: ev.capacity || 10 }]
          }));
          setDbEvents(parsedEvents.length > 0 ? parsedEvents : dummyEvents);
          
          const params = new URLSearchParams(window.location.search);
          const urlEventId = params.get('event');
          if (urlEventId) {
            const targetEvent = parsedEvents.find(e => e.id === urlEventId);
            if (targetEvent) { 
              setView('events_portal'); 
              setSelectedEvent(targetEvent); 
              setSelectedVariant(targetEvent.variants?.[0] || null);
              setBookingStep(2); 
            }
          }
        } else {
          setDbEvents(dummyEvents);
        }

        setLoading(false);

        supabase.from('reservations')
          .select(`*, customers (first_name, last_name, email, company_name, ico)`)
          .not('event_id', 'is', null)
          .then(({ data: bookingData }) => {
            if (bookingData) setResourcesReservations(bookingData);
          });

      } catch (err) {
        console.error("Kritická chyba při načítání dat:", err);
        setLoading(false);
      }
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
    if (newFavs.includes(eventId)) {
      newFavs = newFavs.filter(id => id !== eventId);
    } else {
      newFavs.push(eventId);
    }
    setFavoriteEvents(newFavs);

    const { data, error } = await supabase
      .from('customers')
      .update({ favorite_events: newFavs })
      .eq('email', user.email)
      .select()
      .single();
      
    if (error) {
      console.error('Chyba při ukládání oblíbených:', error.message);
    } else if (data) {
      setClientData(data);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    if (isForgotPasswordMode) {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail, { redirectTo: window.location.origin });
      if (error) alert(error.message);
      else setResetEmailSent(true);
      setActionLoading(false);
      return;
    }

    if (!isLoginMode && !gdprConsent) {
       alert("Prosím odsouhlaste podmínky pro vytvoření účtu.");
       setActionLoading(false);
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
    setActionLoading(false);
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    setUser(null);
    setShowUserMenu(false); 
    setView('events_portal'); 
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newRecoveryPassword });
    if (error) alert('Nepodařilo se změnit heslo: ' + error.message);
    else { alert('Heslo bylo úspěšně změněno.'); setShowRecoveryModal(false); setNewRecoveryPassword(''); }
    setActionLoading(false);
  };

  const handleProfilePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newProfilePassword) return alert('Zadejte prosím původní i nové heslo.');
    if (newProfilePassword.length < 6) return alert('Nové heslo musí mít alespoň 6 znaků.');
    setActionLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPassword });
      if (signInError) { setActionLoading(false); return alert('Původní heslo není správné.'); }

      const { error: updateError } = await supabase.auth.updateUser({ password: newProfilePassword });
      setActionLoading(false);
      if (updateError) alert('Chyba při změně hesla: ' + updateError.message);
      else { alert('Heslo bylo úspěšně změněno.'); setOldPassword(''); setNewProfilePassword(''); }
    } catch (err) { setActionLoading(false); alert('Chyba: ' + err.message); }
  };

  const getEventOccupancy = (eventId) => {
    return reservations.filter(r => r.event_id === eventId && r.status !== 'cancelled').length;
  };

  // --- SPRÁVA BALÍČKŮ V ADMINU ---
  const handleAddVariant = () => {
    setAdminEventForm(prev => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        { id: Date.now().toString(), title: '', description: '', price: 1000, capacity: 10 }
      ]
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...adminEventForm.variants];
    updatedVariants[index][field] = field === 'price' || field === 'capacity' ? Number(value) : value;
    setAdminEventForm(prev => ({ ...prev, variants: updatedVariants }));
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = adminEventForm.variants.filter((_, i) => i !== index);
    setAdminEventForm(prev => ({ ...prev, variants: updatedVariants }));
  };

  const handleAdminEventSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const payload = {
        title: adminEventForm.title, 
        date: adminEventForm.date, 
        time: adminEventForm.time,
        category: adminEventForm.category,
        description: adminEventForm.description, 
        image_url: adminEventForm.image_url,
        requires_checkin: adminEventForm.requires_checkin,
        is_hidden: adminEventForm.is_hidden,
        variants: adminEventForm.variants,
        price: adminEventForm.variants?.[0]?.price || 0,
        capacity: adminEventForm.variants?.reduce((sum, v) => sum + (Number(v.capacity) || 0), 0) || 10
    };

    if (adminEventForm.id) {
        const { data, error } = await supabase.from('events').update(payload).eq('id', adminEventForm.id).select().single();
        if (error) alert('Chyba: ' + error.message);
        else {
            setDbEvents(dbEvents.map(ev => ev.id === data.id ? { ...data, variants: data.variants || [] } : ev));
            setShowAdminEventModal(false);
            alert('Akce úspěšně upravena!');
        }
    } else {
        const { data, error } = await supabase.from('events').insert([payload]).select().single();
        if (error) alert('Chyba: ' + error.message);
        else {
            setDbEvents([...dbEvents, { ...data, variants: data.variants || [] }]);
            setShowAdminEventModal(false);
            alert('Akce úspěšně vytvořena!');
        }
    }
    setActionLoading(false);
  };

  // --- RYCHLÉ AKCE V TABULCE ADMINU ---
  const handleToggleHideEvent = async (eventId, currentHiddenState) => {
    setActionLoading(true);
    const { error } = await supabase.from('events').update({ is_hidden: !currentHiddenState }).eq('id', eventId);
    if (error) {
      alert('Chyba: ' + error.message);
    } else {
      setDbEvents(dbEvents.map(e => e.id === eventId ? { ...e, is_hidden: !currentHiddenState } : e));
    }
    setActionLoading(false);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Opravdu chcete tuto akci trvale smazat?')) return;
    setActionLoading(true);
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
      alert('Chyba při mazání: ' + error.message);
    } else {
      setDbEvents(dbEvents.filter(e => e.id !== eventId));
    }
    setActionLoading(false);
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
    setActionLoading(true);
    
    const { data, error } = await supabase.from('customers').upsert({
      auth_id: user.id, 
      email: user.email,
      first_name: profileForm.firstName, 
      last_name: profileForm.lastName, 
      phone: profileForm.phone,
      company_name: profileForm.company, 
      ico: profileForm.ico, 
      dic: profileForm.dic, 
      billing_address: profileForm.billingAddress
    }, { onConflict: 'auth_id' }).select().single();
    
    setActionLoading(false);
    if (error) {
      alert('Chyba při ukládání: ' + error.message);
    } else { 
      alert('Vaše údaje byly úspěšně uloženy.'); 
      setClientData(data); 
    }
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
    if (!selectedVariant) { alert("Prosím vyberte si cenový balíček vstupenky."); return; }

    setIsSubmitting(true);
    setActionLoading(true);
    const fullBillingAddress = `${formData.street}, ${formData.psc} ${formData.city}`.trim();
    
    const { data: customerData, error: custError } = await supabase
      .from('customers').upsert({
        auth_id: user ? user.id : null,
        first_name: formData.firstName, last_name: formData.lastName, email: formData.email, phone: formData.phone,
        company_name: formData.company, ico: formData.ico, dic: formData.dic, billing_address: fullBillingAddress 
      }, { onConflict: 'email' }).select().single();
    if (custError) { alert(custError.message); setIsSubmitting(false); setActionLoading(false); return; }

    const vs = Math.floor(100000 + Math.random() * 900000).toString();
    const finalPrice = selectedVariant.price;
    
    let insertData = { 
       customer_id: customerData.id, 
       status: 'pending_payment', 
       payment_type: formData.paymentType, 
       variable_symbol: vs, 
       total_price: finalPrice,
       event_id: selectedEvent.id, 
       date: selectedEvent.date, 
       notes: `Vstupenka na: ${selectedEvent.title} (${selectedVariant.title})`, 
       start_hour: 0, end_hour: 0, db_end_hour: 0
    };

    const { data: newBooking, error: bookError } = await supabase.from('reservations').insert(insertData).select(`*, customers (first_name, last_name, email, company_name, ico)`).single();
    if (bookError) { alert(bookError.message); setIsSubmitting(false); setActionLoading(false); return; }
    
    await generateQrPayment(finalPrice, vs);

    try {
      const iban = calculateIban("1234567890", "3030");
      const spaydString = `SPD*1.0*ACC:${iban}*AM:${finalPrice}.00*CC:CZK*X-VS:${vs}*MSG:POINT`;
      const qrPaymentUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(spaydString)}&margin=10`;
      const qrTicketUrl = selectedEvent.requires_checkin ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${newBooking.id}&margin=10` : null;

      await supabase.functions.invoke('send-email', {
        body: {
          type: 'potvrzeni', to: formData.email, jmeno: formData.firstName,
          sluzba: `${selectedEvent.title} (${selectedVariant.title})`, datum: formatDateCzech(insertData.date),
          cas: selectedEvent.time, cena: finalPrice, qrPaymentUrl: qrPaymentUrl, qrTicketUrl: qrTicketUrl
        }
      });
    } catch (emailErr) {
      console.error('E-mail se nepodařilo odeslat:', emailErr);
    }

    setResourcesReservations([...reservations, newBooking]);
    setLastCreatedRes({ ...newBooking, email: formData.email });
    setIsSubmitting(false); 
    setActionLoading(false); 
    setBookingStep(3);
  };

  const globalAnimationCss = `
    * { cursor: none !important; }
    @keyframes growDot { 0% { transform: scale(0); opacity: 0.2; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(0); opacity: 0.2; } }
    .grow-dot { width: 50px; height: 50px; background-color: #E4664F; border-radius: 50%; animation: growDot 1.5s ease-in-out infinite; }
    @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
    .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  if (loading || actionLoading) return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center">
      <style dangerouslySetInnerHTML={{__html: globalAnimationCss}} />
      <div className="grow-dot mb-8"></div>
      <div className="text-xs font-mono font-bold uppercase tracking-wider text-black animate-pulse">Načítám Point Events...</div>
    </div>
  );

  const myReservations = reservations.filter(r => r.customers?.email === user?.email).sort((a, b) => new Date(b.date) - new Date(a.date));
  const displayName = clientData?.first_name ? clientData.first_name : user?.email?.split('@')[0];

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black font-sans antialiased flex flex-col cursor-none selection:bg-black selection:text-white relative overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: globalAnimationCss}} />
      <div ref={cursorRef} className="fixed w-3 h-3 bg-[#E4664F] rounded-full pointer-events-none z-[9999] hidden md:block" style={{ transform: 'translate(-50%, -50%)', left: '-100px', top: '-100px' }} />

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

      <Header 
        user={user} displayName={displayName} view={view} setView={setView} 
        isAdmin={isAdmin} showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} handleLogout={handleLogout} 
        setIsLoginMode={setIsLoginMode} setIsForgotPasswordMode={setIsForgotPasswordMode} 
        setResetEmailSent={setResetEmailSent} setShowAuthModal={setShowAuthModal} setGdprConsent={setGdprConsent} 
        setBookingStep={setBookingStep} setSelectedEvent={setSelectedEvent}
      />

      {/* ADMIN: TVORBA A EDITACE EVENTŮ MODAL */}
      {showAdminEventModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white border-2 border-black p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">{adminEventForm.id ? 'Upravit událost' : 'Nová událost'}</h3>
            <form onSubmit={handleAdminEventSubmit} className="space-y-4">
              <div><label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">Název akce</label><input type="text" required value={adminEventForm.title} onChange={e => setAdminEventForm({...adminEventForm, title: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold uppercase outline-none" /></div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1"><label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">Kategorie</label>
                  <select value={adminEventForm.category} onChange={e => setAdminEventForm({...adminEventForm, category: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-mono font-bold uppercase outline-none cursor-pointer">
                    <option value="Event">Event</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Přednáška">Přednáška</option>
                  </select>
                </div>
                <div><label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">Datum</label><input type="date" required value={adminEventForm.date} onChange={e => setAdminEventForm({...adminEventForm, date: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-mono font-bold uppercase outline-none" /></div>
                <div><label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">Čas</label><input type="text" required value={adminEventForm.time} onChange={e => setAdminEventForm({...adminEventForm, time: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-mono font-bold uppercase outline-none" /></div>
              </div>
              
              <div><label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">URL obrázku</label><input type="url" value={adminEventForm.image_url} onChange={e => setAdminEventForm({...adminEventForm, image_url: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-mono font-bold outline-none" /></div>
              <div><label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">Popis</label><textarea required value={adminEventForm.description} onChange={e => setAdminEventForm({...adminEventForm, description: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-xs font-mono font-bold outline-none min-h-[100px]" /></div>
              
              {/* DYNAMICKÉ BALÍČKY / VARIANTY */}
              <div className="border-t-2 border-black pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider">Cenové balíčky / Vstupenky</label>
                  <button type="button" onClick={handleAddVariant} className="text-xs font-mono font-bold uppercase tracking-wider bg-black text-white px-3 py-2 hover:bg-neutral-800 cursor-pointer">+ Přidat balíček</button>
                </div>
                
                <div className="space-y-3">
                  {adminEventForm.variants?.map((variant, index) => (
                    <div key={variant.id || index} className="p-3 bg-[#f4f4f4] border-2 border-black space-y-2 relative">
                      <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-xs font-mono font-bold uppercase cursor-pointer">✕ Smazat</button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input type="text" placeholder="Název balíčku (např. VIP)" value={variant.title} onChange={e => handleVariantChange(index, 'title', e.target.value)} className="bg-white border-2 border-black p-2 text-xs font-mono font-bold uppercase outline-none" required />
                        <input type="number" placeholder="Cena (Kč)" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="bg-white border-2 border-black p-2 text-xs font-mono font-bold outline-none" required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input type="number" placeholder="Kapacita" value={variant.capacity} onChange={e => handleVariantChange(index, 'capacity', e.target.value)} className="bg-white border-2 border-black p-2 text-xs font-mono font-bold outline-none" required />
                        <input type="text" placeholder="Krátký popis" value={variant.description} onChange={e => handleVariantChange(index, 'description', e.target.value)} className="bg-white border-2 border-black p-2 text-xs font-mono font-bold outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="checkin" checked={adminEventForm.requires_checkin} onChange={e => setAdminEventForm({...adminEventForm, requires_checkin: e.target.checked})} className="w-4 h-4 accent-black cursor-pointer" />
                  <label htmlFor="checkin" className="text-xs font-mono font-bold uppercase tracking-wider text-black cursor-pointer">Vyžaduje QR vstupenku a odpípnutí</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="hidden" checked={adminEventForm.is_hidden} onChange={e => setAdminEventForm({...adminEventForm, is_hidden: e.target.checked})} className="w-4 h-4 accent-black cursor-pointer" />
                  <label htmlFor="hidden" className="text-xs font-mono font-bold uppercase tracking-wider text-black cursor-pointer">Skrýt event před veřejností v katalogu</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-black">
                <button type="button" onClick={() => setShowAdminEventModal(false)} className="px-4 py-3 bg-[#f4f4f4] border-2 border-black text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white cursor-pointer">Zrušit</button>
                <button type="submit" className="px-4 py-3 bg-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer">Uložit event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className={`flex-1 ${view === 'events_portal' && selectedEvent ? 'p-0 w-full' : 'p-4 sm:p-8 max-w-6xl w-full mx-auto relative z-10'} flex flex-col mb-12`}>
        
        {/* ===================== ADMINISTRACE EVENTŮ ===================== */}
        {view === 'admin' && isAdmin && (
          <AdminEventsTable 
            dbEvents={dbEvents}
            formatDateCzech={formatDateCzech}
            handleToggleHideEvent={handleToggleHideEvent}
            handleDeleteEvent={handleDeleteEvent}
            setAdminEventForm={setAdminEventForm}
            setShowAdminEventModal={setShowAdminEventModal}
          />
        )}

        {view === 'client_favorites' && (
          <div className="max-w-6xl mx-auto w-full animate-in fade-in space-y-8 pt-4 pb-12">
            <h2 className="text-3xl sm:text-4xl font-mono font-bold uppercase tracking-tighter text-black text-center mb-8">Moje oblíbené akce</h2>
            <div className="w-full">
              {dbEvents.filter(e => favoriteEvents.includes(e.id) && !e.is_hidden).length === 0 ? (
                  <div className="text-center p-8 sm:p-12 bg-white border-2 border-black font-mono uppercase text-neutral-500">Zatím nemáte žádné oblíbené akce. Přidejte si je kliknutím na srdíčko v katalogu.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {dbEvents.filter(e => favoriteEvents.includes(e.id) && !e.is_hidden).map((event) => {
                    const lowestPrice = event.variants?.length > 0 ? Math.min(...event.variants.map(v => v.price)) : 0;
                    return (
                      <EventCard 
                        key={event.id}
                        event={event}
                        isFav={true}
                        toggleFavorite={toggleFavorite}
                        onSelect={() => { setSelectedEvent(event); setSelectedVariant(event.variants?.[0] || null); setIsDescExpanded(false); setView('events_portal'); }}
                        formatDateCzech={formatDateCzech}
                        lowestPrice={lowestPrice}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'client_dashboard' && (
          <div className="max-w-4xl mx-auto w-full animate-in fade-in space-y-6 sm:space-y-8 pt-4 pb-12">
            <h2 className="text-2xl sm:text-3xl font-mono font-bold uppercase tracking-tighter text-black">Moje vstupenky</h2>
            <div className="bg-white border-2 border-black overflow-hidden pointer-events-auto">
               {myReservations.length === 0 ? (
                  <div className="p-8 sm:p-12 text-center font-mono uppercase text-neutral-500">Zatím nemáte zakoupené žádné vstupenky.</div>
               ) : (
                  <div className="divide-y-2 divide-black">
                     {myReservations.map(res => {
                        const eventObj = dbEvents.find(e => e.id === res.event_id);
                        const needsTicket = eventObj && eventObj.requires_checkin;
                        return (
                          <div key={res.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                             <div className="flex-1 w-full font-mono">
                                <div className="flex items-center gap-3 mb-1">
                                   <span className="px-2 py-0.5 border border-black text-[10px] font-bold uppercase bg-black text-white">Vstupenka</span>
                                   <span className="font-bold text-black text-sm">{formatDateCzech(res.date)}</span>
                                </div>
                                <div className="text-xs text-neutral-600 uppercase">{res.notes}</div>
                             </div>
                             
                             <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 w-full sm:w-auto font-mono">
                                <div className="text-left sm:text-right">
                                   <div className="font-bold text-black text-base">{res.total_price} Kč</div>
                                   <div className={`text-[10px] font-bold uppercase mt-1 ${res.status === 'paid' ? 'text-green-700' : res.status === 'cancelled' ? 'text-red-600' : 'text-[#E4664F]'}`}>{res.status === 'paid' ? 'Zaplaceno' : res.status === 'cancelled' ? 'Zrušeno' : 'Čeká na schválení / platbu'}</div>
                                </div>
                                
                                {res.status === 'paid' && needsTicket && (
                                   <button onClick={() => handleShowTicket(res)} className="w-full sm:w-auto px-4 py-3 bg-black text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer flex items-center justify-center gap-2">
                                      <span>📷</span> Zobrazit vstupenku
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

        {view === 'client_profile' && (
          <div className="max-w-4xl mx-auto w-full animate-in fade-in space-y-6 sm:space-y-8 pt-4 pb-12 pointer-events-auto">
            <h2 className="text-2xl sm:text-3xl font-mono font-bold uppercase tracking-tighter text-black">Můj Profil</h2>
            <div className="bg-white p-6 sm:p-8 border-2 border-black">
               
               <h3 className="text-base sm:text-xl font-mono font-bold uppercase tracking-wider mb-6 text-black border-b-2 border-black pb-2">Osobní a fakturační údaje</h3>
               <form onSubmit={handleProfileSave} className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                   <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Jméno</label><input type="text" value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold uppercase outline-none" /></div>
                   <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Příjmení</label><input type="text" value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold uppercase outline-none" /></div>
                   <div className="sm:col-span-2"><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Telefon</label><input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold outline-none" /></div>
                 </div>
                 <div className="border-t-2 border-black pt-6 font-mono">
                   <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mb-4">
                     <div className="flex-1 w-full"><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">IČO pro načtení z ARES</label><input type="text" value={profileForm.ico} onChange={e => setProfileForm({...profileForm, ico: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold outline-none" /></div>
                     <button type="button" onClick={loadFromAres} disabled={aresLoading} className="w-full sm:w-auto bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer">{aresLoading ? 'Načítám...' : 'Načíst ARES'}</button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Název firmy</label><input type="text" value={profileForm.company} onChange={e => setProfileForm({...profileForm, company: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold uppercase outline-none" /></div>
                     <div><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">DIČ</label><input type="text" value={profileForm.dic} onChange={e => setProfileForm({...profileForm, dic: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold uppercase outline-none" /></div>
                     <div className="sm:col-span-2"><label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Fakturační adresa</label><input type="text" value={profileForm.billingAddress} onChange={e => setProfileForm({...profileForm, billingAddress: e.target.value})} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold uppercase outline-none" /></div>
                   </div>
                 </div>
                 <div className="flex justify-end pt-4"><button type="submit" disabled={savingProfile} className="w-full sm:w-auto bg-black text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-3.5 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer">{savingProfile ? 'Ukládám...' : 'Uložit údaje'}</button></div>
               </form>

               <div className="mt-8 pt-8 border-t-2 border-black font-mono">
                 <h3 className="text-base sm:text-xl font-bold uppercase tracking-wider mb-6 text-black border-b-2 border-black pb-2">Změna hesla</h3>
                 <form onSubmit={handleProfilePasswordChange} className="space-y-4">
                   <div className="max-w-sm">
                     <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Původní heslo</label>
                     <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold outline-none mb-4" placeholder="Aktuální heslo" />
                     <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Nové heslo</label>
                     <input type="password" required value={newProfilePassword} onChange={(e) => setNewProfilePassword(e.target.value)} className="w-full bg-[#f4f4f4] border-2 border-black p-3 text-sm font-bold outline-none mb-4" placeholder="Min. 6 znaků" minLength={6} />
                     <button type="submit" disabled={savingProfile} className="bg-black text-white text-xs font-bold uppercase tracking-wider h-12 px-8 w-full sm:w-auto hover:bg-neutral-800 disabled:opacity-40 cursor-pointer">
                       {savingProfile ? 'Ukládám...' : 'Změnit heslo'}
                     </button>
                   </div>
                 </form>
               </div>

            </div>
          </div>
        )}

        {view === 'events_portal' && (
           <div className={`flex-1 w-full animate-in fade-in slide-in-from-bottom-2 ${selectedEvent ? '' : 'space-y-8'}`}>
             
             {bookingStep === 1 && !selectedEvent && (
               <div className="w-full px-4 sm:px-0">
                 <div className="flex flex-col items-center justify-center pt-4 pb-8 space-y-4 text-center">
                    <h2 className="text-3xl sm:text-5xl font-mono font-extrabold uppercase tracking-tighter text-black">Naše Akce</h2>
                    <p className="text-neutral-600 font-mono text-xs sm:text-sm uppercase tracking-wider max-w-lg px-4">Workshopy, přednášky a komunitní setkání přímo u nás v Pointu.</p>
                 </div>

                 {/* FILTRY KATEGORIÍ */}
                 <div className="flex justify-center items-center gap-2 pb-8 flex-wrap font-mono">
                   {[
                     { id: 'all', label: 'Všechny akce' },
                     { id: 'Event', label: 'Eventy' },
                     { id: 'Workshop', label: 'Workshopy' },
                     { id: 'Přednáška', label: 'Přednášky' }
                   ].map(cat => (
                     <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-3 border-2 text-xs font-bold uppercase tracking-wider cursor-pointer ${selectedCategory === cat.id ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-[#f4f4f4]'}`}>{cat.label}</button>
                   ))}
                 </div>

                 {dbEvents.filter(e => !e.is_hidden && (selectedCategory === 'all' || e.category === selectedCategory)).length === 0 ? (
                    <div className="text-center p-8 sm:p-12 bg-white border-2 border-black font-mono uppercase text-neutral-500">V této kategorii aktuálně nejsou vypsány žádné akce.</div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                     {dbEvents.filter(e => !e.is_hidden && (selectedCategory === 'all' || e.category === selectedCategory)).map((event) => {
                       const isPast = new Date(event.date) < new Date(new Date().setHours(0,0,0,0));
                       const isFav = favoriteEvents.includes(event.id);
                       const lowestPrice = event.variants?.length > 0 ? Math.min(...event.variants.map(v => v.price)) : 0;
                       if (isPast) return null; 

                       return (
                         <EventCard 
                           key={event.id}
                           event={event}
                           isFav={isFav}
                           toggleFavorite={toggleFavorite}
                           onSelect={() => { setSelectedEvent(event); setSelectedVariant(event.variants?.[0] || null); setIsDescExpanded(false); }}
                           formatDateCzech={formatDateCzech}
                           lowestPrice={lowestPrice}
                         />
                       );
                     })}
                   </div>
                 )}
               </div>
             )}

             {/* DETAIL EVENTU A VÝBĚR BALÍČKU */}
             {bookingStep === 1 && selectedEvent && (
                <EventDetail 
                  selectedEvent={selectedEvent}
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                  setIsDescExpanded={setIsDescExpanded}
                  isDescExpanded={isDescExpanded}
                  setBookingStep={setBookingStep}
                  setSelectedEvent={setSelectedEvent}
                  favoriteEvents={favoriteEvents}
                  toggleFavorite={toggleFavorite}
                  formatDateCzech={formatDateCzech}
                />
             )}

             {bookingStep === 2 && (
               <EventBookingForm 
                 user={user}
                 selectedEvent={selectedEvent}
                 selectedVariant={selectedVariant}
                 formData={formData}
                 setFormData={setFormData}
                 honeypot={honeypot}
                 setHoneypot={setHoneypot}
                 aresLoading={aresLoading}
                 loadFromAres={loadFromAres}
                 gdprConsent={gdprConsent}
                 setGdprConsent={setGdprConsent}
                 setShowGdprModal={setShowGdprModal}
                 setShowVopModal={setShowVopModal}
                 setIsLoginMode={setIsLoginMode}
                 setShowAuthModal={setShowAuthModal}
                 setBookingStep={setBookingStep}
                 handleClientSubmit={handleClientSubmit}
                 isSubmitting={isSubmitting}
                 formatDateCzech={formatDateCzech}
               />
             )}

             {bookingStep === 3 && lastCreatedRes && (
               <EventTicketSuccess 
                 lastCreatedRes={lastCreatedRes}
                 qrCodeUrl={qrCodeUrl}
                 setBookingStep={setBookingStep}
                 setSelectedEvent={setSelectedEvent}
                 setLastCreatedRes={setLastCreatedRes}
               />
             )}

           </div>
        )}

      </main>

      <Footer setShowGdprModal={setShowGdprModal} setShowVopModal={setShowVopModal} />
    </div>
  );
}
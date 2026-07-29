import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// Supabase automaticky poskytuje tyto dvě proměnné z tvého projektu:
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    
    // Vypočítáme datum přesně za 2 dny (48 hodin) a naformátujeme jako YYYY-MM-DD
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const dateString = targetDate.toISOString().split('T')[0];

    // Najdeme všechny platné rezervace na tento konkrétní den
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*, customers(email, first_name)')
      .eq('date', dateString)
      .eq('status', 'paid');

    if (error) throw error;
    
    // Pokud na daný den nic není, funkce potichu skončí
    if (!reservations || reservations.length === 0) {
      return new Response(JSON.stringify({ message: "Dnes zadne pripominky k odeslani." }), { status: 200 });
    }

    // Načteme všechny eventy, abychom znali jejich názvy (pokud to je akce)
    const { data: events } = await supabase.from('events').select('*');

    let odeslano = 0;
    
    for (const res of reservations) {
      if (!res.customers?.email) continue;
      
      let sluzba = res.notes || 'Rezervace Point';
      let cas = `${res.start_hour}:00 - ${res.end_hour}:00`;

      // Pokud je to event, vytáhneme hezký název a čas z tabulky eventů
      if (res.event_id && events) {
        const eventObj = events.find(e => e.id === res.event_id);
        if (eventObj) {
          sluzba = eventObj.title;
          cas = eventObj.time;
        }
      }

      const htmlContent = `
        <div style="font-family: sans-serif; max-w: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
          <h1 style="color: #1e293b; font-size: 24px; text-align: center;">Zítra se vidíme! ⏰</h1>
          <p style="color: #475569; font-size: 14px; line-height: 24px;">
            Ahoj ${res.customers.first_name || 'zákazníku'},<br>
            jen ti chceme připomenout, že tvůj termín v Pointu se už nezadržitelně blíží!
          </p>
          
          <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #f1f5f9; margin: 24px 0;">
            <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 16px;">${sluzba}</h2>
            <p style="color: #64748b; margin: 0;">📅 ${formatDateCzech(res.date)} | ⏰ ${cas}</p>
          </div>

          <a href="https://maps.google.com/?q=Mrštíkovo+nám.+6/14,+Olomouc" style="display: block; background-color: #0f172a; color: #ffffff; font-weight: bold; text-align: center; text-decoration: none; padding: 16px 24px; border-radius: 12px; margin-top: 32px;">
            📍 Otevřít Google Mapy a navigovat
          </a>
        </div>
      `;
      
      // Odeslání e-mailu
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Point <hello@pointspace.cz>", // NAHRAĎ SVOU DOMÉNOU
          to: [res.customers.email],
          subject: `Už se to blíží! Těšíme se na tebe v Pointu ⏰`,
          html: htmlContent
        })
      });
      odeslano++;
    }

    return new Response(JSON.stringify({ message: `Uspesne odeslano ${odeslano} pripominek.` }), { headers: { "Content-Type": "application/json" }, status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});

function formatDateCzech(isoDate) {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) return `${parseInt(parts[2], 10)}. ${parseInt(parts[1], 10)}. ${parts[0]}`;
  return isoDate;
}
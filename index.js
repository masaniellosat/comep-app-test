// index.js - Script completo per login

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Connessione al tuo nuovo ambiente di test Supabase
const supabase = createClient(
  'https://xsmpddhjfcaekdzqwvsz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbXBkZGhqZmNhZWtkenF3dnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Nzg1MjgsImV4cCI6MjA2ODA1NDUyOH0.yDflCx21WMPnNDn2dO5dbFa7zFRTLoxDrP1L5Qwl3S4'
);

document.getElementById("btnEntra").addEventListener("click", async () => {
  const nickname = document.getElementById("nickname").value.trim();
  const messaggio = document.getElementById("messaggio");

  if (!nickname) {
    messaggio.textContent = "Inserisci un nickname.";
    return;
  }

  messaggio.textContent = "Verifica in corso...";

  const { data, error } = await supabase
    .from('utenti_richieste')
    .select('*')
    .eq('nickname', nickname)
    .eq('approvato', true);

  if (error) {
    console.error('Errore Supabase:', error);
    messaggio.textContent = "Errore durante la verifica. Riprova.";
    return;
  }

  if (!data || data.length === 0) {
    messaggio.textContent = "Utente non registrato o non approvato.";
    return;
  }

  // Utente trovato e approvato
  localStorage.setItem("nickname", nickname);
  messaggio.textContent = "";
  window.location.href = "homepage.html";
});

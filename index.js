document.getElementById("btnEntra").addEventListener("click", async function () {
  const nickname = document.getElementById("nickname").value.trim().toLowerCase();
  const messaggio = document.getElementById("messaggio");

  if (!nickname) {
    messaggio.textContent = "Inserisci il nickname.";
    return;
  }

  messaggio.textContent = "Controllo accesso...";

  try {
    const response = await fetch(`https://xsmpddhjfcaekdzqwvsz.supabase.co/rest/v1/utenti_richieste?nickname=eq.${nickname}&approvato=eq.true`, {
      method: "GET",
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbXBkZGhqZmNhZWtkenF3dnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Nzg1MjgsImV4cCI6MjA2ODA1NDUyOH0.yDflCx21WMPnNDn2dO5dbFa7zFRTLoxDrP1L5Qwl3S4",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbXBkZGhqZmNhZWtkenF3dnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Nzg1MjgsImV4cCI6MjA2ODA1NDUyOH0.yDflCx21WMPnNDn2dO5dbFa7zFRTLoxDrP1L5Qwl3S4"
      }
    });

    const dati = await response.json();

    if (dati.length === 1) {
      localStorage.setItem("nickname", nickname);
      window.location.href = "homepage.html";
    } else {
      messaggio.textContent = "Utente non registrato o non approvato.";
    }

  } catch (error) {
    messaggio.textContent = "Errore di connessione. Riprova.";
    console.error(error);
  }
});

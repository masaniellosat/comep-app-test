document.getElementById("formRegistrazione").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cognome = document.getElementById("cognome").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const nickname = document.getElementById("nickname").value.trim().toLowerCase();
  const errore = document.getElementById("errore");

  if (!nome || !cognome || !email || !password || !nickname) {
    errore.textContent = "Tutti i campi sono obbligatori.";
    return;
  }

  if (!email.includes("@")) {
    errore.textContent = "Inserisci un'email valida.";
    return;
  }

  if (password.length < 6) {
    errore.textContent = "La password deve contenere almeno 6 caratteri.";
    return;
  }

  const data = {
    nome,
    cognome,
    email,
    password,
    nickname,
    approvato: false,
    ruolo: "utente" // nuovo campo ruolo
  };

  try {
    const response = await fetch("https://xsmpddhjfcaekdzqwvsz.supabase.co/rest/v1/utenti_richieste", {
      method: "POST",
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbXBkZGhqZmNhZWtkenF3dnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Nzg1MjgsImV4cCI6MjA2ODA1NDUyOH0.yDflCx21WMPnNDn2dO5dbFa7zFRTLoxDrP1L5Qwl3S4",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbXBkZGhqZmNhZWtkenF3dnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Nzg1MjgsImV4cCI6MjA2ODA1NDUyOH0.yDflCx21WMPnNDn2dO5dbFa7zFRTLoxDrP1L5Qwl3S4",
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Errore durante l'invio della richiesta.");
    }

    alert("Registrazione inviata con successo!");
    document.getElementById("formRegistrazione").reset();
    errore.textContent = "";
  } catch (err) {
    errore.textContent = "Errore durante l'invio. Riprova.";
    console.error(err);
  }
});

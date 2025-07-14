document.getElementById("formRegistrazione").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cognome = document.getElementById("cognome").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const nickname = document.getElementById("nickname").value.trim();
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
    approvato: false
  };

  try {
    const response = await fetch("https://orrnlfoqwivdlykajikp.supabase.co/rest/v1/utenti_richieste", {
      method: "POST",
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycm5sZm9xd2l2ZGx5a2FqaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NzIwNzksImV4cCI6MjA2NzM0ODA3OX0.Xp8MB-hbBmGoYtTrq9W-J64ERpe-FWF6lM01BvmEvu8",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycm5sZm9xd2l2ZGx5a2FqaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NzIwNzksImV4cCI6MjA2NzM0ODA3OX0.Xp8MB-hbBmGoYtTrq9W-J64ERpe-FWF6lM01BvmEvu8",
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

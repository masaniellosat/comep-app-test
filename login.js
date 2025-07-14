document.getElementById("btnMostraLogin").addEventListener("click", () => {
  document.getElementById("formLogin").classList.remove("hidden");
  document.getElementById("erroreLogin").textContent = "";
  document.getElementById("nickname").value = "";
});

document.getElementById("btnRegistrati").addEventListener("click", () => {
  window.location.href = "/registrazione.html";
});

document.getElementById("btnLogin").addEventListener("click", async () => {
  const nicknameInput = document.getElementById("nickname").value.trim().toLowerCase();
  const erroreDiv = document.getElementById("erroreLogin");

  if (!nicknameInput) {
    erroreDiv.textContent = "Inserisci il tuo nickname.";
    return;
  }

  try {
    const response = await fetch("https://orrnlfoqwivdlykajikp.supabase.co/rest/v1/utenti_richieste", {
      method: "GET",
      headers: {
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycm5sZm9xd2l2ZGx5a2FqaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NzIwNzksImV4cCI6MjA2NzM0ODA3OX0.Xp8MB-hbBmGoYtTrq9W-J64ERpe-FWF6lM01BvmEvu8",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycm5sZm9xd2l2ZGx5a2FqaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NzIwNzksImV4cCI6MjA2NzM0ODA3OX0.Xp8MB-hbBmGoYtTrq9W-J64ERpe-FWF6lM01BvmEvu8"
      }
    });

    const utenti = await response.json();

    const utenteTrovato = utenti.find(utente =>
      utente.nickname && utente.nickname.trim().toLowerCase() === nicknameInput
    );

    if (!utenteTrovato) {
      erroreDiv.textContent = "Utente non registrato.";
    } else if (!utenteTrovato.approvato) {
      erroreDiv.textContent = "Utente non ancora approvato.";
    } else {
      localStorage.setItem("nickname", utenteTrovato.nickname);
      window.location.href = "/homepage.html";
    }
  } catch (err) {
    console.error("Errore di login:", err);
    erroreDiv.textContent = "Errore durante l'accesso. Riprova.";
  }
});

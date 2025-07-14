<script type="module">
import { supabase } from "./supabase.js";

const urlParams = new URLSearchParams(window.location.search);
const dataParam = urlParams.get("data");

const giornoSelect = document.getElementById("giorno");
const meseSelect = document.getElementById("mese");
const annoSelect = document.getElementById("anno");

for (let d = 1; d <= 31; d++) {
  giornoSelect.innerHTML += `<option value="${d}">${d}</option>`;
}

const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
mesi.forEach((m, i) => {
  meseSelect.innerHTML += `<option value="${i + 1}">${m}</option>`;
});

const annoCorrente = new Date().getFullYear();
for (let y = annoCorrente - 5; y <= annoCorrente + 1; y++) {
  annoSelect.innerHTML += `<option value="${y}">${y}</option>`;
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function gestisciSceltaPresenza() {
  const tipo = document.getElementById("tipoPresenza").value;
  document.getElementById("opzioniComep").style.display = tipo === "Comep" ? "flex" : "none";
  document.getElementById("opzioniEsterno").style.display = tipo === "Esterno" ? "flex" : "none";
  document.getElementById("opzioniTrasferta").style.display = tipo === "Trasferta" ? "flex" : "none";
  document.getElementById("campoDestinazione").style.display = tipo === "Trasferta" ? "flex" : "none";
  mostraOnshore(false);
  document.getElementById("zonaOffshore").style.display = "none";
}

function mostraOnshore(attiva) {
  document.getElementById("zonaOnshore").style.display = attiva ? "flex" : "none";
  document.getElementById("zonaOffshore").style.display = attiva ? "none" : "flex";
  document.getElementById("alloggioOnshore").style.display = "none";
  document.getElementById("vittoHotel").style.display = "none";
  document.querySelectorAll('input[name="zonaOnshore"], input[name="zonaOffshore"], input[name="alloggio"], input[name="vitto"]').forEach(el => el.checked = false);
}

function mostraAlloggio() {
  document.getElementById("alloggioOnshore").style.display = "flex";
}

function mostraVitto() {
  document.getElementById("vittoHotel").style.display = "flex";
}

function nascondiVitto() {
  document.getElementById("vittoHotel").style.display = "none";
  document.querySelectorAll('input[name="vitto"]').forEach(el => el.checked = false);
}
window.addEventListener("DOMContentLoaded", async () => {
  if (!dataParam) {
    alert("Parametro 'data' mancante.");
    return;
  }

  const nickname = localStorage.getItem("nickname");
  if (!nickname) {
    alert("Accesso non autorizzato. Effettua il login.");
    window.location.href = "index.html";
    return;
  }

  const { data: presenze, error } = await supabase
    .from("presenze")
    .select("*")
    .eq("data", dataParam)
    .eq("nickname", nickname)
    .single();

  if (error || !presenze) {
    alert("Presenza non trovata.");
    window.location.href = "log-presenze.html";
    return;
  }

  const presenza = presenze;

  const [anno, mese, giorno] = presenza.data.split("-");
  giornoSelect.value = parseInt(giorno, 10);
  meseSelect.value = parseInt(mese, 10);
  annoSelect.value = parseInt(anno, 10);

  document.getElementById("tipoPresenza").value = presenza.tipo;
  gestisciSceltaPresenza();

  if (presenza.tipo === "Comep") {
    document.getElementById("badgeSpunta").checked = presenza.badge || false;
    document.getElementById("noteComep").value = presenza.note || "";
  }

  if (presenza.tipo === "Esterno") {
    document.getElementById("luogoEsterno").value = presenza.luogo || "";
    document.getElementById("orarioInizio").value = presenza.orarioInizio || "";
    document.getElementById("orarioFine").value = presenza.orarioFine || "";
  }

  if (presenza.tipo === "Trasferta") {
    document.getElementById("destinazione").value = presenza.codiceMissione || "";
    if (presenza.trasfertaTipo) {
      document.querySelector(`input[name="tipoTrasferta"][value="${presenza.trasfertaTipo}"]`)?.click();
      if (presenza.zona) {
        document.querySelector(`input[name="zona${presenza.trasfertaTipo}"][value="${presenza.zona}"]`)?.click();
      }
      if (presenza.alloggio) {
        document.querySelector(`input[name="alloggio"][value="${presenza.alloggio}"]`)?.click();
        if (presenza.vitto) {
          document.querySelector(`input[name="vitto"][value="${presenza.vitto}"]`)?.checked = true;
        }
      }
    }
  }
});

window.salvaModifica = async function () {
  const giorno = pad(giornoSelect.value);
  const mese = pad(meseSelect.value);
  const anno = annoSelect.value;
  const tipo = document.getElementById("tipoPresenza").value;
  const nickname = localStorage.getItem("nickname");
  const nome = localStorage.getItem("nomeUtente") || "Anonimo";
  const data = `${anno}-${mese}-${giorno}`;

  if (!tipo) return alert("Seleziona un tipo di presenza.");

  const nuovaPresenza = { data, utente: nome, nickname, tipo };

  if (tipo === "Comep") {
    nuovaPresenza.badge = document.getElementById("badgeSpunta").checked;
    nuovaPresenza.note = document.getElementById("noteComep").value;
  } else if (tipo === "Esterno") {
    nuovaPresenza.luogo = document.getElementById("luogoEsterno").value;
    nuovaPresenza.orarioInizio = document.getElementById("orarioInizio").value;
    nuovaPresenza.orarioFine = document.getElementById("orarioFine").value;
  } else if (tipo === "Trasferta") {
    const codice = document.getElementById("destinazione").value.trim();
    if (!codice) return alert("Inserisci il codice missione.");
    nuovaPresenza.codiceMissione = codice;

    const tipoTrasferta = document.querySelector('input[name="tipoTrasferta"]:checked');
    if (!tipoTrasferta) return alert("Seleziona Offshore o Onshore.");
    nuovaPresenza.trasfertaTipo = tipoTrasferta.value;

    if (tipoTrasferta.value === "Offshore") {
      const zona = document.querySelector('input[name="zonaOffshore"]:checked');
      if (!zona) return alert("Seleziona zona Offshore.");
      nuovaPresenza.zona = zona.value;
    } else {
      const zona = document.querySelector('input[name="zonaOnshore"]:checked');
      const alloggio = document.querySelector('input[name="alloggio"]:checked');
      if (!zona || !alloggio) return alert("Completa zona e alloggio.");
      nuovaPresenza.zona = zona.value;
      nuovaPresenza.alloggio = alloggio.value;

      if (alloggio.value === "Hotel") {
        const vitto = document.querySelector('input[name="vitto"]:checked');
        if (!vitto) return alert("Seleziona tipo di vitto.");
        nuovaPresenza.vitto = vitto.value;
      }
    }
  }

  // elimina presenza precedente
  await supabase
    .from("presenze")
    .delete()
    .eq("data", dataParam)
    .eq("nickname", nickname);

  // inserisci nuova
  const { error } = await supabase
    .from("presenze")
    .insert(nuovaPresenza);

  if (error) {
    console.error(error);
    alert("Errore nel salvataggio.");
    return;
  }

  alert("Presenza modificata con successo!");
  window.location.href = "log-presenze.html";
};
</script>


<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

  const supabaseUrl = 'https://orrnlfoqwivdlykajikp.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycm5sZm9xd2l2ZGx5a2FqaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NzIwNzksImV4cCI6MjA2NzM0ODA3OX0.Xp8MB-hbBmGoYtTrq9W-J64ERpe-FWF6lM01BvmEvu8'
  const supabase = createClient(supabaseUrl, supabaseKey)

  document.addEventListener('DOMContentLoaded', () => {
    const formProgetto = document.getElementById('form-progetto')

    if (formProgetto) {
      formProgetto.addEventListener('submit', async function (e) {
        e.preventDefault()

        const nome = document.getElementById('nome-progetto').value.trim()
        const codice = document.getElementById('codice-progetto').value.trim()
        const localita = document.getElementById('localita-progetto').value.trim()
        const nickname = localStorage.getItem("nickname")

        if (!nome || !codice || !localita) {
          alert('Tutti i campi sono obbligatori.')
          return
        }

        if (!nickname) {
          alert('Utente non riconosciuto. Effettua il login.')
          return
        }

        // Controllo esistenza codice missione
        const { data: esistenti, error: erroreQuery } = await supabase
          .from('progetti')
          .select('id')
          .eq('codice', codice)
          .eq('nickname', nickname)

        if (erroreQuery) {
          alert('Errore nella verifica del codice.')
          return
        }

        if (esistenti.length > 0) {
          alert('Esiste già un progetto con questo codice missione.')
          return
        }

        // Inserimento con recupero ID
        const { data, error } = await supabase
          .from('progetti')
          .insert([{ nome, codice, localita, nickname }])
          .select()

        if (error || !data || data.length === 0) {
          console.error('Errore nel salvataggio:', error)
          alert('Errore nel salvataggio del progetto.')
          return
        }

        const nuovoProgetto = data[0]

        // Redirect con ID
        window.location.href = `/nuova-spesa.html?id=${nuovoProgetto.id}`
      })
    }
  })
</script>

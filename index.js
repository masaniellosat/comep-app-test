document.addEventListener('DOMContentLoaded', () => {
  const btnAccedi = document.getElementById('btnAccedi');
  const btnRegistrati = document.getElementById('btnRegistrati');
  const loginForm = document.getElementById('loginForm');

  btnAccedi.addEventListener('click', () => {
    loginForm.style.display = 'block';
  });

  btnRegistrati.addEventListener('click', () => {
    window.location.href = 'registrazione.html';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Qui potrai integrare il login Supabase
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    alert(`Login simulato per: ${email}`);
  });
});

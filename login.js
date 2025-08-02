document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
    // Verificar si ya hay sesión activa
  fetch('/verificar-sesion', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        window.location.href = 'public/Finanzas.html';
      }
    });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const respuesta = await fetch('https://proyecto-m-gestor-de-gastos.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const datos = await respuesta.json();

      if (datos.ok) {
        alert('✅ Inicio de sesión exitoso');
        window.location.href = "Finanzas.html";
      } else {
        alert('❌ ' + datos.mensaje);
      }
    } catch (err) {
      console.error('Error de red:', err);
      alert('Error al conectar con el servidor');
    }
  });
});

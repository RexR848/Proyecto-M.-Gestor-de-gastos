document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

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
        body: JSON.stringify({ email, password }) // <-- CORREGIDO AQUÍ
      });

      const datos = await respuesta.json();

      if (datos.ok) {
        alert('✅ Inicio de sesión exitoso');
        window.location.href = "public\Finanzas.html";
      } else {
        alert('❌ ' + datos.mensaje);
      }
    } catch (err) {
      console.error('Error de red:', err);
      alert('Error al conectar con el servidor');
    }
  });
});

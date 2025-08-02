document.addEventListener("DOMContentLoaded", () => {
  const parts = document.querySelectorAll(".overlay-part");

  function animateOverlay(anim) {
    parts.forEach(part => {
      part.classList.remove("slideUp", "slideDown");
      void part.offsetWidth;
      part.classList.add(anim);
    });
  }

  //▶
  animateOverlay("slideUp");

  //🖱️
  document.body.addEventListener("mouseenter", () => animateOverlay("slideUp"));
  document.body.addEventListener("mouseleave", () => animateOverlay("slideDown"));

  //📱
  document.body.addEventListener("touchstart", () => animateOverlay("slideUp"));
  document.body.addEventListener("touchend", () => animateOverlay("slideDown"));

  // Formulario (denuevo lol)
  const form = document.getElementById('formRegistro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const respuesta = await fetch('https://proyecto-m-gestor-de-gastos.onrender.com/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ nombre, email, password })
      });

      const datos = await respuesta.json();

      if (datos.ok) {
        alert('✅ Registro exitoso');
        window.location.href = "public/IniciarSesion.html";
      } else {
        alert('❌ ' + datos.mensaje);
      }
    } catch (err) {
      console.error('Error de red:', err);
      alert('Error al conectar con el servidor');
    }
  });
});

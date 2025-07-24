document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRegistro");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://proyecto-m-gestor-de-gastos.onrender.com/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cuenta creada correctamente: " + data.mensaje);
        window.location.href = "public\IniciarSesion.html";
      } else {
        alert("✖️✖️✖️Error: " + (data.error || data.mensaje));
      }
    } catch (error) {
      alert("Error de red: " + error.message);
    }
  });
});

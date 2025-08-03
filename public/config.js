document.addEventListener("DOMContentLoaded", () => {
  const btnBorrarDatos = document.getElementById("btn-borrar-datos");

  btnBorrarDatos.addEventListener("click", async () => {
    const confirmacion = confirm("¿Seguro que quieres borrar todos los datos financieros? Esta acción no se puede deshacer.");
    if (!confirmacion) return;

    try {
      const res = await fetch("/borrar-datos", {
        method: "POST", // O "DELETE" si cambias en server.js
        headers: { "Content-Type": "application/json" }
      });

      const result = await res.json();

      if (res.ok && result.ok) {
        alert("✅ Datos borrados correctamente.");
        // Opcional: recargar página o actualizar interfaz
      } else {
        alert(result.mensaje || "Error al borrar los datos.");
      }
    } catch (error) {
      alert("❌ Error en la comunicación con el servidor: " + error.message);
    }
  });
});

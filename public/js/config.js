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

// Manejo de eliminar la cuenta
document.addEventListener("DOMContentLoaded", () => {
  const btnBorrarCuenta = document.getElementById("btn-borrar-cuenta");

  btnBorrarCuenta.addEventListener("click", () => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    
    if (confirmacion) {
      fetch('/eliminar-cuenta', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Cuenta eliminada exitosamente.");
          
          window.location.href = '../../index.html';
        } else {
          mostrarErrorModal(data.message || "No se pudo eliminar la cuenta.");
        }
      })
      .catch(err => {
        mostrarErrorModal("Error al conectar con el servidor.");
        console.error(err);
      });
    }
  });
});

function mostrarErrorModal(mensaje) {
  const modal = document.getElementById("error-modal");
  const mensajeElem = document.getElementById("error-message");
  mensajeElem.textContent = mensaje;
  modal.style.display = "block";
}

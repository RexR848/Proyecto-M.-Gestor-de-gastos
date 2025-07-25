function obtenerGastosDesde(idContenedor) {
  const contenedor = document.getElementById(idContenedor);
  const items = contenedor.querySelectorAll(".gasto-item");

  const datos = [];
  items.forEach(item => {
    const nombre = item.querySelector('input[type="text"]').value.trim();
    const monto = parseFloat(item.querySelector('input[type="number"]').value) || 0;
    datos.push({ nombre, monto });
  });

  return datos;
}

// 👇 Hacemos global la función
window.guardarDatos = function guardarDatos() {
  const ingreso = parseFloat(document.getElementById("ingreso").value) || 0;
  const gastosFijos = obtenerGastosDesde("gastos-fijos-container");
  const gastosOpcionales = obtenerGastosDesde("gastos-opcionales-container");

  fetch("/guardar-datos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingreso, gastosFijos, gastosOpcionales }),
  })
    .then(res => res.json())
    .then(respuesta => {
      if (respuesta.ok) {
        alert("✅ Datos guardados correctamente");
        window.location.href = "Finanzas.html";
      } else {
        alert("❌ Error al guardar los datos");
      }
    })
    .catch(err => {
      console.error("❌ Error en la solicitud:", err);
      alert("⚠️ Error de conexión con el servidor.");
    });
};

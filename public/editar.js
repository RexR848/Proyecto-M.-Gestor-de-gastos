function agregarGasto(tipo) {
  const containerId = tipo === 'fijo' ? 'gastos-fijos-container' : 'gastos-opcionales-container';
  const container = document.getElementById(containerId);

  const div = document.createElement('div');
  div.className = 'gasto-item';
  div.innerHTML = `
    <input type="text" placeholder="Nombre" class="gasto-nombre" required />
    <input type="number" placeholder="$0.00" class="gasto-monto" required />
  `;
  container.appendChild(div);
}

function guardarDatos() {
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
    });
}

function obtenerGastosDesde(contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  const items = contenedor.querySelectorAll(".gasto-item");
  const lista = [];

  items.forEach(item => {
    const nombre = item.querySelector(".gasto-nombre").value;
    const monto = parseFloat(item.querySelector(".gasto-monto").value) || 0;
    if (nombre) lista.push({ nombre, monto });
  });

  return lista;
}
document.addEventListener("DOMContentLoaded", () => {
  // 🔁 Cargar los datos al abrir la página
  fetch("/datos")
    .then(res => res.json())
    .then(data => {
      if (!data.ok) return;

      const { ingreso, gastosFijos, gastosOpcionales } = data.datos;

      document.getElementById("ingreso").value = ingreso || 0;

      llenarCampos("gastos-fijos-container", gastosFijos || []);
      llenarCampos("gastos-opcionales-container", gastosOpcionales || []);
    });
});

// ✅ Agregar un nuevo gasto (manual)
function agregarGasto(tipo) {
  const containerId = tipo === 'fijo' ? 'gastos-fijos-container' : 'gastos-opcionales-container';
  const container = document.getElementById(containerId);

  const div = document.createElement('div');
  div.className = 'gasto-item';
  div.innerHTML = `
    <input type="text" placeholder="Nombre" class="gasto-nombre" required />
    <input type="number" placeholder="$0.00" class="gasto-monto" required />
    <button onclick="eliminarGasto(this)">🗑</button>
  `;
  container.appendChild(div);
}

// 🔄 Llenar los campos desde los datos guardados
function llenarCampos(containerId, lista) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  lista.forEach(gasto => {
    const div = document.createElement('div');
    div.className = 'gasto-item';
    div.innerHTML = `
      <input type="text" value="${gasto.nombre}" class="gasto-nombre" required />
      <input type="number" value="${gasto.monto}" class="gasto-monto" required />
      <button onclick="eliminarGasto(this)">🗑</button>
    `;
    container.appendChild(div);
  });
}

// 🧹 Eliminar un gasto del DOM
function eliminarGasto(boton) {
  const item = boton.parentElement;
  item.remove();
}

// 💾 Guardar los datos modificados
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

// 📋 Recolectar gastos desde los inputs
function obtenerGastosDesde(contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  const items = contenedor.querySelectorAll(".gasto-item");
  const lista = [];

  items.forEach(item => {
    const nombre = item.querySelector(".gasto-nombre").value.trim();
    const monto = parseFloat(item.querySelector(".gasto-monto").value) || 0;
    if (nombre) lista.push({ nombre, monto });
  });

  return lista;
}
document.addEventListener("DOMContentLoaded", () => {
  fetch("/datos")
    .then(res => res.json())
    .then(data => {
      if (!data.ok) {
        console.warn("⚠️ No se pudo obtener los datos.");
        return;
      }

      // 👉 Mostrar ingreso mensual
      const ingreso = data.datos.ingreso || 0;
      document.getElementById("ingreso-mensual").textContent = `$${ingreso.toFixed(2)}`;

      // 👉 Mostrar gastos fijos
      mostrarGastos("lista-fijos", data.datos.gastosFijos || []);

      // 👉 Mostrar gastos opcionales
      mostrarGastos("lista-opcionales", data.datos.gastosOpcionales || []);
    })
    .catch(err => {
      console.error("❌ Error al cargar los datos:", err);
    });
});

function mostrarGastos(idContenedor, lista) {
  const contenedor = document.getElementById(idContenedor);
  contenedor.innerHTML = ""; // Limpia antes de insertar

  lista.forEach(gasto => {
    const item = document.createElement("div");
    item.className = "gasto-item";
    item.innerHTML = `
      <span class="gasto-nombre">${gasto.nombre}</span>
      <span class="gasto-cantidad">$${gasto.monto.toFixed(2)}</span>
    `;
    contenedor.appendChild(item);
  });
}

//navbar copiar abajo
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

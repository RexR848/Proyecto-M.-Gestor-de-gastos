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

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

const logoutLink = document.getElementById("logout-link");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("logout-popup");
const cancelBtn = document.querySelector(".cancel-btn");
const confirmBtn = document.querySelector(".confirm-btn");

logoutLink.addEventListener("click", function(e) {
  e.preventDefault();
  popup.classList.add("active");
  overlay.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  popup.classList.remove("active");
  overlay.classList.remove("active");
});

confirmBtn.addEventListener("click", () => {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
  });
  location.reload();
});


document.addEventListener("DOMContentLoaded", () => {
  fetch("/datos")
    .then(res => res.json())
    .then(data => {
      if (!data.ok) {
        console.warn("⚠️ No se pudo obtener los datos.");
        return;
      }

      const ingreso = data.datos.ingreso || 0;
      const ingresoElem = document.getElementById("ingreso-mensual");
      if (ingresoElem) {
        ingresoElem.textContent = `$${ingreso.toFixed(2)}`;
      }

      mostrarGastos("lista-fijos", data.datos.gastosFijos || []);
      mostrarGastos("lista-opcionales", data.datos.gastosOpcionales || []);
    })
    .catch(err => {
      console.error("❌ Error al cargar los datos:", err);
    });
});

function mostrarGastos(idContenedor, lista) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;
  contenedor.innerHTML = "";

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

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  if (!sidebar || !overlay) return;

  sidebar.classList.toggle("open");
  overlay.classList.toggle("active");
}

// Eventos para cerrar sidebar al hacer click en overlay
const overlay = document.getElementById("overlay");
if (overlay) {
  overlay.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });
}

// Manejo de cierre de sesión con popup
const logoutLink = document.getElementById("logout-link");
const popup = document.getElementById("logout-popup");
const cancelBtn = document.querySelector(".cancel-btn");
const confirmBtn = document.querySelector(".confirm-btn");

if (logoutLink && popup && overlay && cancelBtn && confirmBtn) {
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
    fetch('/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        window.location.href = '../../index.html';
      } else {
        alert('No se pudo cerrar sesión.');
      }
    })
    .catch(() => alert('Error en la comunicación con el servidor.'));
  });
}

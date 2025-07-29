document.addEventListener("DOMContentLoaded", () => {
  fetch("/datos")
    .then(res => res.json())
    .then(data => {
      if (!data.ok) {
        console.warn("⚠️ No se pudo obtener los datos.");
        return;
      }

      const ingreso = data.datos.ingreso || 0;
      document.getElementById("ingreso-mensual").textContent = `$${ingreso.toFixed(2)}`;

      mostrarGastos("lista-fijos", data.datos.gastosFijos || []);
      mostrarGastos("lista-opcionales", data.datos.gastosOpcionales || []);
    })
    .catch(err => {
      console.error("❌ Error al cargar los datos:", err);
    });
});

function mostrarGastos(idContenedor, lista) {
  const contenedor = document.getElementById(idContenedor);
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
  fetch('/logout', {
    method: 'POST',
    credentials: 'include'
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      window.location.href = 'login.html';
    } else {
      alert('No se pudo cerrar sesión.');
    }
  })
  .catch(() => alert('Error en la comunicación con el servidor.'));
});

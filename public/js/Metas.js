document.addEventListener("DOMContentLoaded", () => {
  const metasContainer = document.getElementById("metas-container");
  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");

  const inputNombre = document.getElementById("popup-nombre");
  const inputActual = document.getElementById("popup-actual");
  const inputMeta = document.getElementById("popup-meta");

  const guardarMetaBtn = document.getElementById("guardar-meta-btn");
  const cancelarMetaBtn = document.getElementById("cancelar-meta-btn");

  const nuevaBtn = document.getElementById("nueva-meta-btn");
  const popupTitle = document.getElementById("popup-title");

  let metas = [];
  let metaActual = null;
  let modoEdicion = false;

  // Hacer toggleSidebar global para que el onclick del botón lo pueda llamar
  window.toggleSidebar = function () {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
  };

  // Cerrar sidebar, popup meta o popup cerrar sesión si se hace clic en el overlay
  overlay.addEventListener("click", () => {
    // Cerrar sidebar
    document.getElementById("sidebar").classList.remove("open");

    // Cerrar popup meta si está abierto
    if (popup.classList.contains("active")) {
      popup.classList.remove("active");
    }

    // Cerrar popup cerrar sesión si está abierto
    const logoutPopup = document.getElementById("logout-popup");
    if (logoutPopup.classList.contains("active")) {
      logoutPopup.classList.remove("active");
    }

    // Quitar overlay
    overlay.classList.remove("active");
  });

  function mostrarMetas() {
    metasContainer.innerHTML = "";

    metas.forEach((m, i) => {
      const div = document.createElement("div");
      div.className = "gasto-box";

      const porcentaje = Math.min((m.actual / m.meta) * 100, 100).toFixed(1);
      const metaCumplida = m.actual >= m.meta;

      div.innerHTML = `
        <div class="gasto-header">${m.nombre}</div>
        <p style="margin:8px 0;">💵 ${m.actual.toFixed(2)} / ${m.meta.toFixed(2)}</p>
        <div style="background:#444; border-radius:8px; overflow:hidden; margin: 8px 0;">
          <div style="width:${porcentaje}%; height:12px; background:${metaCumplida ? '#27ae60' : '#4aa3ff'};"></div>
        </div>
        ${metaCumplida ? '<p style="color:#27ae60; margin-top:8px;">🎉 ¡Meta cumplida! ¡Felicidades!</p>' : ''}
        <div style="margin-top:10px; display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn" onclick="abrirPopupEditarMeta(${i})">✏️ Editar</button>
          <button class="btn" onclick="eliminarMeta(${i})">🗑 Eliminar</button>
        </div>
      `;
      metasContainer.appendChild(div);
    });
  }

  window.abrirPopupNuevaMeta = function () {
    modoEdicion = false;
    metaActual = null;
    popupTitle.textContent = "Agregar nueva meta";
    inputNombre.value = "";
    inputActual.value = "";
    inputMeta.value = "";
    popup.classList.add("active");
    overlay.classList.add("active");
  };

  window.abrirPopupEditarMeta = function (index) {
    modoEdicion = true;
    metaActual = index;
    popupTitle.textContent = "Editar meta";
    const meta = metas[index];
    inputNombre.value = meta.nombre;
    inputActual.value = meta.actual;
    inputMeta.value = meta.meta;
    popup.classList.add("active");
    overlay.classList.add("active");
  };

  window.eliminarMeta = async function (index) {
    const confirmacion = confirm("¿Estás seguro de eliminar esta meta?");
    if (!confirmacion) return;

    metas.splice(index, 1);
    await guardarMetas();
    mostrarMetas();
  };

  guardarMetaBtn.onclick = async () => {
    const nombre = inputNombre.value.trim();
    const actual = parseFloat(inputActual.value);
    const meta = parseFloat(inputMeta.value);

    if (!nombre) return alert("Por favor, ingresa un nombre para la meta.");
    if (isNaN(actual) || isNaN(meta)) return alert("Los montos deben ser números válidos.");
    if (actual < 0) return alert("La cantidad actual no puede ser negativa.");
    if (meta <= 0) return alert("El monto meta debe ser mayor que cero.");

    if (!modoEdicion && actual >= meta) {
      return alert("Al crear una meta, el monto actual debe ser menor al monto meta.");
    }

    const nuevaMeta = { nombre, actual, meta };

    if (modoEdicion) {
      metas[metaActual] = nuevaMeta;
    } else {
      metas.push(nuevaMeta);
    }

    await guardarMetas();
    popup.classList.remove("active");
    overlay.classList.remove("active");
    mostrarMetas();
  };

  cancelarMetaBtn.onclick = () => {
    popup.classList.remove("active");
    overlay.classList.remove("active");
  };

  async function guardarMetas() {
    try {
      const res = await fetch("/guardar-metas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metas }),
      });

      const result = await res.json();
      if (!res.ok || !result.ok) {
        alert(result.error || "Error al guardar metas");
      }
    } catch (err) {
      alert("Error de red");
    }
  }

  fetch("/metas")
    .then((res) => res.json())
    .then((data) => {
      metas = data.metas || [];
      mostrarMetas();
    });

  nuevaBtn.addEventListener("click", abrirPopupNuevaMeta);
});

// Cierre de sesión
document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logout-link");
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("logout-popup");

  const cancelarSesionBtn = document.getElementById("cancelar-sesion-btn");
  const confirmarSesionBtn = document.getElementById("confirmar-sesion-btn");

  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    popup.classList.add("active");
    overlay.classList.add("active");
  });

  cancelarSesionBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    overlay.classList.remove("active");
  });

  confirmarSesionBtn.addEventListener("click", () => {
    fetch("/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          window.location.href = "../../index.html";
        } else {
          alert("No se pudo cerrar sesión.");
        }
      })
      .catch(() => alert("Error en la comunicación con el servidor."));
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const metasContainer = document.getElementById("metas-container");

  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  const inputNombre = document.getElementById("popup-nombre");
  const inputActual = document.getElementById("popup-actual");
  const inputMeta = document.getElementById("popup-meta");
  const cancelBtn = document.querySelector(".cancel-btn");
  const confirmBtn = document.querySelector(".confirm-btn");
  const popupTitle = document.getElementById("popup-title");

  const nuevaBtn = document.getElementById("nueva-meta-btn"); //boton nuevo
  let metas = [];
  let metaActual = null;
  let modoEdicion = false;

  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("open");
  };

  function mostrarMetas() {
    metasContainer.innerHTML = "";

    metas.forEach((m, i) => {
      const div = document.createElement("div");
      div.className = "gasto-box";

      const porcentaje = Math.min((m.actual / m.meta) * 100, 100).toFixed(1);

      div.innerHTML = `
        <div class="gasto-header">${m.nombre}</div>
        <p style="margin:8px 0;">💵 ${m.actual.toFixed(2)} / ${m.meta.toFixed(2)}</p>
        <div style="background:#444; border-radius:8px; overflow:hidden; margin: 8px 0;">
          <div style="width:${porcentaje}%; height:12px; background:#4aa3ff;"></div>
        </div>
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

  cancelBtn.onclick = () => {
    popup.classList.remove("active");
    overlay.classList.remove("active");
  };

  confirmBtn.onclick = async () => {
    const nombre = inputNombre.value.trim();
    const actual = parseFloat(inputActual.value);
    const meta = parseFloat(inputMeta.value);

    if (!nombre || isNaN(actual) || isNaN(meta) || actual < 0 || meta <= 0) {
      return alert("Completa todos los campos correctamente");
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
    location.reload();
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
    .then(res => res.json())
    .then(data => {
      metas = data.metas;
      mostrarMetas();
    });

  //nv meta btn
  nuevaBtn.addEventListener("click", abrirPopupNuevaMeta);
});

// Manejo de cierre de sesión
document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logout-link");
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("logout-popup");
  const cancelBtn = document.querySelector(".cancel-btn");
  const confirmBtn = document.querySelector(".confirm-btn");

  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    popup.classList.add("active");
    overlay.classList.add("active");
  });

  cancelBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    overlay.classList.remove("active");
  });

  confirmBtn.addEventListener("click", () => {
    fetch("/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          window.location.href = "../index.html";
        } else {
          alert("No se pudo cerrar sesión.");
        }
      })
      .catch(() => alert("Error en la comunicación con el servidor."));
  });
});


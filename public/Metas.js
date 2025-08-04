document.addEventListener("DOMContentLoaded", () => {
  const metasContainer = document.getElementById("metas-container");

  const popupMeta = document.getElementById("popup-meta");
  const popupMovimiento = document.getElementById("popup-movimiento");
  const overlay = document.getElementById("overlay");

  const inputNombre = document.getElementById("popup-nombre");
  const inputActual = document.getElementById("popup-actual");
  const inputMeta = document.getElementById("popup-meta-monto");
  const confirmBtn = document.querySelector(".confirm-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const deleteBtn = document.querySelector(".delete-btn");
  const popupTitle = document.getElementById("popup-meta-title");

  const inputCantidad = document.getElementById("popup-cantidad");
  const confirmMovBtn = document.querySelector(".confirm-mov-btn");
  const cancelMovBtn = document.querySelector(".cancel-mov-btn");
  const popupMovTitle = document.getElementById("popup-movimiento-title");

  let metas = [];
  let metaActual = null;
  let indexActual = null;
  let modoEdicion = false;
  let modoMovimiento = "";

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
          <button class="btn" onclick="abrirPopupMovimiento(${i}, 'ingreso')">➕ Ingreso</button>
          <button class="btn" onclick="abrirPopupMovimiento(${i}, 'retiro')">➖ Retiro</button>
        </div>
      `;
      metasContainer.appendChild(div);
    });
  }

  window.abrirPopupNuevaMeta = function () {
    modoEdicion = false;
    indexActual = null;
    popupTitle.textContent = "Agregar nueva meta";
    inputNombre.value = "";
    inputActual.value = "";
    inputMeta.value = "";
    deleteBtn.style.display = "none";
    popupMeta.classList.add("active");
    overlay.classList.add("active");
  };

  window.abrirPopupEditarMeta = function (index) {
    modoEdicion = true;
    indexActual = index;
    popupTitle.textContent = "Editar meta";
    const meta = metas[index];
    inputNombre.value = meta.nombre;
    inputActual.value = meta.actual;
    inputMeta.value = meta.meta;
    deleteBtn.style.display = "inline-block";
    popupMeta.classList.add("active");
    overlay.classList.add("active");
  };

  window.abrirPopupMovimiento = function (index, tipo) {
    indexActual = index;
    modoMovimiento = tipo;
    popupMovTitle.textContent = tipo === "ingreso" ? "Agregar dinero" : "Retirar dinero";
    inputCantidad.value = "";
    popupMovimiento.classList.add("active");
    overlay.classList.add("active");
  };

  cancelBtn.onclick = () => {
    popupMeta.classList.remove("active");
    overlay.classList.remove("active");
  };

  deleteBtn.onclick = async () => {
    if (confirm("¿Eliminar esta meta?")) {
      metas.splice(indexActual, 1);
      await guardarMetas();
      popupMeta.classList.remove("active");
      overlay.classList.remove("active");
      mostrarMetas();
    }
  };

  confirmBtn.onclick = async () => {
    const nombre = inputNombre.value.trim();
    const actual = parseFloat(inputActual.value);
    const meta = parseFloat(inputMeta.value);

    if (!nombre || isNaN(actual) || isNaN(meta) || actual < 0 || meta <= 0) {
      return alert("Completa todos los campos correctamente");
    }

    if (modoEdicion) {
      metas[indexActual].nombre = nombre;
      metas[indexActual].meta = meta;
    } else {
      metas.push({ nombre, actual, meta });
    }

    await guardarMetas();
    popupMeta.classList.remove("active");
    overlay.classList.remove("active");
    mostrarMetas();
  };

  cancelMovBtn.onclick = () => {
    popupMovimiento.classList.remove("active");
    overlay.classList.remove("active");
  };

  confirmMovBtn.onclick = async () => {
    const cantidad = parseFloat(inputCantidad.value);
    if (isNaN(cantidad) || cantidad <= 0) {
      return alert("Ingresa un monto válido");
    }

    if (modoMovimiento === "ingreso") {
      metas[indexActual].actual += cantidad;
    } else {
      if (cantidad > metas[indexActual].actual) {
        return alert("No puedes retirar más de lo que tienes ahorrado.");
      }
      metas[indexActual].actual -= cantidad;
    }

    await guardarMetas();
    popupMovimiento.classList.remove("active");
    overlay.classList.remove("active");
    mostrarMetas();
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
      metas = data.metas || [];
      mostrarMetas();
    });
});

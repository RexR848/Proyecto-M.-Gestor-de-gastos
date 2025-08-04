document.addEventListener("DOMContentLoaded", () => {
  const metasContainer = document.getElementById("metas-container");

  const overlay = document.getElementById("overlay");

  const metaPopup = document.getElementById("meta-popup");
  const movimientoPopup = document.getElementById("movimiento-popup");

  const inputNombre = document.getElementById("popup-nombre");
  const inputActual = document.getElementById("popup-actual");
  const inputMeta = document.getElementById("popup-meta");
  const metaPopupTitle = document.getElementById("meta-popup-title");

  const movimientoTitle = document.getElementById("movimiento-title");
  const inputCantidad = document.getElementById("popup-cantidad");

  const cancelBtn = document.querySelector(".cancel-btn");
  const confirmBtn = document.querySelector(".confirm-btn");
  const cancelMovBtn = document.querySelector(".cancel-mov-btn");
  const confirmMovBtn = document.querySelector(".confirm-mov-btn");

  let metas = [];
  let metaActual = null;
  let modoEdicion = false;
  let tipoMovimiento = null; //"ingreso" "retiro"

  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("open");
  };

  function mostrarMetas() {
    metasContainer.innerHTML = "";

    metas.forEach((m, i) => {
      const porcentaje = Math.min((m.actual / m.meta) * 100, 100).toFixed(1);

      const div = document.createElement("div");
      div.className = "gasto-box";
      div.innerHTML = `
        <div class="gasto-header">${m.nombre}</div>
        <p style="margin:8px 0;">💵 ${m.actual.toFixed(2)} / ${m.meta.toFixed(2)}</p>
        <div style="background:#444; border-radius:8px; overflow:hidden; margin: 8px 0;">
          <div style="width:${porcentaje}%; height:12px; background:#4aa3ff;"></div>
        </div>
        <div style="margin-top:10px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
          <button class="btn" onclick="abrirMovimiento(${i}, 'ingreso')">➕ Ingreso</button>
          <button class="btn" onclick="abrirMovimiento(${i}, 'retiro')">➖ Retiro</button>
          <button class="btn" onclick="abrirPopupEditarMeta(${i})">✏️ Editar</button>
        </div>
      `;
      metasContainer.appendChild(div);
    });
  }

  window.abrirPopupNuevaMeta = function () {
    modoEdicion = false;
    metaActual = null;
    metaPopupTitle.textContent = "Nueva meta";
    inputNombre.value = "";
    inputActual.value = "";
    inputMeta.value = "";
    metaPopup.classList.add("active");
    overlay.classList.add("active");
  };

  window.abrirPopupEditarMeta = function (index) {
    modoEdicion = true;
    metaActual = index;
    metaPopupTitle.textContent = "Editar meta";
    const meta = metas[index];
    inputNombre.value = meta.nombre;
    inputActual.value = meta.actual;
    inputMeta.value = meta.meta;
    metaPopup.classList.add("active");
    overlay.classList.add("active");

    //------------elimibnar
    if (!document.getElementById("delete-btn")) {
      const btn = document.createElement("button");
      btn.id = "delete-btn";
      btn.className = "btn";
      btn.textContent = "🗑 Eliminar";
      btn.onclick = () => eliminarMeta(index);
      metaPopup.querySelector(".popup-buttons").appendChild(btn);
    }
  };

  window.abrirMovimiento = function (index, tipo) {
    metaActual = index;
    tipoMovimiento = tipo;
    movimientoTitle.textContent = tipo === "ingreso" ? "Agregar dinero" : "Retirar dinero";
    inputCantidad.value = "";
    movimientoPopup.classList.add("active");
    overlay.classList.add("active");
  };

  function cerrarPopups() {
    metaPopup.classList.remove("active");
    movimientoPopup.classList.remove("active");
    overlay.classList.remove("active");
    const btn = document.getElementById("delete-btn");
    if (btn) btn.remove();
  }

  cancelBtn.onclick = cerrarPopups;
  cancelMovBtn.onclick = cerrarPopups;

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
    cerrarPopups();
    mostrarMetas();
  };

  confirmMovBtn.onclick = async () => {
    const cantidad = parseFloat(inputCantidad.value);
    if (isNaN(cantidad) || cantidad <= 0) return alert("Ingresa un monto válido");

    if (tipoMovimiento === "ingreso") {
      metas[metaActual].actual += cantidad;
    } else if (tipoMovimiento === "retiro") {
      metas[metaActual].actual -= cantidad;
      if (metas[metaActual].actual < 0) metas[metaActual].actual = 0;
    }

    await guardarMetas();
    cerrarPopups();
    mostrarMetas();
  };

  window.eliminarMeta = async function (index) {
    if (!confirm("¿Estás seguro de eliminar esta meta?")) return;
    metas.splice(index, 1);
    await guardarMetas();
    cerrarPopups();
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
      if (!res.ok || !result.ok) throw new Error(result.error || "Error");
    } catch (err) {
      alert("Error al guardar");
    }
  }

  fetch("/metas")
    .then(res => res.json())
    .then(data => {
      metas = data.metas;
      mostrarMetas();
    });
});

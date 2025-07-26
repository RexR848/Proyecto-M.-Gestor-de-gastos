document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formFinanzas");
  const modal = document.getElementById("modalNetbeans");
  const cerrarModal = document.getElementById("cerrarNetbeans");
  const listaErrores = document.getElementById("listaErroresNetbeans");

  // Modal cerrar
  cerrarModal.onclick = () => modal.style.display = "none";
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

  // Función para mostrar errores en el modal estilo NetBeans
  function mostrarErroresNetbeans(errores) {
    listaErrores.innerHTML = "";
    errores.forEach(err => {
      const li = document.createElement("li");
      li.textContent = err;
      listaErrores.appendChild(li);
    });
    modal.style.display = "block";
  }

  // Cargar datos existentes (opcional: desde backend)
  fetch('/datos')
    .then(res => res.json())
    .then(data => {
      if (data.ingreso) document.getElementById("ingreso").value = data.ingreso;
      data.gastosFijos?.forEach(g => agregarGasto('fijo', g.nombre, g.monto));
      data.gastosOpcionales?.forEach(g => agregarGasto('opcional', g.nombre, g.monto));
    });

  // Función para agregar un gasto
  window.agregarGasto = (tipo, nombre = "", monto = "") => {
    const container = tipo === "fijo" ? document.getElementById("gastos-fijos-container") : document.getElementById("gastos-opcionales-container");

    const div = document.createElement("div");
    div.className = "gasto-item";

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.placeholder = "Nombre";
    inputNombre.value = nombre;

    const inputMonto = document.createElement("input");
    inputMonto.type = "number";
    inputMonto.placeholder = "$0.00";
    inputMonto.step = "0.01";
    inputMonto.value = monto;

    const btnEliminar = document.createElement("button");
    btnEliminar.innerHTML = "🗑";
    btnEliminar.onclick = () => div.remove();

    div.append(inputNombre, inputMonto, btnEliminar);
    container.appendChild(div);
  };

  // Validación del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const errores = [];

    const ingreso = parseFloat(document.getElementById("ingreso").value);
    if (isNaN(ingreso) || ingreso < 0) {
      errores.push("El ingreso mensual debe ser un número mayor o igual a 0.");
    }

    const gastosFijos = [];
    document.querySelectorAll("#gastos-fijos-container .gasto-item").forEach(div => {
      const nombre = div.children[0].value.trim();
      const monto = parseFloat(div.children[1].value);
      if (!nombre) errores.push("Un gasto fijo no tiene nombre.");
      if (isNaN(monto) || monto < 0) errores.push(`El gasto fijo "${nombre || '[Sin nombre]'}" tiene un monto inválido.`);
      gastosFijos.push({ nombre, monto });
    });

    const gastosOpcionales = [];
    document.querySelectorAll("#gastos-opcionales-container .gasto-item").forEach(div => {
      const nombre = div.children[0].value.trim();
      const monto = parseFloat(div.children[1].value);
      if (!nombre) errores.push("Un gasto opcional no tiene nombre.");
      if (isNaN(monto) || monto < 0) errores.push(`El gasto opcional "${nombre || '[Sin nombre]'}" tiene un monto inválido.`);
      gastosOpcionales.push({ nombre, monto });
    });

    if (errores.length > 0) {
      mostrarErroresNetbeans(errores);
      return;
    }

    const datos = {
      ingreso,
      gastosFijos,
      gastosOpcionales
    };

    fetch("/guardar-datos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
    .then(res => res.ok ? location.reload() : res.json().then(data => mostrarErroresNetbeans([data.error || "Error al guardar datos."])))
    .catch(() => mostrarErroresNetbeans(["Error de conexión con el servidor."]));
  });
});

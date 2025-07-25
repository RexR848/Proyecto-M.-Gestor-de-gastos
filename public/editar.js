document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const modal = document.querySelector("#modalErrores");
  const listaErrores = document.querySelector("#listaErrores");

  const ingresoInput = document.querySelector("#ingreso");
  const contFijos = document.querySelector("#gastos-fijos-container");
  const contOpcionales = document.querySelector("#gastos-opcionales-container");

  // Cargar datos guardados localmente
  const datosGuardados = JSON.parse(localStorage.getItem("datosFinanzas"));
  if (datosGuardados) {
    ingresoInput.value = datosGuardados.ingreso || "";
    datosGuardados.gastosFijos?.forEach(gasto => agregarGasto("fijo", gasto));
    datosGuardados.gastosOpcionales?.forEach(gasto => agregarGasto("opcional", gasto));
  }

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const errores = [];
    const ingreso = ingresoInput.value.trim();

    if (!ingreso) {
      errores.push("💰 El ingreso mensual no puede estar vacío.");
    } else if (isNaN(ingreso)) {
      errores.push("💰 El ingreso mensual debe ser un número válido.");
    } else if (parseFloat(ingreso) <= 0) {
      errores.push("💰 El ingreso mensual debe ser mayor a 0.");
    }

    const gastosFijos = contFijos.querySelectorAll(".gasto-item");
    const gastosOpcionales = contOpcionales.querySelectorAll(".gasto-item");

    validarGastos(gastosFijos, errores, "fijos");
    validarGastos(gastosOpcionales, errores, "opcionales");

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    const data = {
      ingreso: parseFloat(ingreso),
      gastosFijos: obtenerGastos(gastosFijos),
      gastosOpcionales: obtenerGastos(gastosOpcionales),
    };

    // Guarda también en localStorage para mantener info
    localStorage.setItem("datosFinanzas", JSON.stringify(data));

    try {
      const res = await fetch("/guardar-datos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (res.ok) {
        window.location.href = "Finanzas.html";
      } else {
        mostrarErrores([result.error || "Error al guardar datos."]);
      }
    } catch (err) {
      mostrarErrores(["❌ Error de red: " + err.message]);
    }
  });

  window.agregarGasto = function (tipo, valores = {}) {
    const container = tipo === "fijo" ? contFijos : contOpcionales;
    const gastoItem = document.createElement("div");
    gastoItem.className = "gasto-item";
    gastoItem.innerHTML = `
      <input type="text" placeholder="Nombre" value="${valores.nombre || ""}" required />
      <input type="number" step="0.01" placeholder="$0.00" value="${valores.monto || ""}" required />
      <button type="button" onclick="this.parentElement.remove()">🗑</button>
    `;
    container.appendChild(gastoItem);
  };

  function validarGastos(lista, errores, tipo) {
    const nombres = [];

    lista.forEach((item, index) => {
      const nombreInput = item.querySelector('input[type="text"]');
      const montoInput = item.querySelector('input[type="number"]');

      const nombre = nombreInput?.value.trim();
      const monto = montoInput?.value.trim();
      const nombreLabel = nombre || `Gasto ${index + 1}`;

      if (!nombre) {
        errores.push(`📝 El nombre del gasto ${tipo} #${index + 1} no puede estar vacío.`);
      } else if (nombres.includes(nombre.toLowerCase())) {
        errores.push(`📝 El nombre "${nombre}" está duplicado en los gastos ${tipo}.`);
      } else {
        nombres.push(nombre.toLowerCase());
      }

      if (!monto) {
        errores.push(`💵 El monto de "${nombreLabel}" está vacío.`);
      } else if (isNaN(monto)) {
        errores.push(`💵 El monto de "${nombreLabel}" debe ser un número válido.`);
      } else if (parseFloat(monto) <= 0) {
        errores.push(`💵 El monto de "${nombreLabel}" debe ser mayor a 0.`);
      }
    });
  }

  function obtenerGastos(lista) {
    const gastos = [];
    lista.forEach(item => {
      const nombre = item.querySelector('input[type="text"]').value.trim();
      const monto = parseFloat(item.querySelector('input[type="number"]').value.trim());
      gastos.push({ nombre, monto });
    });
    return gastos;
  }

  function mostrarErrores(errores) {
    listaErrores.innerHTML = errores.map(err => `<li>${err}</li>`).join("");
    modal.style.display = "flex";
  }

  window.cerrarModal = function () {
    modal.style.display = "none";
  };
});

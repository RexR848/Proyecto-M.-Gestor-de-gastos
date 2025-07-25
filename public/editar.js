document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const modal = document.querySelector("#modalErrores");
  const listaErrores = document.querySelector("#listaErrores");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que recargue

    const errores = [];
    const ingresoInput = document.querySelector("#ingreso");
    const ingreso = ingresoInput.value.trim();

    if (!ingreso) {
      errores.push("💰 El ingreso mensual no puede estar vacío.");
    } else if (isNaN(ingreso)) {
      errores.push("💰 El ingreso mensual debe ser un número válido.");
    } else if (parseFloat(ingreso) <= 0) {
      errores.push("💰 El ingreso mensual debe ser mayor a 0.");
    }

    const gastosFijos = document.querySelectorAll("#gastos-fijos-container .gasto-item");
    const gastosOpcionales = document.querySelectorAll("#gastos-opcionales-container .gasto-item");

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

  // Validación para input decimal
  document.addEventListener("input", (e) => {
    if (e.target.matches('input[type="number"]')) {
      let valor = e.target.value;
      valor = valor.replace(/[^\d.]/g, '');
      const partes = valor.split('.');
      if (partes.length > 2) valor = partes[0] + '.' + partes[1];
      if (/^0\d+/.test(valor)) valor = valor.replace(/^0+/, '');
      if (valor === "0.") return;
      e.target.value = valor;
    }
  });
});

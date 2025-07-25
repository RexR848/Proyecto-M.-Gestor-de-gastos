document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");

  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // 👈 evitar recarga desde el inicio

    const errores = [];

    // Validar ingreso mensual
    const ingresoInput = document.querySelector("#ingreso");
    const ingreso = ingresoInput.value.trim();
    if (!ingreso) {
      errores.push("💰 El ingreso mensual no puede estar vacío.");
    } else if (isNaN(ingreso)) {
      errores.push("💰 El ingreso mensual debe ser un número válido.");
    } else if (parseFloat(ingreso) <= 0) {
      errores.push("💰 El ingreso mensual debe ser mayor a 0.");
    }

    // Validar gastos
    const gastosFijos = document.querySelectorAll("#gastos-fijos-container .gasto-item");
    const gastosOpcionales = document.querySelectorAll("#gastos-opcionales-container .gasto-item");
    validarGastos(gastosFijos, errores, "fijos");
    validarGastos(gastosOpcionales, errores, "opcionales");

    if (errores.length > 0) {
      mostrarErroresEmergentes(errores);
    } else {
      guardarDatos(); // 👈 Llama a la función global definida en editar.js
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

  function mostrarErroresEmergentes(errores) {
    const mensaje = "⚠️ Corrige los siguientes errores:\n\n" + errores.map(e => "- " + e).join("\n");
    alert(mensaje);
  }

  // Validación en tiempo real para input numérico
  document.addEventListener("input", (e) => {
    if (e.target.matches('input[type="number"]')) {
      let valor = e.target.value;

      // Solo números y un punto decimal
      valor = valor.replace(/[^\d.]/g, '');

      // Evitar más de un punto
      const partes = valor.split('.');
      if (partes.length > 2) {
        valor = partes[0] + '.' + partes[1];
      }

      // Quitar ceros innecesarios al inicio
      if (/^0\d+/.test(valor)) {
        valor = valor.replace(/^0+/, '');
      }

      // No dejar "0." solo
      if (valor === "0.") return;

      e.target.value = valor;
    }
  });
});

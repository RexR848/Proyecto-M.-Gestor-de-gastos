document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const ingresoInput = document.querySelector("#ingreso");

  formulario.addEventListener("submit", (e) => {
    const errores = [];

    // Validar ingreso mensual
    const ingreso = ingresoInput.value.trim();
    if (!ingreso) {
      errores.push("💰 El ingreso mensual no puede estar vacío.");
    } else if (isNaN(ingreso)) {
      errores.push("💰 El ingreso mensual debe ser un número válido.");
    } else if (parseFloat(ingreso) <= 0) {
      errores.push("💰 El ingreso mensual debe ser mayor a 0.");
    }

    // Validar gastos fijos
    const gastosFijos = document.querySelectorAll("#gastos-fijos-container .gasto-item");
    validarGastos(gastosFijos, errores, "fijos");

    // Validar gastos opcionales
    const gastosOpcionales = document.querySelectorAll("#gastos-opcionales-container .gasto-item");
    validarGastos(gastosOpcionales, errores, "opcionales");

    if (errores.length > 0) {
      e.preventDefault();
      alert("⚠️ Por favor corrige los siguientes errores:\n\n" + errores.join("\n"));
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

      // Validar nombre vacío
      if (!nombre) {
        errores.push(`📝 El nombre del gasto ${tipo} #${index + 1} no puede estar vacío.`);
      } else if (nombres.includes(nombre.toLowerCase())) {
        errores.push(`📝 El nombre "${nombre}" está duplicado en los gastos ${tipo}.`);
      } else {
        nombres.push(nombre.toLowerCase());
      }

      // Validar monto vacío o inválido
      if (!monto) {
        errores.push(`💵 El monto de "${nombreLabel}" está vacío.`);
      } else if (isNaN(monto)) {
        errores.push(`💵 El monto de "${nombreLabel}" debe ser un número válido.`);
      } else if (parseFloat(monto) <= 0) {
        errores.push(`💵 El monto de "${nombreLabel}" debe ser mayor a 0.`);
      }
    });
  }

  // ✅ Validación dinámica: bloquear caracteres inválidos y permitir ceros y decimales
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener('input', (e) => {
      const { value, selectionStart } = input;

      // Eliminar letras no válidas: e, E, +, - y letras
      let sanitized = value.replace(/[^0-9.]/g, "");

      // Evitar más de un punto decimal
      const parts = sanitized.split('.');
      if (parts.length > 2) {
        input.value = parts[0] + '.' + parts[1];
        input.setSelectionRange(selectionStart - 1, selectionStart - 1);
        return;
      }

      //Eliminar ceros innecesarios al inicio (excepto "0." y "0")
      if (/^0[0-9]/.test(sanitized)) {
        sanitized = sanitized.replace(/^0+/, '0');
      }

      //Permitir "0" y decimales como "0.5 no eliminar
      if (sanitized === "") {
        input.value = "";
        return;
      }

      input.value = sanitized;
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const ingresoInput = document.querySelector("#ingreso");
  const contenedorErrores = document.querySelector("#errores");

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

    // Mostrar errores si existen
    if (errores.length > 0) {
      e.preventDefault();
      contenedorErrores.innerHTML =
        "⚠️ Por favor corrige los siguientes errores:<ul>" +
        errores.map(error => `<li>${error}</li>`).join('') +
        "</ul>";
    } else {
      contenedorErrores.innerHTML = ""; // Limpiar errores
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

      // Validar nombre
      if (!nombre) {
        errores.push(`📝 El nombre del gasto ${tipo} #${index + 1} no puede estar vacío.`);
      } else if (nombres.includes(nombre.toLowerCase())) {
        errores.push(`📝 El nombre "${nombre}" está duplicado en los gastos ${tipo}.`);
      } else {
        nombres.push(nombre.toLowerCase());
      }

      // Validar monto
      if (!monto) {
        errores.push(`💵 El monto de "${nombreLabel}" está vacío.`);
      } else if (isNaN(monto)) {
        errores.push(`💵 El monto de "${nombreLabel}" debe ser un número válido.`);
      } else if (parseFloat(monto) <= 0) {
        errores.push(`💵 El monto de "${nombreLabel}" debe ser mayor a 0.`);
      }
    });
  }

  // ✨ Validación en tiempo real de inputs numéricos (evita letras, múltiples puntos y ceros incorrectos)
  document.addEventListener("input", (e) => {
    if (e.target.matches('input[type="number"]')) {
      let valor = e.target.value;

      // Solo números y un punto decimal permitido
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

      // Evitar que quede "0." sin nada más
      if (valor === "0.") return;

      e.target.value = valor;
    }
  });
});

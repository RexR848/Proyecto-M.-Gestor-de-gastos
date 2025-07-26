document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const modal = document.getElementById("modalNetbeans");
  const listaErrores = document.getElementById("listaErroresNetbeans");
  const cerrar = document.getElementById("cerrarNetbeans");

  // Función para mostrar errores en modal NetBeans
  function mostrarErroresNetbeans(errores) {
    listaErrores.innerHTML = errores.map(err => `<li>${err}</li>`).join("");
    modal.style.display = "block";
  }

  // Cerrar modal al hacer click en X
  cerrar.onclick = () => {
    modal.style.display = "none";
  };

  // Cerrar modal al hacer click fuera del contenido
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Función para validar gastos (nombre y monto)
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

  // Obtener gastos en formato para enviar
  function obtenerGastos(lista) {
    const gastos = [];
    lista.forEach(item => {
      const nombre = item.querySelector('input[type="text"]').value.trim();
      const monto = parseFloat(item.querySelector('input[type="number"]').value.trim());
      gastos.push({ nombre, monto });
    });
    return gastos;
  }

  // Evento submit del formulario
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

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
      mostrarErroresNetbeans(errores);
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
      if (res.ok && result.ok) {
        window.location.href = "Finanzas.html";
      } else {
        mostrarErroresNetbeans([result.error || "Error al guardar datos."]);
      }
    } catch (err) {
      mostrarErroresNetbeans(["❌ Error de red: " + err.message]);
    }
  });

  // Corrección para input decimal que no mueve cursor al escribir punto
  document.getElementById("ingreso").addEventListener("input", (e) => {
    let value = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Permitir solo números y un solo punto decimal
    let cleanValue = value.replace(/[^0-9.]/g, "");
    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      cleanValue = parts[0] + "." + parts[1];
    }

    if (cleanValue !== value) {
      e.target.value = cleanValue;
      // Restaurar cursor al lugar correcto
      const newPos = Math.min(cursorPos, cleanValue.length);
      e.target.setSelectionRange(newPos, newPos);
    }
  });
});

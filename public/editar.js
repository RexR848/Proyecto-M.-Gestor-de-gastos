document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const ingresoInput = document.getElementById("ingreso");

  // Función para agregar gasto (fijo u opcional)
  window.agregarGasto = function(tipo, nombre = "", monto = "") {
    const contenedorId = tipo === "fijo" ? "gastos-fijos-container" : "gastos-opcionales-container";
    const contenedor = document.getElementById(contenedorId);

    const gastoDiv = document.createElement("div");
    gastoDiv.className = "gasto-item";

    gastoDiv.innerHTML = `
      <input type="text" placeholder="Nombre del gasto" value="${nombre}" required />
      <input type="number" placeholder="Monto" step="0.01" min="0" value="${monto}" required />
      <button type="button" title="Eliminar gasto">×</button>
    `;

    // Botón eliminar
    gastoDiv.querySelector("button").addEventListener("click", () => {
      gastoDiv.remove();
    });

    contenedor.appendChild(gastoDiv);
  };

  // Cargar datos guardados al inicio
  async function cargarDatos() {
    try {
      const res = await fetch("/datos");
      if (!res.ok) throw new Error("No se pudieron obtener los datos");

      const data = await res.json();

      const datos = data.ok && data.datos ? data.datos : data;

      // INGRESO
      if (datos.ingreso !== undefined && datos.ingreso !== null) {
        ingresoInput.value = datos.ingreso;
      }

      // Limpiar contenedores antes de agregar para evitar duplicados
      const contFijos = document.getElementById("gastos-fijos-container");
      const contOpcionales = document.getElementById("gastos-opcionales-container");
      contFijos.innerHTML = "";
      contOpcionales.innerHTML = "";

      // Gastos fijos
      (datos.gastosFijos || []).forEach(g => {
        agregarGasto("fijo", g.nombre, g.monto);
      });

      // Gastos opcionales
      (datos.gastosOpcionales || []).forEach(g => {
        agregarGasto("opcional", g.nombre, g.monto);
      });

    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  }

  cargarDatos();

  // Funciones para mostrar y quitar mensajes de error debajo de inputs
  function mostrarError(input, mensaje) {
    quitarError(input);
    if (!mensaje) return;
    const error = document.createElement("div");
    error.className = "error-msg";
    error.style.color = "#ff4a4a";
    error.style.fontSize = "13px";
    error.style.marginTop = "4px";
    error.textContent = mensaje;
    input.insertAdjacentElement("afterend", error);
  }
  function quitarError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error-msg")) {
      next.remove();
    }
  }

  // Validar formulario completo
  function validarTodo() {
    let esValido = true;

    // Validar ingreso
    const ingresoVal = ingresoInput.value.trim();
    quitarError(ingresoInput);
    if (!ingresoVal) {
      mostrarError(ingresoInput, "💰 El ingreso mensual no puede estar vacío.");
      esValido = false;
    } else if (isNaN(ingresoVal)) {
      mostrarError(ingresoInput, "💰 El ingreso mensual debe ser un número válido.");
      esValido = false;
    } else if (parseFloat(ingresoVal) === 0) {
      mostrarError(ingresoInput, "💰 El ingreso mensual NO puede ser 0.");
      esValido = false;
    } else if (parseFloat(ingresoVal) < 0) {
      mostrarError(ingresoInput, "💰 El ingreso mensual debe ser mayor a 0.");
      esValido = false;
    }

    // Validar gastos
    function validarGastos(contenedorId, tipo) {
      const nombres = [];
      const gastos = document.querySelectorAll(`#${contenedorId} .gasto-item`);
      gastos.forEach((gasto, i) => {
        const nombreInput = gasto.querySelector('input[type="text"]');
        const montoInput = gasto.querySelector('input[type="number"]');

        quitarError(nombreInput);
        quitarError(montoInput);

        const nombre = nombreInput.value.trim();
        const monto = montoInput.value.trim();

        if (!nombre) {
          mostrarError(nombreInput, `📝 El nombre del gasto ${tipo} #${i + 1} no puede estar vacío.`);
          esValido = false;
        } else if (nombres.includes(nombre.toLowerCase())) {
          mostrarError(nombreInput, `📝 El nombre "${nombre}" está duplicado en gastos ${tipo}.`);
          esValido = false;
        } else {
          nombres.push(nombre.toLowerCase());
        }

        if (monto === "") {
          mostrarError(montoInput, `💵 El monto del gasto ${tipo} #${i + 1} no puede estar vacío.`);
          esValido = false;
        } else if (isNaN(monto)) {
          mostrarError(montoInput, `💵 El monto del gasto ${tipo} #${i + 1} debe ser un número válido.`);
          esValido = false;
        } else if (parseFloat(monto) === 0) {
          mostrarError(montoInput, `💵 El monto del gasto ${tipo} #${i + 1} NO puede ser 0.`);
          esValido = false;
        } else if (parseFloat(monto) < 0) {
          mostrarError(montoInput, `💵 El monto del gasto ${tipo} #${i + 1} debe ser mayor a 0.`);
          esValido = false;
        }
      });
    }

    validarGastos("gastos-fijos-container", "fijos");
    validarGastos("gastos-opcionales-container", "opcionales");

    return esValido;
  }

  // Obtener datos del formulario para enviar
  function obtenerGastos(contenedorId) {
    const gastos = [];
    document.querySelectorAll(`#${contenedorId} .gasto-item`).forEach(item => {
      const nombre = item.querySelector('input[type="text"]').value.trim();
      const monto = parseFloat(item.querySelector('input[type="number"]').value.trim());
      gastos.push({ nombre, monto });
    });
    return gastos;
  }

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    document.querySelectorAll(".error-msg").forEach(e => e.remove());

    if (!validarTodo()) {
      // No continuar si hay errores
      return;
    }

    const data = {
      ingreso: parseFloat(ingresoInput.value.trim()),
      gastosFijos: obtenerGastos("gastos-fijos-container"),
      gastosOpcionales: obtenerGastos("gastos-opcionales-container"),
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
        alert(result.error || "Error al guardar datos.");
      }
    } catch (err) {
      alert("❌ Error de red: " + err.message);
    }
  });

  // Listener para que el cursor en el input de ingreso funcione bien al escribir puntos
  ingresoInput.addEventListener("input", (e) => {
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

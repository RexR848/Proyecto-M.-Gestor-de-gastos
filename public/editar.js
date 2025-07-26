document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const modal = document.querySelector("#modalErrores");
  const listaErrores = document.querySelector("#listaErrores");

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
      if (!data.ok) throw new Error("Respuesta inválida del servidor");

      // INGRESO - asignarlo sin borrarlo al volver a editar
      if (data.datos.ingreso !== undefined && data.datos.ingreso !== null) {
        document.getElementById("ingreso").value = data.datos.ingreso;
      }

      // Limpiar contenedores antes de agregar para evitar duplicados al recargar
      const contFijos = document.getElementById("gastos-fijos-container");
      const contOpcionales = document.getElementById("gastos-opcionales-container");
      contFijos.innerHTML = "";
      contOpcionales.innerHTML = "";

      // Gastos fijos
      (data.datos.gastosFijos || []).forEach(g => {
        agregarGasto("fijo", g.nombre, g.monto);
      });

      // Gastos opcionales
      (data.datos.gastosOpcionales || []).forEach(g => {
        agregarGasto("opcional", g.nombre, g.monto);
      });

    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  }

  cargarDatos();

  // Validaciones (igual que antes)
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

  // Mostrar errores en tu modal original
  function mostrarErrores(errores) {
    listaErrores.innerHTML = errores.map(err => `<li>${err}</li>`).join("");
    modal.style.display = "flex";
  }

  // Función para cerrar modal llamada desde HTML (ejemplo en un botón X)
  window.cerrarModal = function () {
    modal.style.display = "none";
  };

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
      if (res.ok && result.ok) {
        window.location.href = "Finanzas.html";
      } else {
        mostrarErrores([result.error || "Error al guardar datos."]);
      }
    } catch (err) {
      mostrarErrores(["❌ Error de red: " + err.message]);
    }
  });

  // Listener para que el cursor en el input de ingreso funcione bien al escribir puntos
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

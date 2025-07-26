document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const ingresoInput = document.querySelector("#ingreso");

  // Función para mostrar o quitar mensaje de error debajo de un input
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
      validarTodo();
    });

    // Validación en tiempo real para los inputs de gasto
    const [nombreInput, montoInput] = gastoDiv.querySelectorAll("input");
    nombreInput.addEventListener("input", validarTodo);
    montoInput.addEventListener("input", validarTodo);

    contenedor.appendChild(gastoDiv);
  };

  // Cargar datos guardados al inicio
  async function cargarDatos() {
    try {
      const res = await fetch("/datos");
      if (!res.ok) throw new Error("No se pudieron obtener los datos");

      const data = await res.json();
      const datos = data.ok && data.datos ? data.datos : data;

      // Asignar ingreso sin borrar gastos
      if (datos.ingreso !== undefined && datos.ingreso !== null) {
        ingresoInput.value = datos.ingreso;
      }

      // Limpiar contenedores para evitar duplicados
      document.getElementById("gastos-fijos-container").innerHTML = "";
      document.getElementById("gastos-opcionales-container").innerHTML = "";

      (datos.gastosFijos || []).forEach(g => agregarGasto("fijo", g.nombre, g.monto));
      (datos.gastosOpcionales || []).forEach(g => agregarGasto("opcional", g.nombre, g.monto));

      validarTodo();

    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  }

  cargarDatos();

  // Validar todo el formulario y mostrar errores inline
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
    } else if (parseFloat(ingresoVal) <= 0) {
      mostrarError(ingresoInput, "💰 El ingreso mensual debe ser mayor a 0.");
      esValido = false;
    }

    // Función para validar gastos
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

        if (!monto) {
          mostrarError(montoInput, `💵 El monto del gasto ${tipo} #${i + 1} no puede estar vacío.`);
          esValido = false;
        } else if (isNaN(monto)) {
          mostrarError(montoInput, `💵 El monto del gasto ${tipo} #${i + 1} debe ser un número válido.`);
          esValido = false;
        } else if (parseFloat(monto) <= 0) {
          mostrarError(montoInput, `💵 El monto del gasto ${tipo} #${i + 1} debe ser mayor a 0.`);
          esValido = false;
        }
      });
    }

    validarGastos("gastos-fijos-container", "fijos");
    validarGastos("gastos-opcionales-container", "opcionales");

    return esValido;
  }

  // Validación en tiempo real para ingreso
  ingresoInput.addEventListener("input", () => {
    // Solo permitir números y un punto decimal
    let val = ingresoInput.value;
    val = val.replace(/[^0-9.]/g, "");
    const partes = val.split(".");
    if (partes.length > 2) {
      val = partes[0] + "." + partes[1];
    }
    ingresoInput.value = val;
    validarTodo();
  });

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validarTodo()) return;

    const ingreso = parseFloat(ingresoInput.value.trim());
    const gastosFijos = [];
    const gastosOpcionales = [];

    document.querySelectorAll("#gastos-fijos-container .gasto-item").forEach(div => {
      gastosFijos.push({
        nombre: div.querySelector('input[type="text"]').value.trim(),
        monto: parseFloat(div.querySelector('input[type="number"]').value.trim())
      });
    });

    document.querySelectorAll("#gastos-opcionales-container .gasto-item").forEach(div => {
      gastosOpcionales.push({
        nombre: div.querySelector('input[type="text"]').value.trim(),
        monto: parseFloat(div.querySelector('input[type="number"]').value.trim())
      });
    });

    const data = { ingreso, gastosFijos, gastosOpcionales };

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
      alert("Error de red: " + err.message);
    }
  });

});

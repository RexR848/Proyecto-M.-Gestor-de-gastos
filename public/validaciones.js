document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formFinanzas");
  const ingresoInput = document.querySelector("#ingreso");

  formulario.addEventListener("submit", (e) => {
    const errores = [];

    const ingreso = ingresoInput.value.trim();
    if (!ingreso) {
      errores.push("💰 El ingreso mensual no puede estar vacío.");
    } else if (isNaN(ingreso)) {
      errores.push("💰 El ingreso mensual debe ser un número válido.");
    } else if (parseFloat(ingreso) <= 0) {
      errores.push("💰 El ingreso mensual debe ser mayor a 0.");
    }

    const gastosFijos = document.querySelectorAll("#gastos-fijos-container .gasto-item");
    validarGastos(gastosFijos, errores, "fijos");

    const gastosOpcionales = document.querySelectorAll("#gastos-opcionales-container .gasto-item");
    validarGastos(gastosOpcionales, errores, "opcionales");

    if (errores.length > 0) {
      e.preventDefault();
      mostrarErroresEmergentes(errores);
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

  // ✅ Corrige el input para permitir números con decimales correctamente
  document.addEventListener("input", (e) => {
    if (e.target.matches('input[type="number"]')) {
      let valor = e.target.value;

      // Permitir solo dígitos y punto decimal
      valor = valor.replace(/[^\d.]/g, '');

      // Evitar múltiples puntos decimales
      const partes = valor.split('.');
      if (partes.length > 2) {
        valor = partes[0] + '.' + partes[1];
      }

      // Evitar ceros innecesarios como "00", pero permitir "0." y ".5"
      if (valor.startsWith('0') && !valor.startsWith('0.') && valor.length > 1) {
        valor = valor.replace(/^0+/, '');
      }

      e.target.value = valor;
    }
  });

  // 🧱 Mostrar errores en un cuadro emergente flotante
  function mostrarErroresEmergentes(errores) {
    let modal = document.querySelector(".modal-errores");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal-errores";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-contenido">
        <h3>⚠️ Por favor corrige los siguientes errores:</h3>
        <ul>${errores.map(error => `<li>${error}</li>`).join('')}</ul>
        <button id="cerrarModal">Cerrar</button>
      </div>
    `;

    modal.style.display = "flex";

    document.querySelector("#cerrarModal").onclick = () => {
      modal.style.display = "none";
    };
  }
});

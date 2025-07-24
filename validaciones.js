document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formulario-gasto");
  const nombreInput = document.querySelector("#nombre-gasto");
  const montoInput = document.querySelector("#monto-gasto");
  const listaNombres = [];

  formulario.addEventListener("submit", (e) => {
    const nombre = nombreInput.value.trim();
    const monto = montoInput.value.trim();

    // Validación de campos vacíos
    if (!nombre || !monto) {
      e.preventDefault();
      alert("Todos los campos son obligatorios.");
      return;
    }

    // Validación de nombres duplicados
    if (listaNombres.includes(nombre.toLowerCase())) {
      e.preventDefault();
      alert("Este gasto ya ha sido registrado.");
      return;
    }

    // Guardar nombre para evitar duplicados
    listaNombres.push(nombre.toLowerCase());
  });
});
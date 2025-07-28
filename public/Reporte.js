document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/datos");
    if (!res.ok) throw new Error("No se pudieron obtener los datos");

    const data = await res.json();
    const datos = data.ok && data.datos ? data.datos : data;

    const ingreso = parseFloat(datos.ingreso) || 0;
    const gastosFijos = datos.gastosFijos || [];
    const gastosOpcionales = datos.gastosOpcionales || [];

    // Calcular gasto más alto (entre fijos y opcionales)
    const todosGastos = [...gastosFijos, ...gastosOpcionales];
    let gastoMasAlto = { nombre: "Ninguno", monto: 0 };
    todosGastos.forEach(g => {
      const monto = parseFloat(g.monto) || 0;
      if (monto > gastoMasAlto.monto) {
        gastoMasAlto = g;
      }
    });

    // Calcular ahorro estimado
    const sumaGastosFijos = gastosFijos.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
    const sumaGastosOpcionales = gastosOpcionales.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
    const ahorroEstimado =(sumaGastosFijos + sumaGastosOpcionales) - ingreso;

    // Actualizar DOM
    const gastoMasAltoElem = document.getElementById("gasto-mas-alto");
    const ahorroEstimadoElem = document.getElementById("ahorro-estimado");

    gastoMasAltoElem.textContent = `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${gastoMasAlto.monto.toFixed(2)})`;
    ahorroEstimadoElem.textContent = `AHORRO ESTIMADO: $${ahorroEstimado.toFixed(2)}`;

  } catch (error) {
    console.error("Error cargando datos destacados:", error);
  }
});
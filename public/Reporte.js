document.addEventListener("DOMContentLoaded", async () => {
  const gastoMasAltoElem = document.getElementById("gasto-mas-alto");
  const ahorroEstimadoElem = document.getElementById("ahorro-estimado");

  try {
    const res = await fetch("/datos");
    if (!res.ok) throw new Error("No se pudieron obtener los datos");

    const data = await res.json();
    const datos = data.ok && data.datos ? data.datos : data;

    // Calcular gasto más alto
    let gastoMasAlto = { nombre: "", monto: 0 };
    const gastosTotales = [...(datos.gastosFijos || []), ...(datos.gastosOpcionales || [])];
    gastosTotales.forEach(gasto => {
      if (gasto.monto > gastoMasAlto.monto) {
        gastoMasAlto = gasto;
      }
    });

    if (gastoMasAlto.nombre && gastoMasAlto.monto) {
      gastoMasAltoElem.textContent = `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${gastoMasAlto.monto.toFixed(2)})`;
    } else {
      gastoMasAltoElem.textContent = "No hay gastos registrados.";
    }

    // Mostrar ahorro estimado (si existe)
    if (datos.ahorroEstimado !== undefined) {
      ahorroEstimadoElem.textContent = `AHORRO ESTIMADO: $${datos.ahorroEstimado.toFixed(2)}`;
    } else {
      ahorroEstimadoElem.textContent = "No hay datos de ahorro estimado.";
    }
  } catch (err) {
    gastoMasAltoElem.textContent = "Error al cargar gasto más alto.";
    ahorroEstimadoElem.textContent = "Error al cargar ahorro estimado.";
    console.error(err);
  }
});

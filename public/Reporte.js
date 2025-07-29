document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/datos");
    if (!res.ok) throw new Error("No se pudieron obtener los datos");

    const data = await res.json();
    const datos = data.ok && data.datos ? data.datos : data;

    const ingreso = parseFloat(datos.ingreso) || 0;
    const gastosFijos = datos.gastosFijos || [];
    const gastosOpcionales = datos.gastosOpcionales || [];

    
    const todosGastos = [...gastosFijos, ...gastosOpcionales];
    let gastoMasAlto = { nombre: "Ninguno", monto: 0 };
    todosGastos.forEach(g => {
      const monto = parseFloat(g.monto) || 0;
      if (monto > gastoMasAlto.monto) {
        gastoMasAlto = g;
      }
    });

    const sumaGastosFijos = gastosFijos.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
    const sumaGastosOpcionales = gastosOpcionales.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
    const ahorroEstimado = ingreso - (sumaGastosFijos + sumaGastosOpcionales);

    document.getElementById("gasto-mas-alto").textContent = `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${gastoMasAlto.monto.toFixed(2)})`;
    document.getElementById("ahorro-estimado").textContent = `AHORRO ESTIMADO: $${ahorroEstimado.toFixed(2)}`;

    // --- Aquí empieza la gráfica de pastel ---
    const ctx = document.getElementById("grafica-pastel").getContext("2d");
    const totalGastos = sumaGastosFijos + sumaGastosOpcionales;
    const porcentajeFijos = totalGastos === 0 ? 0 : (sumaGastosFijos / totalGastos) * 100;
    const porcentajeOpcionales = totalGastos === 0 ? 0 : (sumaGastosOpcionales / totalGastos) * 100;

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Gastos fijos", "Gastos opcionales"],
        datasets: [{
          data: [porcentajeFijos.toFixed(2), porcentajeOpcionales.toFixed(2)],
          backgroundColor: ["#4aa3ff", "#ff6f61"],
          hoverOffset: 10,
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ": " + context.parsed + "%";
              }
            }
          },
          legend: {
            position: "bottom",
            labels: {
              color: "#fff",
              font: { size: 14 }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error cargando datos destacados y gráfica:", error);
  }
});

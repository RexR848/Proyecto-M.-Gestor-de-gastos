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

    const sumaFijos = gastosFijos.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
    const sumaOpcionales = gastosOpcionales.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
    const ahorroEstimado = ingreso - (sumaFijos + sumaOpcionales);

    document.getElementById("gasto-mas-alto").textContent =
      `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${gastoMasAlto.monto.toFixed(2)})`;

    document.getElementById("ahorro-estimado").textContent =
      `AHORRO ESTIMADO: $${ahorroEstimado.toFixed(2)}`;

    const ctxPastel = document.getElementById("grafica-pastel").getContext("2d");
    const totalGastos = sumaFijos + sumaOpcionales;
    const porcentajeFijos = totalGastos === 0 ? 0 : (sumaFijos / totalGastos) * 100;
    const porcentajeOpcionales = totalGastos === 0 ? 0 : (sumaOpcionales / totalGastos) * 100;

    new Chart(ctxPastel, {
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
              label: ctx => `${ctx.label}: ${ctx.parsed}%`
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

    // ========== GRÁFICAS DE BARRAS ==========
    const ctxFijos = document.getElementById("grafica-barras-fijos").getContext("2d");
    const ctxOpcionales = document.getElementById("grafica-barras-opcionales").getContext("2d");
    const ctxCombinada = document.getElementById("grafica-barras-combinada").getContext("2d");

    const labelsFijos = gastosFijos.map(g => g.nombre);
    const dataFijos = gastosFijos.map(g => parseFloat(g.monto) || 0);

    const labelsOpcionales = gastosOpcionales.map(g => g.nombre);
    const dataOpcionales = gastosOpcionales.map(g => parseFloat(g.monto) || 0);

    const graficaFijos = new Chart(ctxFijos, {
      type: "bar",
      data: {
        labels: labelsFijos,
        datasets: [{
          label: "Gastos fijos",
          data: dataFijos,
          backgroundColor: "#4aa3ff"
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: "#fff" } },
          y: { ticks: { color: "#fff" } }
        }
      }
    });

    const graficaOpcionales = new Chart(ctxOpcionales, {
      type: "bar",
      data: {
        labels: labelsOpcionales,
        datasets: [{
          label: "Gastos opcionales",
          data: dataOpcionales,
          backgroundColor: "#ff6f61"
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: "#fff" } },
          y: { ticks: { color: "#fff" } }
        }
      }
    });

    const labelsCombinada = [...labelsFijos, ...labelsOpcionales];
    const dataCombinada = [...dataFijos, ...dataOpcionales];
    const coloresCombinada = [...dataFijos.map(() => "#4aa3ff"), ...dataOpcionales.map(() => "#ff6f61")];

    const graficaCombinada = new Chart(ctxCombinada, {
      type: "bar",
      data: {
        labels: labelsCombinada,
        datasets: [{
          label: "Gastos combinados",
          data: dataCombinada,
          backgroundColor: coloresCombinada
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: "#fff" } },
          y: { ticks: { color: "#fff" } }
        }
      }
    });

    const btnAlternar = document.getElementById("alternar-vista");
    const canvasFijos = document.getElementById("grafica-barras-fijos");
    const canvasOpcionales = document.getElementById("grafica-barras-opcionales");
    const canvasCombinada = document.getElementById("grafica-barras-combinada");

    let vistaSeparada = true;

    btnAlternar.addEventListener("click", () => {
      vistaSeparada = !vistaSeparada;

      if (vistaSeparada) {
        canvasFijos.style.display = "block";
        canvasOpcionales.style.display = "block";
        canvasCombinada.style.display = "none";
        btnAlternar.textContent = "Ver gráfica combinada";
      } else {
        canvasFijos.style.display = "none";
        canvasOpcionales.style.display = "none";
        canvasCombinada.style.display = "block";
        btnAlternar.textContent = "Ver gráficas separadas";
      }
    });

  } catch (error) {
    console.error("Error cargando datos:", error);
  }
});

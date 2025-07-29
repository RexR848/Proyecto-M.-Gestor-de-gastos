document.addEventListener("DOMContentLoaded", async () => {
  const gastoMasAltoElem = document.getElementById("gasto-mas-alto");
  const ahorroEstimadoElem = document.getElementById("ahorro-estimado");
  const toggleBtn = document.getElementById("toggleVistaBtn");
  const graficaFijos = document.getElementById("graficaFijos");
  const graficaOpcionales = document.getElementById("graficaOpcionales");
  const graficaCombinada = document.getElementById("graficaCombinadaCanvas");

  let vistaCombinada = false;
  let chartFijos, chartOpcionales, chartCombinado;

  const response = await fetch("/datos");
  const datos = await response.json();

  const ingreso = datos.ingreso || 0;
  const gastosFijos = datos.gastosFijos || [];
  const gastosOpcionales = datos.gastosOpcionales || [];

  // Fase 1
  const todosLosGastos = [...gastosFijos, ...gastosOpcionales];
  const gastoMax = todosLosGastos.reduce((max, g) => g.monto > max ? g.monto : max, 0);
  const totalGastos = todosLosGastos.reduce((acc, g) => acc + g.monto, 0);
  const ahorroEstimado = ingreso - totalGastos;

  gastoMasAltoElem.textContent = `🔝 Gasto más alto: $${gastoMax.toFixed(2)}`;
  ahorroEstimadoElem.textContent = `💸 Ahorro estimado: $${ahorroEstimado.toFixed(2)}`;

  // Fase 2 - pastel
  const totalFijos = gastosFijos.reduce((acc, g) => acc + g.monto, 0);
  const totalOpcionales = gastosOpcionales.reduce((acc, g) => acc + g.monto, 0);

  new Chart(document.getElementById("graficaPastel"), {
    type: "pie",
    data: {
      labels: ["Gastos fijos", "Gastos opcionales"],
      datasets: [{
        data: [totalFijos, totalOpcionales],
        backgroundColor: ["#3498db", "#e67e22"],
      }],
    },
  });

  // Fase 3 - gráficas de barras
  function crearGraficaBarras(canvas, datos, color) {
    return new Chart(canvas, {
      type: "bar",
      data: {
        labels: datos.map(g => g.nombre),
        datasets: [{
          label: "Monto",
          data: datos.map(g => g.monto),
          backgroundColor: color,
        }],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: '#fff'
            }
          },
          y: {
            ticks: {
              color: '#fff'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff'
            }
          }
        }
      }
    });
  }

  chartFijos = crearGraficaBarras(graficaFijos, gastosFijos, "#3498db");
  chartOpcionales = crearGraficaBarras(graficaOpcionales, gastosOpcionales, "#e67e22");

  function crearGraficaCombinada() {
    return new Chart(graficaCombinada, {
      type: "bar",
      data: {
        labels: todosLosGastos.map(g => g.nombre),
        datasets: [{
          label: "Monto",
          data: todosLosGastos.map(g => g.monto),
          backgroundColor: todosLosGastos.map(g =>
            gastosFijos.includes(g) ? "#3498db" : "#e67e22"
          ),
        }],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: { beginAtZero: true, ticks: { color: '#fff' } },
          y: { ticks: { color: '#fff' } },
        },
        plugins: {
          legend: {
            labels: { color: '#fff' }
          }
        }
      }
    });
  }

  toggleBtn.addEventListener("click", () => {
    vistaCombinada = !vistaCombinada;
    document.getElementById("graficaIndividual").style.display = vistaCombinada ? "none" : "block";
    document.getElementById("graficaCombinada").style.display = vistaCombinada ? "block" : "none";

    if (vistaCombinada && !chartCombinado) {
      chartCombinado = crearGraficaCombinada();
    }
  });
});

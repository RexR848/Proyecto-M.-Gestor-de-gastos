document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/datos");
  const data = await res.json();
  const datos = data.ok && data.datos ? data.datos : data;

  const ingreso = parseFloat(datos.ingreso) || 0;
  const gastosFijos = datos.gastosFijos || [];
  const gastosOpcionales = datos.gastosOpcionales || [];

  const gastoMasAlto = [...gastosFijos, ...gastosOpcionales].reduce((max, g) =>
    parseFloat(g.monto) > parseFloat(max.monto || 0) ? g : max,
    { nombre: "Ninguno", monto: 0 }
  );

  const sumaFijos = gastosFijos.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
  const sumaOpcionales = gastosOpcionales.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
  const ahorroEstimado = ingreso - (sumaFijos + sumaOpcionales);

  // DATOS DESTACADOS
  document.getElementById("gasto-mas-alto").textContent =
    `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${parseFloat(gastoMasAlto.monto).toFixed(2)})`;

  if (ahorroEstimado < 0) {
    document.getElementById("ahorro-estimado").textContent =
      "⚠️ Debido a que usted tiene gastos que superan su ingreso, no se puede calcular el ahorro estimado.\nLe recomendamos que considere reducir sus gastos opcionales.";
    document.getElementById("ahorro-estimado").style.color = "red";
  } else {
    document.getElementById("ahorro-estimado").textContent =
      `AHORRO ESTIMADO: $${ahorroEstimado.toFixed(2)}`;
  }

  // GRÁFICA DE PASTEL
  const pastelCanvas = document.getElementById("grafica-pastel");
  new Chart(pastelCanvas, {
    type: "pie",
    data: {
      labels: ["Gastos fijos", "Gastos opcionales"],
      datasets: [{
        data: [sumaFijos, sumaOpcionales],
        backgroundColor: ["#3498db", "#9b59b6"],
      }],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const value = ctx.parsed;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${ctx.label}: $${value} (${percentage}%)`;
            }
          }
        },
        legend: {
          labels: {
            color: "#ffffff"
          }
        }
      }
    }
  });

  // GRÁFICAS DE BARRAS
  const labelsFijos = gastosFijos.map(g => g.nombre);
  const dataFijos = gastosFijos.map(g => parseFloat(g.monto));
  const labelsOpcionales = gastosOpcionales.map(g => g.nombre);
  const dataOpcionales = gastosOpcionales.map(g => parseFloat(g.monto));

  const barrasCanvas = document.getElementById("grafica-barras").getContext("2d");
  const graficaBarras = new Chart(barrasCanvas, {
    type: "bar",
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      },
      scales: {
        x: { ticks: { color: "#fff" }, grid: { color: "#555" } },
        y: { ticks: { color: "#fff" }, grid: { color: "#555" } }
      }
    }
  });

  let vistaSeparada = true;

  function actualizarGrafica() {
    if (vistaSeparada) {
      graficaBarras.data.labels = [...labelsFijos, ...labelsOpcionales];
      graficaBarras.data.datasets = [
        {
          label: "Gastos fijos",
          data: [...dataFijos, ...new Array(labelsOpcionales.length).fill(0)],
          backgroundColor: "#3498db"
        },
        {
          label: "Gastos opcionales",
          data: [...new Array(labelsFijos.length).fill(0), ...dataOpcionales],
          backgroundColor: "#9b59b6"
        }
      ];
    } else {
      const labelsCombinadas = [...labelsFijos, ...labelsOpcionales];
      const dataCombinada = [...dataFijos, ...dataOpcionales];
      graficaBarras.data.labels = labelsCombinadas;
      graficaBarras.data.datasets = [
        {
          label: "Gastos combinados",
          data: dataCombinada,
          backgroundColor: labelsCombinadas.map((_, i) => i < dataFijos.length ? "#3498db" : "#9b59b6")
        }
      ];
    }

    graficaBarras.update();
  }

  actualizarGrafica();

  // BOTÓN DE TOGGLE
  const toggleBtn = document.getElementById("toggle-btn");
  toggleBtn.addEventListener("click", () => {
    vistaSeparada = !vistaSeparada;
    toggleBtn.textContent = vistaSeparada
      ? "🔁 Ver gráfica combinada"
      : "🔁 Ver gráficas separadas";
    actualizarGrafica();
  });
});
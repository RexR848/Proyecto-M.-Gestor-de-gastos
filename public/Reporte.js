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

    if (ahorroEstimado < 0) {
      document.getElementById("gasto-mas-alto").textContent =
        `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${gastoMasAlto.monto.toFixed(2)})`;
      document.getElementById("ahorro-estimado").innerHTML =
        "⚠️ Debido a que usted tiene gastos que superan su ingreso, no se puede calcular el ahorro estimado.<br>Le recomendamos que considere reducir sus gastos opcionales.";
      document.getElementById("ahorro-estimado").style.color = "red";
    } else {
      document.getElementById("gasto-mas-alto").textContent =
        `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${gastoMasAlto.monto.toFixed(2)})`;
      document.getElementById("ahorro-estimado").textContent =
        `AHORRO ESTIMADO: $${ahorroEstimado.toFixed(2)}`;
      document.getElementById("ahorro-estimado").style.color = "#ffffff";
    }

    generarGraficaPastel(gastosFijos, gastosOpcionales);
    generarGraficaBarras(gastosFijos, gastosOpcionales);
    generarGraficaLineas(); // Solo llamada. Implementa si deseas la funcionalidad.
  } catch (error) {
    console.error("Error al cargar reportes:", error);
  }
});

function generarGraficaPastel(fijos, opcionales) {
  const totalFijos = fijos.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);
  const totalOpcionales = opcionales.reduce((acc, g) => acc + (parseFloat(g.monto) || 0), 0);

  new Chart(document.getElementById("grafica-pastel"), {
    type: "pie",
    data: {
      labels: ["Fijos", "Opcionales"],
      datasets: [{
        data: [totalFijos, totalOpcionales],
        backgroundColor: ["#3498db", "#e67e22"]
      }]
    }
  });
}

function generarGraficaBarras(fijos, opcionales) {
  const labelsFijos = fijos.map(g => g.nombre);
  const dataFijos = fijos.map(g => parseFloat(g.monto) || 0);

  const labelsOpc = opcionales.map(g => g.nombre);
  const dataOpc = opcionales.map(g => parseFloat(g.monto) || 0);

  new Chart(document.getElementById("grafica-barras-fijos"), {
    type: "bar",
    data: {
      labels: labelsFijos,
      datasets: [{
        label: "Fijos",
        data: dataFijos,
        backgroundColor: "#3498db"
      }]
    },
    options: { indexAxis: "y" }
  });

  new Chart(document.getElementById("grafica-barras-opcionales"), {
    type: "bar",
    data: {
      labels: labelsOpc,
      datasets: [{
        label: "Opcionales",
        data: dataOpc,
        backgroundColor: "#e67e22"
      }]
    },
    options: { indexAxis: "y" }
  });

  const allLabels = [...labelsFijos, ...labelsOpc];
  const allData = [...dataFijos, ...dataOpc];
  const backgroundColors = [
    ...Array(dataFijos.length).fill("#3498db"),
    ...Array(dataOpc.length).fill("#e67e22")
  ];

  new Chart(document.getElementById("grafica-barras-combinada"), {
    type: "bar",
    data: {
      labels: allLabels,
      datasets: [{
        label: "Gastos",
        data: allData,
        backgroundColor: backgroundColors
      }]
    },
    options: { indexAxis: "y" }
  });

  document.getElementById("leyenda-barras").innerHTML = `
    <span style="color:#3498db">■ Fijos</span> &nbsp;
    <span style="color:#e67e22">■ Opcionales</span>
  `;
}

function generarGraficaLineas() {
  // Puedes implementarla después
}

const btnToggle = document.getElementById("toggle-btn");
btnToggle.addEventListener("click", () => {
  const fijos = document.getElementById("grafica-barras-fijos-container");
  const opc = document.getElementById("grafica-barras-opcionales-container");
  const comb = document.getElementById("grafica-barras-combinada-container");

  const separadoActivo = fijos.style.display !== "none";

  fijos.style.display = separadoActivo ? "none" : "block";
  opc.style.display = separadoActivo ? "none" : "block";
  comb.style.display = separadoActivo ? "block" : "none";

  btnToggle.textContent = separadoActivo
    ? "🔁 Vista combinada activa (clic para vista separada)"
    : "🔁 Vista separada activa (clic para vista combinada)";
});

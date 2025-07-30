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
      document.getElementById("gasto-mas-alto").textContent = `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${gastoMasAlto.monto.toFixed(2)})`;
      document.getElementById("ahorro-estimado").textContent = "⚠️ Debido a que usted tiene gastos que superan su ingreso, no se puede calcular el ahorro estimado. \n Le recomendamos que considere reducir sus gastos opcionales.";
      document.getElementById("ahorro-estimado").style.color = "red";
    } else {
      document.getElementById("gasto-mas-alto").textContent = `GASTO MÁS ALTO: ${gastoMasAlto.nombre.toUpperCase()} ($${gastoMasAlto.monto.toFixed(2)})`;
      document.getElementById("ahorro-estimado").textContent = `AHORRO ESTIMADO: $${ahorroEstimado.toFixed(2)}`;
    }

    // --- Gráfica de pastel ---
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
          hoverOffset: 10
        }]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
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

    // --- Gráficas de barras ---
    const fijosCtx = document.getElementById("grafica-barras-fijos").getContext("2d");
    const opcCtx = document.getElementById("grafica-barras-opcionales").getContext("2d");
    const combCtx = document.getElementById("grafica-barras-combinada").getContext("2d");

    const crearGraficaBarras = (ctx, labels, data, color, tipo) => {
      return new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: `Gastos ${tipo}`,
            data,
            backgroundColor: color
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          scales: {
            x: {
              ticks: { color: "#fff" },
              grid: { color: "#444" }
            },
            y: {
              ticks: { color: "#fff" },
              grid: { color: "#444" }
            }
          },
          plugins: {
            legend: { labels: { color: "#fff" } }
          }
        }
      });
    };

    // Gráficas separadas
    const graficaFijos = crearGraficaBarras(
      fijosCtx,
      gastosFijos.map(g => g.nombre),
      gastosFijos.map(g => parseFloat(g.monto)),
      "#4aa3ff",
      "fijos"
    );

    const graficaOpcionales = crearGraficaBarras(
      opcCtx,
      gastosOpcionales.map(g => g.nombre),
      gastosOpcionales.map(g => parseFloat(g.monto)),
      "#ff6f61",
      "opcionales"
    );

    // Ordenar combinada por monto descendente
    const todosGastosOrdenados = [...todosGastos].sort((a, b) => parseFloat(b.monto) - parseFloat(a.monto));
    const coloresOrdenados = todosGastosOrdenados.map(g =>
      gastosFijos.some(f => f.nombre === g.nombre) ? "#4aa3ff" : "#ff6f61"
    );

    const graficaCombinada = new Chart(combCtx, {
      type: "bar",
      data: {
        labels: todosGastosOrdenados.map(g => g.nombre),
        datasets: [{
          label: "Gastos combinados",
          data: todosGastosOrdenados.map(g => parseFloat(g.monto)),
          backgroundColor: coloresOrdenados
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: {
            ticks: { color: "#fff" },
            grid: { color: "#444" }
          },
          y: {
            ticks: { color: "#fff" },
            grid: { color: "#444" }
          }
        },
        plugins: {
          legend: { labels: { color: "#fff" } },
          tooltip: {
            callbacks: {
              label: function(context) {
                const tipo = gastosFijos.some(g => g.nombre === context.label)
                  ? "Fijo"
                  : "Opcional";
                const monto = context.raw;
                return `${tipo} - ${context.label}: $${monto.toFixed(2)}`;
              }
            }
          }
        }
      }
    });

    // Botón para alternar vista
    const btnToggle = document.getElementById("toggle-btn");
    btnToggle.addEventListener("click", () => {
      const fijos = document.getElementById("grafica-barras-fijos");
      const opc = document.getElementById("grafica-barras-opcionales");
      const comb = document.getElementById("grafica-barras-combinada");

      const separadoActivo = fijos.style.display !== "none";

      fijos.style.display = separadoActivo ? "none" : "block";
      opc.style.display = separadoActivo ? "none" : "block";
      comb.style.display = separadoActivo ? "block" : "none";
    });

  } catch (error) {
    console.error("Error cargando datos destacados y gráfica:", error);
  }
});

//navbar
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

//Logica para cerrar sesión
const logoutLink = document.getElementById("logout-link");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("logout-popup");
const cancelBtn = document.querySelector(".cancel-btn");
const confirmBtn = document.querySelector(".confirm-btn");

logoutLink.addEventListener("click", function(e) {
  e.preventDefault();
  popup.classList.add("active");
  overlay.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  popup.classList.remove("active");
  overlay.classList.remove("active");
});

confirmBtn.addEventListener("click", () => {
  fetch('/logout', {
    method: 'POST',
    credentials: 'include'
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      window.location.href = '../index.html';
    } else {
      alert('No se pudo cerrar sesión.');
    }
  })
  .catch(() => alert('Error en la comunicación con el servidor.'));
});


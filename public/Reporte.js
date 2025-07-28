document.addEventListener('DOMContentLoaded', () => {
  fetch('/datos')
    .then(res => res.json())
    .then(datos => {
      mostrarDatosDestacados(datos);   // Fase 1
      cargarGraficaPastel(datos);      // Fase 2
      cargarGraficaBarras(datos);      // Fase 3
    })
    .catch(error => console.error('Error cargando datos:', error));
});

// FASE 1: Mostrar datos destacados (Gasto más alto y Ahorro estimado)
function mostrarDatosDestacados(datos) {
  const gastosTotales = datos.gastosFijos.concat(datos.gastosOpcionales);
  
  // Gasto más alto
  let gastoMasAlto = gastosTotales.reduce((max, gasto) => 
    gasto.monto > max.monto ? gasto : max, { monto: 0 });

  document.getElementById('gasto-mas-alto').textContent = 
    `💸 Gasto más alto: ${gastoMasAlto.nombre} ($${gastoMasAlto.monto.toFixed(2)})`;

  // Ahorro estimado
  const totalGastos = gastosTotales.reduce((suma, gasto) => suma + gasto.monto, 0);
  const ingreso = datos.ingresoMensual || 0;
  const ahorro = ingreso - totalGastos;

  document.getElementById('ahorro-estimado').textContent = 
    `💰 Ahorro estimado: $${ahorro.toFixed(2)}`;
}

// FASE 2: Gráfica de pastel (distribución de gastos fijos vs opcionales)
function cargarGraficaPastel(datos) {
  const totalFijos = datos.gastosFijos.reduce((suma, g) => suma + g.monto, 0);
  const totalOpcionales = datos.gastosOpcionales.reduce((suma, g) => suma + g.monto, 0);

  new Chart(document.getElementById('graficaPastel'), {
    type: 'pie',
    data: {
      labels: ['Fijos', 'Opcionales'],
      datasets: [{
        data: [totalFijos, totalOpcionales],
        backgroundColor: ['#3399ff', '#66cc99']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: $${ctx.raw}`
          }
        }
      }
    }
  });
}

// FASE 3: Gráfica de barras (comparación por categoría)
function cargarGraficaBarras(datos) {
  const categorias = {};
  datos.gastosFijos.concat(datos.gastosOpcionales).forEach(gasto => {
    if (!categorias[gasto.nombre]) {
      categorias[gasto.nombre] = 0;
    }
    categorias[gasto.nombre] += gasto.monto;
  });

  const etiquetas = Object.keys(categorias);
  const valores = Object.values(categorias);

  new Chart(document.getElementById('graficaBarras'), {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [{
        label: 'Monto por categoría ($)',
        data: valores,
        backgroundColor: '#3399ff',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: ctx => `$${ctx.raw}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#fff'
          },
          title: {
            display: true,
            text: 'Monto ($)',
            color: '#fff'
          }
        },
        x: {
          ticks: {
            color: '#fff'
          },
          title: {
            display: true,
            text: 'Categorías',
            color: '#fff'
          }
        }
      }
    }
  });
}


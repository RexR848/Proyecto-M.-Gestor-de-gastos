document.addEventListener("DOMContentLoaded", () => {
  const metasContainer = document.getElementById("metas-container");

  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  const cantidadInput = document.getElementById("popup-cantidad");
  const cancelBtn = document.querySelector(".cancel-btn");
  const confirmBtn = document.querySelector(".confirm-btn");
  const popupTitle = document.getElementById("popup-title");

  let metas = [];
  let metaActual = null;
  let operacion = null;

  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("open");
  };
  function mostrarMetas() {
    metasContainer.innerHTML = "";

    metas.forEach((m, i) => {
      const div = document.createElement("div");
      div.className = "gasto-box";

      const porcentaje = Math.min((m.actual / m.meta) * 100, 100).toFixed(1);

      div.innerHTML = `
        <div class="gasto-header">${m.nombre}</div>
        <p style="margin:8px 0;">💵 ${m.actual.toFixed(2)} / ${m.meta.toFixed(2)}</p>
        <div style="background:#444; border-radius:8px; overflow:hidden; margin: 8px 0;">
          <div style="width:${porcentaje}%; height:12px; background:#4aa3ff;"></div>
        </div>
        <div style="margin-top:10px;">
          <button class="btn" onclick="abrirPopup(${i}, 'ingreso')">+ Ingresar</button>
          <button class="btn" onclick="abrirPopup(${i}, 'retiro')">- Retirar</button>
        </div>
      `;
      metasContainer.appendChild(div);
    });
  }


});

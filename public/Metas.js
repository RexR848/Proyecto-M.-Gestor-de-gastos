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

});

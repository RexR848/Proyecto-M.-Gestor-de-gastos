function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  const isOpen = sidebar.classList.toggle("open");
  overlay.classList.toggle("active", isOpen);
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logout-link");
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("logout-popup");
  const cancelBtn = document.querySelector(".cancel-btn");
  const confirmBtn = document.querySelector(".confirm-btn");
  const sidebar = document.getElementById("sidebar");

  // Cerrar sidebar si se hace clic en overlay
  overlay.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    }
    if (popup.classList.contains("active")) {
      popup.classList.remove("active");
      overlay.classList.remove("active");
    }
  });

  // Manejo de cierre de sesión
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    popup.classList.add("active");
    overlay.classList.add("active");
  });

  cancelBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    overlay.classList.remove("active");
  });

  confirmBtn.addEventListener("click", () => {
    fetch("/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          window.location.href = "../../index.html";
        } else {
          alert("No se pudo cerrar sesión.");
        }
      })
      .catch(() => alert("Error en la comunicación con el servidor."));
  });
});

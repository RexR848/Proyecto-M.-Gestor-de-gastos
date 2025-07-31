function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

function setTheme(theme) {
  document.body.classList.remove("dark-theme", "light-theme", "custom-theme");

  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    document.documentElement.style.setProperty('--accent-color', '#4aa3ff');
  } else if (theme === "light") {
    document.body.classList.add("light-theme");
    document.documentElement.style.setProperty('--accent-color', '#007bff');
  } else if (theme === "custom") {
    document.body.classList.add("custom-theme");
    document.getElementById("color-picker-container").classList.remove("hidden");
  } else {
    document.getElementById("color-picker-container").classList.add("hidden");
  }
}

document.getElementById("colorPicker").addEventListener("input", (e) => {
  const color = e.target.value;
  document.documentElement.style.setProperty('--accent-color', color);
  document.getElementById("color-picker-container").classList.remove("hidden");
  document.body.classList.add("custom-theme");
});

// Popup cierre de sesión
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

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

// Carga datos de perfil desde backend al cargar la página
async function cargarPerfil() {
  try {
    const res = await fetch('/api/perfil', { credentials: 'include' });
    if (!res.ok) throw new Error('Error al obtener datos de perfil');
    const data = await res.json();
    if (data.ok && data.perfil) {
      document.getElementById('nombre').value = data.perfil.nombre || '';
      document.getElementById('emoji').value = data.perfil.emoji || '';
    }
  } catch (error) {
    console.warn(error);
  }
}

// Enviar datos al backend para guardar
document.getElementById('perfil-form').addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const emoji = document.getElementById('emoji').value.trim();

  if (!nombre) {
    mostrarMensaje('El nombre es obligatorio.', true);
    return;
  }

  // Validación simple emoji (opcional)
  if (emoji && !/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF])$/.test(emoji)) {
    mostrarMensaje('Por favor ingresa un emoji válido.', true);
    return;
  }

  try {
    const res = await fetch('/api/perfil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombre, emoji })
    });
    const data = await res.json();
    if (data.ok) {
      mostrarMensaje('Perfil guardado con éxito.');
    } else {
      mostrarMensaje(data.error || 'Error guardando perfil.', true);
    }
  } catch (error) {
    mostrarMensaje('Error en la comunicación con el servidor.', true);
  }
});

function mostrarMensaje(texto, error = false) {
  const msg = document.getElementById('mensaje');
  msg.textContent = texto;
  msg.style.color = error ? '#e74c3c' : '#62a9ff';
}

// Carga perfil al inicio
document.addEventListener('DOMContentLoaded', cargarPerfil);

// Código para el logout (igual que en otras páginas)
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

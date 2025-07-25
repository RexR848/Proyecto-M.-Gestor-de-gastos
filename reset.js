const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

document.getElementById("formReset").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nueva = document.getElementById("nueva").value;

  const res = await fetch('/restablecer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, nueva })
  });

  const data = await res.json();
  alert(data.mensaje);
  if (data.ok) location.href = 'public/IniciarSesion.html';
});

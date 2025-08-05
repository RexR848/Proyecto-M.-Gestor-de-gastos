document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  const res = await fetch('/recuperar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (!res.ok) {
    const text = await res.text();
    if (text === '{"ok":false,"mensaje":"Correo no encontrado"}') {
      alert("Error en la respuesta del servidor: Correo no encontrado.\nIngrese uno ya registrado");
    } else {
      alert("Error en la respuesta del servidor: " + text);
    }
    return;
  }

  const data = await res.json();
  alert(data.mensaje);
});


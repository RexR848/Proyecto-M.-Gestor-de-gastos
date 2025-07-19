document.getElementById("loginForm").addEventListener("submit", async (e) => {
e.preventDefault();
const usuario = document.getElementById("usuario").value;
const contraseña = document.getElementById("contraseña").value;

const res = await fetch("https://proyecto-m-gestor-de-gastos.onrender.com", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ usuario, contraseña })
});

const datos = await res.json();
alert(datos.mensaje);
});
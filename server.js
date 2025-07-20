const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const uri = 'mongodb+srv://alpeur23:f8HJfn67PgqRdlTP@gestordegastos.bqfqqza.mongodb.net/?retryWrites=true&w=majority&appName=GestordeGastos';
const client = new MongoClient(uri);

app.use(cors());
app.use(bodyParser.json());

//-----------------pon er la ruta de la carpeta public, osea la carpeta que contiene el index.html, osea aj--------------a
app.use(express.static(path.join(__dirname, 'public')));

let db;
client.connect().then(() => {
  db = client.db('miApp');
  console.log('✅ Conectado a MongoDB');
});

//-------------Iniciar sesión-----------------|
app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;
  const user = await db.collection('usuarios').findOne({ usuario, contraseña });

  if (user) {
    res.json({ ok: true, mensaje: "Login exitoso" });
  } else {
    res.status(401).json({ ok: false, mensaje: "Usuario o contraseña incorrectos" });
  }
});

//------------------Crear cuenta---------------|
app.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ ok: false, mensaje: "Faltan campos obligatorios" });
  }

  const existente = await db.collection('usuarios').findOne({ email });

  if (existente) {
    return res.status(409).json({ ok: false, mensaje: "El correo ya está registrado" });
  }

  await db.collection('usuarios').insertOne({
    usuario: nombre,
    email,
    contraseña: password,
    creado: new Date()
  });

  res.json({ ok: true, mensaje: "Cuenta creada con éxito 🎉🎉🎉🎉" });
});

//-----------------Ruta default de render---------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`El servidor de la pagina ya corre en http://localhost:${PORT} 🎉🎉🎉🎉🎉🎉🎉🎉🎉`);
});

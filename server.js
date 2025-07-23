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

// Servir archivos estáticos desde la raíz (porque el HTML está ahí)
app.use(express.static(path.join(__dirname, '/')));

let db;
client.connect().then(() => {
  db = client.db('miApp');
  console.log('✅ Conectado a MongoDB');
});

//------------------Login------------------//
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('🟡 Intentando login con:', { email, password });

  try {
    const posibles = await db.collection('usuarios').find({ email }).toArray();
    console.log('🔍 Usuarios encontrados con ese email:', posibles);

    const user = await db.collection('usuarios').findOne({ email, password });
    console.log('✅ Resultado final del findOne:', user);

    if (user) {
      res.json({ ok: true, mensaje: "Login exitoso" });
    } else {
      res.status(401).json({
        ok: false,
        mensaje: "Usuario o contraseña incorrectos",
        enviado: { email, password },
        encontrados: posibles
      });
    }
  } catch (err) {
    console.error('❌ Error durante el login:', err);
    res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
  }
});


//------------------Registro------------------//
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

  res.json({ ok: true, mensaje: "Cuenta creada con éxito 🎉" });
});

//------------------Ruta principal------------------//
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

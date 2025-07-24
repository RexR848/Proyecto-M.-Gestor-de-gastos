const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// coso para los cookies ohellyea, npm i cookie-parser
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

const uri = 'mongodb+srv://alpeur23:f8HJfn67PgqRdlTP@gestordegastos.bqfqqza.mongodb.net/?retryWrites=true&w=majority&appName=GestordeGastos';
const client = new MongoClient(uri);

app.use(cors());
app.use(bodyParser.json());

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
      //las cuki
      res.cookie('sesion', user.email, {
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
      });
      res.json({ ok: true, mensaje: "Login exitoso" });
    }
    else {
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
    password,
    creado: new Date()
  });

  res.json({ ok: true, mensaje: "Cuenta creada con éxito 🎉" });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/login', (req, res) => {
  res.status(405).send('🚫 Método no permitido. Usa POST para iniciar sesión.');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

//-------------------Ya había iniciado?----------------------//
app.get('/verificar-sesion', (req, res) => {
  const email = req.cookies?.sesion;
  if (email) {
    res.json({ ok: true, email });
  } else {
    res.json({ ok: false });
  }
});


//--------------cerrar sesión---------------------------//

app.post('/logout', (req, res) => {
  res.clearCookie('sesion');
  res.json({ ok: true, mensaje: 'Sesión cerrada' });
});



//---------------datos de usuario (gestion)--------------//

app.get('/datos', async (req, res) => {
  const email = req.cookies?.sesion;
  if (!email) return res.status(401).json({ ok: false, mensaje: 'No autenticado' });

  const datos = await db.collection('datos').findOne({ email });
  res.json({ ok: true, datos: datos || {} });
});

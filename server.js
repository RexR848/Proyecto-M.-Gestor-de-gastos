const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// coso para los cookies ohellyea, npm i cookie-parser
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


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

app.post('/guardar-datos', async (req, res) => {
  const email = req.cookies?.sesion;
  if (!email) return res.status(401).json({ ok: false, mensaje: "No autenticado" });

  const { ingreso, gastosFijos, gastosOpcionales } = req.body;

  await db.collection('datos').updateOne(
    { email },
    {
      $set: { ingreso, gastosFijos, gastosOpcionales }
    },
    { upsert: true }
  );

  res.json({ ok: true, mensaje: 'Datos guardados con éxito' });
});

//----------------------recuperar contraseña-------------//
app.post('/recuperar', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.collection('usuarios').findOne({ email });

    if (!user) {
      return res.status(404).json({ ok: false, mensaje: 'Correo no encontrado' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expira = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

    await db.collection('usuarios').updateOne({ email }, {
      $set: {
        resetToken: token,
        resetExpira: expira
      }
    });

    const resetURL = `https://proyecto-m-gestor-de-gastos.onrender.com/restablecer.html?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'informesgestordegastos@gmail.com',  
        pass: 'ffmh nxwb msvt wfyl'   
      }
    });

    await transporter.sendMail({
      to: email,
      subject: 'Recuperar contraseña – Gestor de Gastos',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Recuperar tu contraseña</h2>
          <p>Hola,</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Gestor de Gastos</strong>.</p>
          <p>Haz clic en el siguiente botón para establecer una nueva contraseña. Este enlace expirará en 15 minutos.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Cambiar contraseña</a>
          </p>
          <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 0.9em;">Este correo fue enviado automáticamente. No respondas a este mensaje.</p>
        </div>
      `
    });


    res.json({ ok: true, mensaje: 'Correo enviado con instrucciones' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ error: 'Hubo un error al enviar el correo' });
  }
});
//-----------------------------restablecer contraseña--------------------//
app.post('/restablecer', async (req, res) => {
  const { token, nueva } = req.body;

  const user = await db.collection('usuarios').findOne({
    resetToken: token,
    resetExpira: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }

  await db.collection('usuarios').updateOne({ resetToken: token }, {
    $set: { password: nueva },
    $unset: { resetToken: "", resetExpira: "" }
  });

  res.json({ ok: true, mensaje: 'Contraseña actualizada correctamente' });
});

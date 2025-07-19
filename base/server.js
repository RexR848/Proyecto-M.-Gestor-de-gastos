// server.js sacado dede el proyecto de unity, adaptado a Node.js/web
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const uri = 'mongodb+srv://alpeur23:f8HJfn67PgqRdlTP@gestordegastos.bqfqqza.mongodb.net/?retryWrites=true&w=majority&appName=GestordeGastos';
const client = new MongoClient(uri);

app.use(cors());
app.use(bodyParser.json());

let db;
client.connect().then(() => {
  db = client.db('miApp');
  console.log('Conectado a MongoDB');
});

app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;
  const user = await db.collection('usuarios').findOne({ usuario, contraseña });
  if (user) {
    res.json({ ok: true, mensaje: "Login exitoso" });
  } else {
    res.json({ ok: false, mensaje: "Usuario o contraseña incorrectos" });
  }
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});

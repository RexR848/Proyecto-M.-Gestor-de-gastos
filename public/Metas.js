<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gestor de Gastos - Metas</title>
  <link rel="stylesheet" href="FEstyles.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
</head>
<body>

<header class="header">
  <div class="logo-title">
    <img src="../resources/Logo_Gestor_de_datos.png" alt="Logo" class="logo" />
    <h1 class="site-title">Gestor de gastos</h1>
    <h1 class="animate__animated animate__bounce">An animated element</h1>
  </div>
  <button class="menu-btn" onclick="toggleSidebar()">☰</button>
</header>

<div class="divider"></div>

<main class="card">
  <h2 class="title">Mis Metas Financieras</h2>
  <button class="btn" onclick="abrirPopupNuevaMeta()" style="margin-bottom: 15px;">+ Nueva meta</button>
  <div id="metas-container"></div>
</main>

<!-- Sidebar -->
<nav id="sidebar" class="sidebar">
  <button class="close-btn" onclick="toggleSidebar()">×</button>
  <ul class="nav-list">
    <li><a href="Finanzas.html">🏠 Inicio</a></li>
    <li><a href="Finanzas_editar.html">✏️ Editar</a></li>
    <li><a href="Reportes.html">📊 Reportes</a></li>
    <li><a href="Metas.html">🐷 Metas</a></li>
    <li><a href="Metas_editar.html">⚙️ Editar metas</a></li>
    <li><a href="config.html">🧪 Ajustes</a></li>
    <li><a href="acerca.html">🗣️ Acerca de</a></li>
    <li><a href="#" id="logout-link">🚪 Cerrar sesión</a></li>
  </ul>
</nav>

<!--ingreso/retiro-->
<div id="popup" class="popup">
  <h3 id="popup-title">Movimiento</h3>
  <input type="number" id="popup-cantidad" placeholder="$0.00" />
  <div class="popup-buttons">
    <button class="cancel-btn">Cancelar</button>
    <button class="confirm-btn">Aceptar</button>
  </div>
</div>

<!--nueva/editar-->
<div id="popup" class="popup">
  <h3 id="popup-title">Meta</h3>
  <input type="text" id="popup-nombre" placeholder="Nombre de la meta" />
  <input type="number" id="popup-actual" placeholder="Cantidad actual" />
  <input type="number" id="popup-meta" placeholder="Monto meta" />
  <div class="popup-buttons">
    <button class="cancel-btn">Cancelar</button>
    <button class="confirm-btn">Guardar</button>
  </div>
</div>

<script src="Metas.js"></script>
</body>
</html>

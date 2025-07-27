## Proyecto Gestor de datos

## Descripción

Proyecto Gestor de datos es una aplicación web diseñada para llevar un control sencillo y eficiente de tus gastos e ingresos. Permite registrar operaciones financieras, visualizar reportes y mantener un seguimiento mensual de tu economía personal.

Incluye una interfaz web y un servidor backend que se encarga de ciertas funcionalidades de la pagina.

la mayoria del proyecto fue extraido de los cursos de udemy

-----------------------------------------------------------------------------------------------------------

## ¿Cómo ejecutarlo?

1. Clona el repositorio:


   git clone https://github.com/RexR848/Proyecto-M.-Gestor-de-gastos.git
   cd Proyecto-M.-Gestor-de-gastos


2. Instala las dependencias (si el proyecto tiene un archivo `package.json`):


   npm install


3. Ejecuta el servidor:


   node server.js


4. Abre tu navegador y entra a la dirección que aparezca en la terminal, por ejemplo: `http://localhost:3000`

Importante: Algunas funciones de la página requieren que el servidor esté corriendo. Asegúrate de ejecutar `node server.js` antes de usar la aplicación.

-------------------------------------------------------------

## Tecnologías utilizadas

* Node.js para el backend
* JavaScript, HTML y CSS para el frontend
* Posiblemente Express u otros frameworks (según implementación)

--------------------------------------------

## Funciones principales

* Registrar gastos e ingresos con descripción, monto y fecha
* Editar y eliminar transacciones
* Ver resumen de ingresos y egresos
* Visualización mensual del historial financiero

------------------------------------------------------

## Pruebas básicas

| Escenario            | Acción                    | Resultado esperado                        |
| -------------------- | ------------------------- | ----------------------------------------- |
| Iniciar el servidor  | Ejecutar `node server.js` | El servidor inicia sin errores            |
| Agregar transacción  | Usar formulario en la web | Se guarda una nueva operación             |
| Editar transacción   | Clic en botón de editar   | Se actualiza la información correctamente |
| Eliminar transacción | Clic en botón de eliminar | La operación se borra sin errores         |

-----------------------------------------------------------------------------------------------------------

## Recomendaciones

* Agrega un script en `package.json` para facilitar la ejecución:


  "scripts": {
    "start": "node server.js"
  }

* Crea un archivo `.gitignore` y asegúrate de ignorar la carpeta `node_modules`

* Si el proyecto crece, considera usar variables de entorno para configuraciones como el puerto o claves privadas

---------------------------------------------

## Creditos

Hernández Posadas Jose Armando
Peralta Uribe Alan


-------------------------------------------

## Resumen

* Clona el repositorio
* Ejecuta `npm install` si es necesario
* Corre `node server.js` para iniciar el backend
* Accede desde el navegador para comenzar a usar la app


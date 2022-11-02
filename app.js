/*****************  Requires  ***************/
const express = require("express");
const app = express();

const { datos } = require("./data/datos");

// Routers
const routerPersonas = require("./routers/personal.js");
app.use("/api/datos/personal", routerPersonas);

const routerProyectos = require("./routers/proyectos.js")
app.use("/api/datos/proyectos", routerProyectos);

/*****************  Routing  ***************/

//Home
app.get("/", (req, res) => {
  res.send("Home");
});

//Todos los datos en formato JSON
app.get("/api/datos", (req, res) => {
  res.send(JSON.stringify(datos));
});

/*****************  Listen  ***************/
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`El servidor se esta escuchando en el puerto ${PUERTO}...`);
});

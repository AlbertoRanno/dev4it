/*****************  Requires  ***************/
const express = require("express");
const app = express();

// Set temple engine
app.set("view engine", "ejs");

// Access to Public
app.use(express.static("./public"))

// Data
const { datos } = require("./data/datos");

// Routers
const routerMain = require("./routes/main.js")
const routerPersonas = require("./routes/personal.js");
const routerProyectos = require("./routes/proyectos.js");


/*****************  Routing  ***************/
app.use("/api/datos/personal", routerPersonas);
app.use("/api/datos/proyectos", routerProyectos);
app.get("/api/datos", (req, res) => {
  res.send(datos);
});
app.use("/", routerMain);

/*****************  Listen  ***************/
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`El servidor se esta escuchando en el puerto ${PUERTO}...`);
});

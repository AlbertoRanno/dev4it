/*****************  Requires  ***************/
const express = require("express");
const app = express();

// Set temple engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

//Public
app.use(express.static("./public"))

// Routers
const routerMain = require("./routes/main.js")
const routerPersonas = require("./routes/personal.js");
const routerProyectos = require("./routes/proyectos.js");


/*****************  Routing  ***************/
app.use("/personal", routerPersonas);
app.use("/proyectos", routerProyectos);
app.use("/", routerMain);

/*****************  Listen  ***************/
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`El servidor se esta escuchando en el puerto ${PUERTO}...`);
});

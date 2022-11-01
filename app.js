/*****************  Requires  ***************/
const express = require("express");
const app = express();

const {datos} = require("./datos")

/*****************  Routing  ***************/
app.get("/", (req, res) => {
  res.send("Probando")
})

app.get("/api/datos", (req, res) => {
  res.send(JSON.stringify(datos));
  //res.send(JSON.stringify(datos)) para convertir en formato json
})

// Personal

app.get("/api/datos/personal/:id", (req, res) => {
  //a corregir
  const id = req.params.id
  const resultados = datos.personal.filter(persona => persona.id === id)

  if(resultados.length === 0){
    return res.status(404).send(`No se encontro a nadie con el id ${id}`)
  }

  res.send(resultados);
});
app.get("/api/datos/personal", (req, res) => {
  res.send(datos.personal);
});

// Proyectos

app.get("/api/datos/proyectos/:id", (req, res) => {
  //a corregir
  const id = req.params.id
  const resultados = datos.proyectos.filter(proyecto => proyecto.id === id)

  if(resultados.length === 0){
    return res.status(404).send(`No se encontro a nadie con el id ${id}`)
  }

  res.send(resultados);
});
app.get("/api/datos/personal", (req, res) => {
  res.send(datos.personal);
});

/*****************  Listen  ***************/
const PUERTO = process.env.PORT || 3000;
//cuando suba la pagina, el puerto lo asignara el entorno, por eso la primer opcion
app.listen(PUERTO, () => {
  console.log(`El servidor se esta escuchando en el puerto ${PUERTO}...`);
})
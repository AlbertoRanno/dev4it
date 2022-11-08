const express = require("express");
const routerPersonas = express.Router();
const personalController = require("../controllers/personalController.js")

routerPersonas.get("/register", personalController.register)

routerPersonas.post("/register", personalController.store)

routerPersonas.use("/search", personalController.search)

routerPersonas.get("/edit/:id", personalController.edit);

routerPersonas.put("/update/:id", personalController.update);

routerPersonas.delete("/delete/:id", personalController.delete)

routerPersonas.get("/:id", personalController.detail);

routerPersonas.get("/", personalController.list );

// routerPersonas.get("/", (req, res) => {
//   //Orden descendente para ver primero a los ultimos incorporados a la empresa
//   if (req.query.ordenar == "id") {
//     return res.send(datos.personal.sort((a, b) => b.id - a.id));
//   }

//   res.send(datos.personal);
// });

// routerPersonas.post("/", (req, res) => {
// let nuevoPersonal = req.body
// datos.personal.push(nuevoPersonal)
// res.send(datos.personal)
// })

// routerPersonas.put("/:id", (req, res) => {
//   const personalActualizado = req.body
//   const id = req.params.id

//   const indiceArray = datos.personal.findIndex(persona => persona.id == id)

//   if (indiceArray >= 0) {
//     datos.personal[indiceArray] = personalActualizado;
//   } else {
//     res.status(404).send(`No se encontro a nadie con el id ${id}`);
//   }
//   res.send(datos.personal)
// })

// routerPersonas.patch("/:id", (req, res) => {
//   const infoActualizada = req.body;
//   const id = req.params.id;

//   const indiceArray = datos.personal.findIndex((persona) => persona.id == id);

//   if (indiceArray >= 0) {
//     const personalAModificar = datos.personal[indiceArray];
//     Object.assign(personalAModificar, infoActualizada);
//   } else {
//     res.status(404).send(`No se encontro a nadie con el id ${id}`);
//   }
//   res.send(datos.personal);
// });

// routerPersonas.delete("/:id", (req, res) => {
//   const id = req.params.id  
//   const indiceArray = datos.personal.findIndex(persona=> persona.id == id)
//   if(indiceArray>=0){
//     datos.personal.splice(indiceArray,1)
//   } else { res.status(404).send(`No se encontro a nadie con el id ${id}`)}
//   res.send(datos.personal)

// })

module.exports = routerPersonas;
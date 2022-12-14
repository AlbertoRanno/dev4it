const { validationResult } = require("express-validator");
const Persona = require("../models/Persona");
const Proyecto = require("../models/Proyecto");
const mongoose = require("mongoose");
const moment = require("moment");

let datosPersonal = [];

Persona.find({}, (error, personas) => {
  if (error) {
    return res.status(500).json({
      message: "Error buscando al personal",
    });
  } else {
    for (let i = 0; i < personas.length; i++) {
      datosPersonal.push(personas[i]);
    }
  }
});

let estados = [
  "Activo",
  "Finalizado",
  "En elaboración de propuesta",
  "En espera de respuesta",
  "Pausado por el cliente",
  "Pausado por CDT",
  "En análisis",
  "Pausado",
];

const controller = {
  list: (req, res) => {
    Proyecto.find({}, (error, proyectos) => {
      if (error) {
        return res.status(500).json({
          message: "Error buscando los proyectos",
        });
      } else {
        res.render("./proyects/proyects", {
          listado: proyectos,
        });
      }
    });
  },
  detail: (req, res) => {
    let id = req.params.id;
    Proyecto.findById(id, (error, proyect) => {
      if (error) {
        res.status(500).json({
          message: `Error buscando al proyecto con id: ${id}`,
        });
      } else {
        res.render("./proyects/detail", {
          proyect,
        });
      }
    }).populate({ path: "involved", strictPopulate: false });
  },
  search: (req, res) => {
    const loQueBuscoElUsuario = req.query.search;

    const results = [];

    Proyecto.find({}, (error, proyectos) => {
      if (error) {
        return res.status(500).json({
          message: "Error buscando el proyecto solicitado",
        });
      } else {
        for (let i = 0; i < proyectos.length; i++) {
          if (
            proyectos[i].name
              .toLocaleLowerCase()
              .includes(loQueBuscoElUsuario.toLocaleLowerCase())
          ) {
            results.push(proyectos[i]);
          }
        }

        res.render("./proyects/search", {
          loQueBuscoElUsuario,
          results,
        });
      }
    });
  },
  register: (req, res) => {
    res.render("./proyects/register.ejs", {
      personal: datosPersonal,
      estados,
    });
  },
  store: (req, res) => {
    const resultValidation = validationResult(req);

    Proyecto.find(
      {
        name: req.body.name,
      },
      (error, proyectInDB) => {
        if (error) {
          return res.status(500).json({
            message: "Error buscando el proyecto",
          });
        } else {
          if (proyectInDB.length >= 1) {
            res.render("./proyects/register", {
              errors: {
                name: {
                  msg: "Este proyecto ya fue ingresado",
                },
              },
              oldData: req.body,
              estados,
              personal: datosPersonal,
            });
          } else if (resultValidation.isEmpty()) {
            const proyect = new Proyecto({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              description: req.body.description,
              manager: req.body.manager,
              condition: req.body.condition,
              dateStart: req.body.dateStart,
              dateEnd: req.body.dateEnd,
              involved: req.body.involved,
              link: req.body.link,
              observations: req.body.observations,
              active: true,
            });

            if (typeof req.body.involved == "string") {
              console.log("Un solo usuario");
              let personalInvolucrado = [];
              personalInvolucrado.push(req.body.involved);

              Persona.findById(req.body.involved, (error, persona) => {
                if (error) {
                  return res
                    .status(500)
                    .json({ message: "Error buscando al usuario" });
                }
                persona.proyects = persona.proyects.concat(proyect._id);
                persona.save();
              });
            }

            console.log(typeof req.body.involved);
            if (typeof req.body.involved == "object") {
              let personalInvolucrado = req.body.involved;
              for (let i = 0; i < personalInvolucrado.length; i++) {
                Persona.findById(personalInvolucrado[i], (error, persona) => {
                  if (error) {
                    return res
                      .status(500)
                      .json({ message: "Error buscando al personal" });
                  }
                  persona.proyects = persona.proyects.concat(proyect._id);
                  persona.save();
                });
              }
            }

            if (proyect.dateEnd < new Date()) {
              proyect.condition = "Pausado";
            }

            proyect.save((error) => {
              if (error) {
                return res.status(500).json({
                  message: "Error guardando en DB",
                });
              }
            });

            res.redirect("/proyectos");
          } else {
            res.render("./proyects/register", {
              personal: datosPersonal,
              estados,
              errors: resultValidation.mapped(),
              oldData: req.body,
            });
          }
        }
      }
    );
  },
  edit: (req, res) => {
    let id = req.params.id;

    Proyecto.findById(id, (error, proyectToEdit) => {
      if (error) {
        return res.status(500).json({
          message: `Error localizando el proyecto con id: ${id}`,
        });
      } else {
        let toAssign = [];
        for (let i = 0; i < datosPersonal.length; i++) {
          if (datosPersonal[i].rol != "Gestor de proyectos") {
            toAssign.push(datosPersonal[i]);
          }
        }

        let formattedDateStart = moment(proyectToEdit.dateStart)
          .add(1, "days")
          .format("YYYY-MM-DD");
        let formattedDateEnd = moment(proyectToEdit.dateEnd)
          .add(1, "days")
          .format("YYYY-MM-DD");

        res.render("./proyects/edit", {
          proyectToEdit,
          personal: datosPersonal,
          estados,
          toAssign,
          formattedDateStart,
          formattedDateEnd,
        });
      }
    });
  },
  update: (req, res) => {
    const resultValidation = validationResult(req);
    let id = req.params.id;

    // Borro el proyecto de todos los usuarios, y luego guardo donde corresponda
    Persona.find({}, (error, personas) => {
      if (error) {
        return res.status(500).json({
          message: "Error buscando los personas",
        });
      }

      for (let i = 0; i < personas.length; i++) {
        let indiceArray = personas[i].proyects.indexOf(id);
        if (indiceArray != -1) {
          personas[i].proyects.splice(indiceArray, 1);
          personas[i].save();
        }
      }
    });

    Proyecto.findById(id, (error, proyectToEdit) => {
      let formattedDateStart = moment(proyectToEdit.dateStart)
        .add(1, "days")
        .format("YYYY-MM-DD");
      let formattedDateEnd = moment(proyectToEdit.dateEnd)
        .add(1, "days")
        .format("YYYY-MM-DD");

      let toAssign = [];
      for (let i = 0; i < datosPersonal.length; i++) {
        if (datosPersonal[i].rol != "Gestor de proyectos") {
          toAssign.push(datosPersonal[i]);
        }
      }

      if (error) {
        return res.status(500).json({
          message: `Error buscando el proyecto con id: ${id}`,
        });
      } else {
        if (resultValidation.isEmpty()) {
          let name = req.body.name;
          let description = req.body.description;
          let manager = req.body.manager;
          let condition = req.body.condition;
          let dateStart = req.body.dateStart;
          let dateEnd = req.body.dateEnd;
          let involved = req.body.involved;
          let link = req.body.link;
          let observations = req.body.observations;
          let active = req.body.active;

          console.log(typeof involved);

          switch (typeof involved) {
            case "undefined":
              involved = [];

              break;

            case "string":
              Persona.findById(involved, (error, persona) => {
                if (error) {
                  return res.status(500).json({
                    message: "Error buscando el proyecto",
                  });
                }
                persona.proyects = persona.proyects.concat(id);
                persona.save();
              });
              break;

            case "object":
              for (let i = 0; i < involved.length; i++) {
                Persona.findById(involved[i], (error, persona) => {
                  if (error) {
                    return res.status(500).json({
                      message: "Error buscando los personas",
                    });
                  }
                  persona.proyects = persona.proyects.concat(id);
                  persona.save();
                });
              }
              break;

            default:
              res.status(500).json({
                message: `No coincide con los casos - ${error}`,
              });
              break;
          }

          Proyecto.findByIdAndUpdate(
            id,
            {
              name,
              description,
              manager,
              condition,
              dateStart,
              dateEnd,
              involved,
              link,
              observations,
              active,
            },
            (error, proyect) => {
              if (error) {
                return res.status(500).json({
                  message: "Error guardando en DB",
                });
              } else {
                res.redirect("/proyectos");
              }
            }
          );
        } else {
          res.render("./proyects/edit", {
            proyectToEdit,
            personal: datosPersonal,
            estados,
            errors: resultValidation.mapped(),
            oldData: req.body,
            formattedDateStart,
            formattedDateEnd,
            toAssign,
          });
        }
      }
    });
  },
  softdelete: (req, res) => {
    let id = req.params.id;
    Proyecto.findByIdAndUpdate(id, { active: false }, (error, proyecto) => {
      if (error) {
        return res.status(500).json({
          message: "Error eliminando el proyecto",
        });
      } else {
        console.log(`${proyecto.name} eliminado correctamente`);
        res.redirect("/proyectos");
      }
    });
  },
  delete: (req, res) => {
    let id = req.params.id;
    Proyecto.findByIdAndDelete(id, (error) => {
      if (error) {
        return res.status(500).json({
          message: "Error eliminando el proyecto",
        });
      } else {
        console.log("La eliminación definitiva ha sido exitosa");
        res.redirect("/proyectos");
      }
    });
  },
};

module.exports = controller;

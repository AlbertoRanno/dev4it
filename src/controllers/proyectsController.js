const { validationResult } = require("express-validator");
const Persona = require("../models/Persona");
const Proyecto = require("../models/Proyecto");
const mongoose = require("mongoose");
const moment = require("moment");
const { findByIdAndDelete } = require("../models/Persona");

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
  infoReact: (req, res) => {
    Proyecto.find({}, (error, proyectos) => {
      if (error) {
        return res.status(500).json({
          message: "Error buscando los proyectos",
        });
      } else {
        res.json({ total: proyectos.length, data: proyectos });
      }
    })
      .populate({ path: "involved", strictPopulate: false })
      .populate({ path: "manager", strictPopulate: false });
  },
  //POST PATCH y DELETE Desde React?
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
        //res.send(proyect);
        res.render("./proyects/detail", {
          proyect,
        });
      }
    })
      .populate({ path: "manager", strictPopulate: false })
      .populate({
        path: "involved",
        //populate: [{ path: "projectsInfo" }],
      });
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
            let disponibles = [];
            for (let j = 0; j < datosPersonal.length; j++) {
              if (datosPersonal[j].rol != "Gestor de proyectos") {
                disponibles.push(datosPersonal[j]._id);
              }
            }

            const proyect = new Proyecto({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              description: req.body.description,
              manager: req.body.manager,
              condition: req.body.condition,
              dateStart: req.body.dateStart,
              dateEnd: req.body.dateEnd,
              involved: [],
              projectsInfo: [],
              link: req.body.link,
              observations: req.body.observations,
              active: true,
            });

            if (typeof req.body.involved == "string") {
              //console.log("Un solo usuario");
              proyect.involved.push(req.body.involved);

              for (let i = 0; i < disponibles.length; i++) {
                let projectInfo = {
                  person: disponibles[i],
                  nivel: req.body.nivel[i],
                  porcAsigXContrato: req.body.porcAsigXContrato[i],
                  porcAsigReal: req.body.porcAsigReal[i],
                  hsMensXContrato: req.body.hsMensXContrato[i],
                  hsReales: req.body.hsReales[i],
                  observationsUser: req.body.observationsUser[i],
                  _id: new mongoose.Types.ObjectId(),
                };

                for (let j = 0; j < proyect.involved.length; j++) {
                  if (proyect.involved[j]._id.equals(projectInfo.person)) {
                    proyect.projectsInfo.push(projectInfo);
                  }
                }
              }

              Persona.findById(req.body.involved, (error, persona) => {
                if (error) {
                  return res.status(500).json({
                    message: `Error: ${error}`,
                  });
                }
                persona.projectInfo.push(proyect._id);
                persona.save();
              });
            }

            //console.log(typeof req.body.involved);
            if (typeof req.body.involved == "object") {
              let personalInvolucrado = req.body.involved;
              for (let i = 0; i < personalInvolucrado.length; i++) {
                proyect.involved.push(personalInvolucrado[i]);

                Persona.findById(personalInvolucrado[i], (error, persona) => {
                  if (error) {
                    return res.status(500).json({
                      message: `Error: ${error}`,
                    });
                  }

                  persona.projectInfo.push(proyect._id);
                  persona.save();
                });
              }

              for (let i = 0; i < disponibles.length; i++) {
                let projectInfo = {
                  person: disponibles[i],
                  nivel: req.body.nivel[i],
                  porcAsigXContrato: req.body.porcAsigXContrato[i],
                  porcAsigReal: req.body.porcAsigReal[i],
                  hsMensXContrato: req.body.hsMensXContrato[i],
                  hsReales: req.body.hsReales[i],
                  observationsUser: req.body.observationsUser[i],
                  _id: new mongoose.Types.ObjectId(),
                };

                for (let j = 0; j < proyect.involved.length; j++) {
                  if (proyect.involved[j]._id.equals(projectInfo.person)) {
                    proyect.projectsInfo.push(projectInfo);
                  }
                }
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

          console.log(proyectToEdit);

        res.render("./proyects/edit", {
          proyectToEdit,
          personal: datosPersonal,
          estados,
          toAssign,
          formattedDateStart,
          formattedDateEnd,
        });
      }
    })
      .populate({ path: "manager", strictPopulate: false })
      .populate({
        path: "involved",
      });
  },
  update: (req, res) => {
    const resultValidation = validationResult(req);
    let id = req.params.id;

    Persona.find({}, (error, personas) => {
      if (error) {
        return res.status(500).json({
          message: `Error: ${error}`,
        });
      } else {
        for (let i = 0; i < personas.length; i++) {
          Persona.findByIdAndUpdate(
            personas[i]._id,
            { projectsInfo: [] },
            (error, personas) => {
              if (error) {
                return res.status(500).json({
                  message: `Error: ${error}`,
                });
              }
            }
          );
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
                let projectInfo = {
                  proyect: proyectToEdit._id,
                  nivel: req.body.nivel.toString(),
                  porcAsigXContrato: parseInt(req.body.porcAsigXContrato, 10),
                  porcAsigReal: parseInt(req.body.porcAsigReal, 10),
                  hsMensXContrato: parseInt(req.body.hsMensXContrato, 10),
                  hsReales: parseInt(req.body.hsReales, 10),
                  observationsUser: req.body.observationsUser.toString(),
                  _id: new mongoose.Types.ObjectId(),
                };
                console.log(req.body);
                persona.projectsInfo.push(projectInfo);
                persona.save();
              });

              break;

            case "object":
              console.log(req.body);
              let personalInvolucrado = req.body.involved;
              console.log("personalInvolucrado " + personalInvolucrado);
              for (let i = 0; i < personalInvolucrado.length; i++) {
                Persona.findById(personalInvolucrado[i], (error, persona) => {
                  if (error) {
                    return res.status(500).json({
                      message: "Error buscando el proyecto",
                    });
                  }
                  let projectInfo = {
                    proyect: proyectToEdit._id,
                    nivel: req.body.nivel,
                    porcAsigXContrato: req.body.porcAsigXContrato,
                    porcAsigReal: req.body.porcAsigReal,
                    hsMensXContrato: req.body.hsMensXContrato,
                    hsReales: req.body.hsReales,
                    observationsUser: req.body.observationsUser,
                    _id: new mongoose.Types.ObjectId(),
                  };
                  console.log(projectInfo);
                  persona.projectsInfo.push(projectInfo);
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
                  message: `Error ${error}`,
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
    })
      .populate({ path: "manager", strictPopulate: false })
      .populate({
        path: "involved",
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

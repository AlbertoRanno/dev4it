const { validationResult } = require("express-validator");
const Persona = require("../models/Persona");
const Proyecto = require("../models/Proyecto");
const mongoose = require("mongoose");
const moment = require("moment");
const { ObjectId } = require("mongodb"); ;

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
        res.set({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
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

    // Busco en c/persona si ya estaba involucrada en este proyecto, y si estaba, lo borro
    // para guardar solamente donde corresponda
    Persona.find({}, (error, personas) => {
      if (error) {
        return res.status(500).json({
          message: `Error: ${error}`,
        });
      }
      for (let i = 0; i < personas.length; i++) {
        let indiceArray = personas[i].projectInfo.indexOf(id);
        if (indiceArray != -1) {
          personas[i].projectInfo.splice(indiceArray, 1);
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
      //console.log(toAssign);

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
          let projectsInfo = [];
          let link = req.body.link;
          let observations = req.body.observations;
          let active = req.body.active;

          console.log(typeof involved);

          switch (typeof involved) {
            case "undefined":
              involved = [];
              break;

            case "string":
              involved = [];
              involved.push(req.body.involved);

              Persona.findById(req.body.involved, (error, persona) => {
                if (error) {
                  return res.status(500).json({
                    message: "Error buscando el proyecto",
                  });
                }
                persona.projectInfo.push(id);
                persona.save();
              });

              for (let i = 0; i < toAssign.length; i++) {
                let projectInfo = {
                  person: toAssign[i]._id,
                  nivel: req.body.nivel[i],
                  porcAsigXContrato: req.body.porcAsigXContrato[i],
                  porcAsigReal: req.body.porcAsigReal[i],
                  hsMensXContrato: req.body.hsMensXContrato[i],
                  hsReales: req.body.hsReales[i],
                  observationsUser: req.body.observationsUser[i],
                  _id: new mongoose.Types.ObjectId(),
                };
                console.log(involved.toString());
                console.log(projectInfo.person.toString());

                

                const objectId1 = new ObjectId(projectInfo.person);  
                const objectId2 = new ObjectId(req.body.involved);
                console.log(objectId1.equals(objectId2));
                console.log(projectsInfo);
                if (objectId1.equals(objectId2)) {
                  projectsInfo.push(projectInfo);
                  console.log(projectsInfo);
                }
              }

              break;

            case "object":
              let personalInvolucrado = req.body.involved;
              involved = [];
              for (let i = 0; i < personalInvolucrado.length; i++) {
                involved.push(personalInvolucrado[i]);

                Persona.findById(personalInvolucrado[i], (error, persona) => {
                  if (error) {
                    return res.status(500).json({
                      message: `${error}`,
                    });
                  }
                  persona.projectInfo.push(id);
                  persona.save();
                });
              }

              for (let i = 0; i < toAssign.length; i++) {
                let projectInfo = {
                  person: toAssign[i]._id,
                  nivel: req.body.nivel[i],
                  porcAsigXContrato: req.body.porcAsigXContrato[i],
                  porcAsigReal: req.body.porcAsigReal[i],
                  hsMensXContrato: req.body.hsMensXContrato[i],
                  hsReales: req.body.hsReales[i],
                  observationsUser: req.body.observationsUser[i],
                  _id: new mongoose.Types.ObjectId(),
                };

                for (let j = 0; j < involved.length; j++) {
                  if (projectInfo.person.equals(involved[j])) {
                    projectsInfo.push(projectInfo);
                  }
                }
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
              projectsInfo,
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

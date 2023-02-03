const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const Persona = require("../models/Persona");
const Proyecto = require("../models/Proyecto");
const mongoose = require("mongoose");
const fetch = require("node-fetch");

let roles = [
  "Gestor de proyectos",
  "Administrador de soluciones",
  "Web designer",
  "Diseñador UI/UX",
  "Frontend Developer",
  "Backend Developer",
  "Database Administrator",
  "Arquitecto Cloud",
  "QA",
  "otros",
];

let seniority = ["Trainee", "Junior", "Semisenior", "Senior"];

let datosProyectos = [];

Proyecto.find({}, (error, proyectos) => {
  if (error) {
    return res.status(500).json({ message: "Error buscando los proyectos" });
  } else {
    for (let i = 0; i < proyectos.length; i++) {
      datosProyectos.push(proyectos[i]);
    }
  }
});

const controller = {
  prueba: async (req, res) => {
    const personas = await Persona.find({}).populate({
      path: "proyects",
      strictPopulate: false,
    });
    res.json(personas);
  },
  list: (req, res) => {
    Persona.find({}, (error, personas) => {
      if (error) {
        return res.status(500).json({
          message: "Error mostrando las personas",
        });
      }
      res.render("./staff/personal", {
        listado: personas,
      });
    });
  },
  detail: (req, res) => {
    let id = req.params.id;
    Persona.findById(id, (error, persona) => {
      if (error) {
        return res.status(500).json({
          message: `Error buscando a la persona con el id: ${id}`,
        });
      } else {
        res.send(persona);
        /*
        res.render("./staff/detail", {
          persona,
        });*/
      }
    }).populate({ path: "proyects", strictPopulate: false });
  },
  search: (req, res) => {
    const loQueBuscoElUsuario = req.query.search.toLocaleLowerCase();
    const results = [];

    Persona.find({}, (error, personas) => {
      if (error) {
        return res.status(500).json({
          message: "Error en la búsqueda",
        });
      } else {
        for (let i = 0; i < personas.length; i++) {
          if (
            personas[i].name.toLocaleLowerCase().includes(loQueBuscoElUsuario)
          ) {
            results.push(personas[i]);
          }
        }

        res.render("./staff/search", {
          loQueBuscoElUsuario,
          results,
        });
      }
    });
  },
  register: (req, res) => {
    res.render("./staff/register", {
      datosProyectos,
      roles,
      seniority,
    });
  },
  store: (req, res) => {
    const resultValidation = validationResult(req);

    Persona.find(
      {
        email: req.body.email,
      },
      (error, userInDB) => {
        if (error) {
          return res.status(500).json({
            message: "Error buscando las personas",
          });
        }
        if (userInDB.length >= 1) {
          res.render("./staff/register", {
            errors: {
              email: {
                msg: "Ya existe un usuario registrado con este email",
              },
            },
            oldData: req.body,
            datosProyectos,
            roles,
            seniority,
          });
        } else if (resultValidation.isEmpty()) {
          console.log(req.body);
          const personal = new Persona({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            rol: req.body.rol,
            password: bcryptjs.hashSync(req.body.password, 10),
            projectsInfo: [],
            seniority: req.body.seniority,
            avatar: "/images/avatars/" + req.file.filename,
            active: true,
            admin: false,
          });

          //console.log(typeof req.body.proyects);
          if (typeof req.body.proyects == "string") {
            personal.projectsInfo.push({ proyect: req.body.proyects });

            Proyecto.findById(req.body.proyects, (error, proyecto) => {
              if (error) {
                return res.status(500).json({
                  message: "Error buscando el proyecto",
                });
              }
              proyecto.involved = proyecto.involved.concat(personal._id);
              proyecto.save();
            });
          }

          //console.log(typeof req.body.proyects);
          if (typeof req.body.proyects == "object") {
            let proyectosInvolucrados = req.body.proyects;
            for (let i = 0; i < proyectosInvolucrados.length; i++) {
              personal.projectsInfo.push({ proyect: proyectosInvolucrados[i] });

              Proyecto.findById(proyectosInvolucrados[i], (error, proyecto) => {
                if (error) {
                  return res.status(500).json({
                    message: "Error buscando los proyectos",
                  });
                }
                proyecto.involved = proyecto.involved.concat(personal._id);
                proyecto.save();
              });
            }
          }

          personal.save((error) => {
            if (error) {
              return res.status(500).json({
                message: "Error guardando en DB",
              });
            }
          });
          res.redirect("/personal");
        } else {
          res.render("./staff/register", {
            errors: resultValidation.mapped(),
            oldData: req.body,
            datosProyectos,
            roles,
            seniority,
          });
        }
      }
    );
  },
  login: (req, res) => {
    res.render("./staff/login");
  },
  access: (req, res) => {
    Persona.findOne(
      {
        email: req.body.email,
      },
      (error, userToLogin) => {
        //console.log(userToLogin);
        if (error) {
          return res.status(500).json({
            message: "Error buscando al usuario que quiere ingresar",
          });
        } else {
          if (userToLogin) {
            let isOkThePassword = bcryptjs.compareSync(
              req.body.password,
              userToLogin.password
            );
            if (isOkThePassword) {
              //si email y password OK, guardo al usuario en session. Pero antes, por seguridad, elimino el Password
              delete userToLogin.password;
              req.session.userLogged = userToLogin;
              //console.log(req.session);

              if (req.body.rememberUser) {
                //si vino la casilla tildada, seteo una nueva cookie, guardando asi el email en el cliente
                res.cookie("userEmail", req.body.email, {
                  maxAge: 1000 * 60 * 60 * 24,
                });
              }

              res.redirect("./profile/" + userToLogin.id);
            } else {
              res.render("./staff/login", {
                errors: {
                  email: {
                    msg: "Credenciales inválidas",
                  },
                },
              });
            }
          } else {
            res.render("./staff/login", {
              errors: {
                email: {
                  msg: "Usuario no encontrado en la base de datos",
                },
              },
            });
          }
        }
      }
    );
  },
  profile: (req, res) => {
    res.render("./staff/profile", {
      user: req.session.userLogged,
    });
  },
  logout: (req, res) => {
    res.clearCookie("userEmail");
    req.session.destroy();
    return res.redirect("/");
  },
  edit: (req, res) => {
    let id = req.params.id;

    Persona.findById(id, (error, personalToEdit) => {
      if (error) {
        return res.status(500).json({
          message: `Error localizando a la persona con el id: ${id}`,
        });
      } else {
        res.render("./staff/edit", {
          personalToEdit,
          datosProyectos,
          roles,
          seniority,
        });
      }
    });
  },
  update: (req, res) => {
    const resultValidation = validationResult(req);
    let id = req.params.id;

    // lo borro de todos los proyectos, y luego guardo donde corresponda
    Proyecto.find({}, (error, proyectos) => {
      if (error) {
        return res.status(500).json({
          message: "Error buscando los proyectos",
        });
      }

      for (let i = 0; i < proyectos.length; i++) {
        let indiceArray = proyectos[i].involved.indexOf(id);
        if (indiceArray != -1) {
          proyectos[i].involved.splice(indiceArray, 1);
          proyectos[i].save();
        }
      }
    });

    Persona.findById(id, (error, userToModify) => {
      if (error) {
        return res.status(500).json({
          message: `Error buscando a la persona con id: ${id}`,
        });
      } else {
        if (resultValidation.isEmpty()) {
          let name = req.body.name;
          let email = req.body.email;
          let rol = req.body.rol;
          let password = bcryptjs.hashSync(req.body.password, 10);
          let proyects = req.body.proyects;
          let seniority = req.body.seniority;
          let avatar = req.body.avatar;
          let active = req.body.active;
          delete req.body.repeatPassword;

          console.log(typeof proyects);

          switch (typeof proyects) {
            case "undefined":
              proyects = [];

              break;

            case "string":
              Proyecto.findById(proyects, (error, proyecto) => {
                if (error) {
                  return res.status(500).json({
                    message: "Error buscando el proyecto",
                  });
                }
                proyecto.involved = proyecto.involved.concat(id);
                proyecto.save();
              });
              break;

            case "object":
              let proyectsInvolucrados = req.body.proyects;

              for (let i = 0; i < proyectsInvolucrados.length; i++) {
                Proyecto.findById(
                  proyectsInvolucrados[i],
                  (error, proyecto) => {
                    if (error) {
                      return res.status(500).json({
                        message: "Error buscando los proyectos",
                      });
                    }
                    proyecto.involved = proyecto.involved.concat(id);
                    proyecto.save();
                  }
                );
              }
              break;

            default:
              res.status(500).json({
                message: `No coincide con los casos - ${error}`,
              });
              break;
          }

          Persona.findByIdAndUpdate(
            id,
            {
              name,
              email,
              rol,
              password,
              proyects,
              seniority,
              avatar,
              active,
            },
            (error, persona) => {
              if (error) {
                return res.status(500).json({
                  message: `Error actualizando al usuario con id: ${id}`,
                });
              } else {
                res.redirect("/personal/detail/" + id);
              }
            }
          );
        } else {
          res.render("./staff/edit", {
            errors: resultValidation.mapped(),
            oldData: req.body,
            datosProyectos,
            personalToEdit: userToModify,
            roles,
            seniority,
          });
        }
      }
    });
  },
  softdelete: (req, res) => {
    let id = req.params.id;
    Persona.findByIdAndUpdate(id, { active: false }, (error, persona) => {
      if (error) {
        return res.status(500).json({
          message: "Error eliminando al usuario",
        });
      } else {
        console.log(`${persona.name} eliminado correctamente`);
        res.redirect("/personal");
      }
    });
  },
  delete: (req, res) => {
    let id = req.params.id;
    Persona.findByIdAndDelete(id, (error) => {
      if (error) {
        return res.status(500).json({
          message: "Error elimando al usuario",
        });
      } else {
        console.log("La eliminación definitiva ha sido exitosa");
        res.redirect("/personal");
      }
    });
  },
};

module.exports = controller;

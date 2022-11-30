const JsonModel = require("../models/jsonModel");
const proyectsModel = new JsonModel("proyects");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const Persona = require("../models/Persona");

let datosProyectos = proyectsModel.readJsonFile();

const controller = {
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
        res.render("./staff/detail", {
          persona,
        });
      }
    });
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
        console.log(userInDB);
        if (userInDB.length >= 1) {
          res.render("./staff/register", {
            errors: {
              email: {
                msg: "Ya existe un usuario registrado con este email",
              },
            },
            oldData: req.body,
            datosProyectos,
          });
        } else if (resultValidation.isEmpty()) {
          const personal = new Persona({
            name: req.body.name,
            email: req.body.email,
            rol: req.body.rol,
            password: bcryptjs.hashSync(req.body.password, 10),
            proyects: req.body.proyects,
            seniority: req.body.seniority,
            avatar: "/images/avatars/" + req.file.filename,
          });
          delete req.body.repeatPassword;

          personal.save((error) => {
            if (error) {
              return res.status(500).json({
                message: "Error mostrando las personas",
              });
            }
          });
          res.redirect("/personal");
          //res.redirect("/personal/detail/" + resultado.id);

          // let updatedUserId = personalModel.save(req.body);

          // res.redirect("/personal/detail/" + updatedUserId);
        } else {
          res.render("./staff/register", {
            errors: resultValidation.mapped(),
            oldData: req.body,
            datosProyectos,
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
        console.log(userToLogin);
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
        /* VOLVER LUEGO DEL CRUD DE PROYECTOS *************************************** */
        console.log(personalToEdit);
        console.log(datosProyectos);
        res.render("./staff/edit", {
          personalToEdit,
          datosProyectos,
        });
      }
    });
  },
  update: (req, res) => {
    const resultValidation = validationResult(req);
    let id = req.params.id;

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

          if (!req.file) {
            console.log(
              "No se editó la imagen. Traigo la que tenía en base de datos"
            );
            req.body.avatar = userToModify.avatar;
          } else {
            console.log("Se editó la imagen. Subo la nueva.");
            req.body.avatar = "/images/avatars/" + req.file.filename;
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
            },
            (error, persona) => {
              if (error) {
                return res.status(500).json({
                  message: `Error actualizando al usuario con id: ${id}`,
                });
              } else {
                console.log(persona);
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
          });
        }
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
        console.log("Usuario eliminado correctamente");
        res.redirect("/personal");
      }
    });
  },
};

module.exports = controller;

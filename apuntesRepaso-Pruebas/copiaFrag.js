  update: (req, res) => {
    const resultValidation = validationResult(req);
    let id = req.params.id;
    //console.log(id);

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
          delete req.body.repeatPassword;

          /*
          Proyecto.updateMany(
            {}, //filtro . Ejemplo { price: 300}
            { $set: { involved: [] } }, //actualizacion a aplicar . Ejemplo { price: 200, descuento: 300 }
            { multi: true }, // Opciones ... a chequear
            (error, data) => {
              if (error) {
                console.log(error);
              } else {
                console.log(data);
              }
            }
          );
          */

          console.log(typeof proyects);

          switch (typeof proyects) {
            case "undefined":
              proyects = [];

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
              break;

            case "string":
              // Casos para el único proyecto del que forma parte:
              Proyecto.findById(proyects, (error, proyecto) => {
                if (error) {
                  return res.status(500).json({
                    message: "Error buscando el proyecto",
                  });
                }
                // lo borro de todos, y lo grabo solo en el que va??
                

                if (proyecto.involved.length === 0) {
                  console.log("caso 1 - Primer involucrado del proyecto");
                  proyecto.involved = proyecto.involved.concat(id);
                  proyecto.save();
                } else if (
                  proyecto.involved.length === 1 &&
                  proyecto.involved[0].toString() === id
                ) {
                  console.log(
                    "caso 2 - El proyecto ya lo tenía como único involucrado"
                  );
                } else if (
                  proyecto.involved.length === 1 &&
                  proyecto.involved[0].toString() !== id
                ) {
                  console.log(
                    "caso 3 - El proyecto tenía un involucrado, y lo suma a él"
                  );
                  proyecto.involved = proyecto.involved.concat(id);
                  proyecto.save();
                } else if (proyecto.involved.length > 1) {
                  if (proyecto.involved.indexOf(id) == -1) {
                    console.log(
                      "caso 4 - El proyecto tiene varios involucrados, y lo suma a él"
                    );
                    proyecto.involved = proyecto.involved.concat(id);
                    proyecto.save();
                  } else {
                    console.log(
                      "caso 5 - El proyecto tiene varios involucrados, y él ya lo estaba"
                    );
                  }
                }
              });

              break;

            case "object":
              let proyectsInvolucrados = req.body.proyects;
              console.log(proyectsInvolucrados);

              let resto = [];
              for (let j = 0; j < datosProyectos.length; j++) {
                if (
                  proyectsInvolucrados.indexOf(
                    datosProyectos[j]._id.toString()
                  ) === -1
                ) {
                  resto.push(datosProyectos[j]._id.toString());
                }
              }
              console.log(resto);

              for (let i = 0; i < proyectsInvolucrados.length; i++) {
                Proyecto.findById(
                  proyectsInvolucrados[i],
                  (error, proyecto) => {
                    if (error) {
                      return res.status(500).json({
                        message: "Error buscando los proyectos",
                      });
                    }
                    if (proyecto.involved.indexOf(id) === -1) {
                      proyecto.involved = proyecto.involved.concat(id);
                    }
                    proyecto.save();
                  }
                );
              }

              for (let i = 0; i < resto.length; i++) {
                Proyecto.findById(resto[i], (error, proyecto) => {
                  if (error) {
                    res.status(500).json({
                      message: "Error buscando los proyectos",
                    });
                  }
                  console.log(proyecto.involved);
                  let indiceArray = proyecto.involved.indexOf(id);
                  console.log(indiceArray);
                  proyecto.involved = proyecto.involved.splice(indiceArray, 1);
                  console.log(proyecto.involved);

                  proyecto.save();
                });
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
            },
            (error, persona) => {
              if (error) {
                return res.status(500).json({
                  message: `Error actualizando al usuario con id: ${id}`,
                });
              } else {
                //console.log(persona);
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
  }
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
          delete req.body.repeatPassword;

          //Busco todos los proyectos en los que el usuario esté involucrado:
          Proyecto.find({ involved: id }, (error, proyecto) => {
            if (error) {
              return res
                .status(500)
                .json({ message: "Error buscando los proyectos" });
            } else {
              console.log(proyecto);
              //Elimino su vínculo:

              for (let i = 0; i < proyecto.length; i++) {
                for (let j = 0; j < proyecto[i].involved.length; j++) {
                  const indiceArray = proyecto[i].involved[j].findIndex(
                    (proyecto) => proyecto.involved == id
                  );
                  console.log(indiceArray);
                  if (indiceArray >= 0) {
                    proyecto.splice(indiceArray, 1);
                    //splice(corta desde este ìndice, esta cantidad de elementos)
                    proyecto.save();
                  }
                }
              }

              //Guardo los cambios
              console.log("POST:");
              console.log(proyectos);
            }
          });

          // //Grabo su vínculo, acorde si está involucrado en uno solo (me llega string), más de 1 (me llega object), o ninguno (no hago ninguna relación con los proyectos):

          // console.log(typeof proyects);
          // if (typeof proyects == "string") {
          //   let proyectosInvolucrados = [];
          //   proyectosInvolucrados.push(req.body.proyects);
          //   Proyecto.findById(proyectosInvolucrados, (error, proyecto) => {
          //     if (error) {
          //       return res.status(500).json({
          //         message: "Error buscando el proyecto",
          //       });
          //     }
          //     proyecto.involved = proyecto.involved.concat(id);
          //     proyecto.save();
          //   });
          // }

          // if (typeof proyects == "object") {
          //   console.log("Varios proyectos");
          //   let proyectosInvolucrados = req.body.proyects;
          //   for (let i = 0; i < proyectosInvolucrados.length; i++) {
          //     Proyecto.findById(proyectosInvolucrados[i], (error, proyecto) => {
          //       if (error) {
          //         return res.status(500).json({
          //           message: "Error buscando los proyectos",
          //         });
          //       }
          //       proyecto.involved = proyecto.involved.concat(id);
          //       proyecto.save();
          //     });
          //   }
          // }

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
  },
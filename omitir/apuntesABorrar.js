
// 1-11-22 *************

// npm init - package.json - dependencias/modulos
// npm install express - requerirlo - guardar su ejecución en una constante "app"
//Escritura de manejadores de peticiones con diferentes verbos HTTP en diferentes caminos URL (rutas)
// creo datos como un objeto con propiedades clave-valor, y lo exporto - lo requiero en app.js

const PUERTO = process.env.PORT || 3000;
// cuando suba la pagina, el puerto lo asignara el entorno, por eso la primer opcion
app.listen(PUERTO, () => {
console.log(`El servidor se esta escuchando en el puerto ${PUERTO}...`)})

//Ruteo
app.get("/api/datos", (req, res) => {res.send(datos)})
// Es la forma que usa express para rutear
// res.send(JSON.stringify(datos)) para convertir en formato json

// 2-11-22 *************

//Parametros URL "/:id"
app.get("/api/datos/personal/:id", (req, res) => {
  // lo extraigo del request con:
  const id = req.params.id;
  const resultados = datos.personal.filter((persona) => persona.id == id);
  // Obs! Ojo que acá no entendía el error, y era por como tenía los datos, y con === no funcionaba
  // (string vs number)

  if (resultados.length === 0) {
    return res.status(404).send(`No se encontro a nadie con el id ${id}`);
  }
  res.send(resultados);
});


//Doble Parámetro URL - Chequear, no funciona:
routerPersonas.get("/:rol/:seniority", (req, res) => {
  const rol = req.params.rol
  const seniority = req.params.seniority

  const resultados = datos.personal.filter(persona => persona.rol == rol && persona.seniority == seniority)

  if (resultados.length === 0) {
    return res.status(404).send(`No se encontró personal que cumpla con rol ${rol} y sea ${seniority}`)
  }

  res.send(resultados)
})

//codigos de estado
// "res.status(404)" porque el recurso no fue encontrado ".send"...
// status(200) viene por defecto, significa todo ok

//Parametros Query
// Al final de la URL, empiezan con ? y tienen un par clave=valor
// ej... ?ordenar=id
// si en esa ruta, pongo: console.log(req.query.ordenar); en consola veré "id"

// Sirven, entre otros, para ordenar los resultados en un orden especifico:

app.get("/api/datos/personal", (req, res) => {
  //http://localhost:3000/api/datos/personal?ordenar=id
  console.log(req.query.ordenar);
  if (req.query.ordenar == "id") {
    return res.send(datos.personal.sort((a, b) => b.id - a.id));
    //el método sort, permite ordenar una lista, en base a un criterio, determinado por la funcion
    //en este caso, se ordena uno u otro primero, si el signo de eso da + o - (cambiando por a.id - b.id)
  }
  res.send(datos.personal);
});

// Routers
// Sirven para simplificar lo confuso que pueden llegar a ser varias rutas largas: /api/datos/proyectos
const routerProyectos = express.Router()
app.use("/api/datos/proyectos", routerProyectos);
// Reemplazan: app.get("/api/datos/proyectos/:id", (req,...
// Por: routerProyectos.get("/:id", (req,...

//El archivo quedaba demasiado grande. Entoces llega la separacion en distintos archivos
//Carpeta routers

//Probando POST mediante la extension REST Client

//PUT - hay que enviar todos los campos de la entidad, aunque solo cambien algunos de esos valores
// Sino, utilizar Patch
routerPersonas.put("/:id", (req, res) => {
  //actualizo con la info que viaja en el body, que en este caso simulo con la extension
  const personalActualizado = req.body;
  //capturo el id con req.params
  const id = req.params.id;
  //averiguo a que ìndice del array de personal pertene la persona con ese nro de id
  //recordad que es == y no === porque en la URL viene como string y en la base de datos en number
  const indiceArray = datos.personal.findIndex((persona) => persona.id == id);
  //si ese id no esta en el array devuelve -1
    if (indiceArray >= 0) {
  //si esta, reemplazo los datos de ese indice, por el que viajo en el body
      datos.personal[indiceArray] = personalActualizado;
    }
    res.send(json.stringify(datos.personal));
});

//PATCH - Reemplaza No todo, como put, sino solamente algunas propiedades
routerPersonas.patch("/:id", (req, res) => {
  const infoActualizada = req.body;
  const id = req.params.id;

  const indiceArray = datos.personal.findIndex((persona) => persona.id == id);

  if (indiceArray >= 0) {
    const personalAModificar = datos.personal[indiceArray];
    //Metodo de Objetos que permite modificar SOLO ALGUNAS propiedades del objeto
    //Recibe un objeto a modificar, y otro que tiene propiedades y valores
    Object.assign(personalAModificar, infoActualizada);
  }
  res.send(JSON.stringify(datos.personal));
});

//DELETE
routerPersonas.delete("/:id", (req, res) => {
  const id = req.params.id;
  const indiceArray = datos.personal.findIndex((persona) => persona.id == id);
  if (indiceArray >= 0) {
    datos.personal.splice(indiceArray, 1);
    //splice(corta desde este ìndice, esta cantidad de elementos)
  }
  res.send(JSON.stringify(datos.personal));
});

//Obs!
res.send(JSON.stringify(datos));
// cuando envio un objeto, o un arreglo de JS con res.send, se va a enviar igual con JSON, aunque no ponga JSON.stringify
res.send(datos);
// tambien, cuando quiera asegurarme de que algo vaya en formato json, uso
res.json(datos)
//que lo que hace, es llamar detras de escena a json.stringify

// 3-11-22 *************

//HTML

//https://developer.mozilla.org/es/
//Elementos: componentes basicos de HTML. Se determinan con las etiquetas/Tags
//identacion recomendada, 2 espacios. Si el codigo ya fue escrito, Ctrl + ] ó Ctrl + [
// Alt + Z adapta a que todo el codigo se vea sin tener que desplazarse laterlamente
//<!---->
/*seleccionando codigo Ctrl + / lo comenta .. No funciona
Ir a Preferences->Key Bindings - User y pegar lo siguiente:
{ "keys": ["ctrl+7"], "command": "toggle_comment", "args": { "block": false } },
{ "keys": ["ctrl+shift+7"], "command": "toggle_comment", "args": { "block": true } }
Para probarlo, selecciona el texto, y presiona simultáneamente Ctrl7. Y listo, a disfrutar! La solución fue reemplazar el métodos abreviados de teclado por defecto Ctrl/. Por Ctrl7, que es la misma tecla en el teclado.*/
//<a href="https://translate.google.com.ar/" target="_blank" rel="nooper noreferrer">acordarse tablero React</a> Para que el enlace abra otra pestaña y por motivos de seguridad (para prevenir un ataque donde la pestaña de origen se reemplaza, para que le usuario deje sus datos, lo cual es una brecha de seguridad)
/*Enlaces a otros lugares de la misma pagina:
<a href="#prueba">Prueba</a>
<h4 id="prueba">Prueba</h4>*/
//Dead Links href="#" se usan durante el desarrollo, para ver como quedan, antes de direccionar. 
// Listas No ordenadas:   <ul> <li>1</li> <li>2</li> </ul>
// Ordenadas: Idem con <ol>
//<strong>Prueba</strong> <s>Prueba</s> <em>Prueba</em> <small>Prueba</small>
//dividir secciones: <hr>
/*Formularios
<form action="/enviar-respuesta">
      <label for="masculino"><input id="masculino" type="radio" name="masculino-femenino"
          value="masculino" />Masculino</label><br />

      <label for="femenino"><input id="femenino" type="radio" name="masculino-femenino" value="femenino"
          checked />Femenino</label><br />

      <label for="ansioso"><input type="checkbox" id="ansioso" name="personalidad"
          value="ansioso" />Ansioso</label><br />
      <label for="perezoso"><input type="checkbox" id="perezoso" name="personalidad" value="perezoso"
          checked />Perezoso</label><br />

      <input type="text" placeholder="Contraseña" required />
      <button type="submit">Enviar</button>
    </form>

-Label hace que al hacer click en el texto al lado del circulito, este se seleccione, lo cual es mas comodo para el usuario
-For="" la vincula al input con el id correspondiente
-name hace referencia al grupo (todos los que tengan el mismo name)de ellos, solo uno podra quedar seleccionado
-Salto de linea: <br />
-Casillas de Verificacion, a igual name, mismo grupo, pero varias simultaneas a diferencia de radio
-Checked Marca por defecto    
-value el valor que tomara el formulario cuando se envie
*/    
//div - cajita para contener elementos
//head - elementos detras de escena. Importantes para el ranking

//CSS

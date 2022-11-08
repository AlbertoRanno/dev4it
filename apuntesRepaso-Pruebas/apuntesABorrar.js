// 1-11-22 *************

// npm init - package.json - dependencias/modulos
// npm install express - requerirlo - guardar su ejecución en una constante "app"
//Express me permite manejar las peticiones de los diferentes verbos HTTP, en diferentes caminos URL (rutas)
// creo datos como un objeto con propiedades clave-valor, y lo exporto - lo requiero en app.js

const PUERTO = process.env.PORT || 3000;
// cuando suba la pagina, el puerto lo asignara el entorno, por eso la primer opcion
app.listen(PUERTO, () => {
  console.log(`El servidor se esta escuchando en el puerto ${PUERTO}...`);
});

//Ruteo
app.get("/api/datos", (req, res) => {
  res.send(datos);
});
// Es la forma que usa express para rutear

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
  const rol = req.params.rol;
  const seniority = req.params.seniority;

  const resultados = datos.personal.filter(
    (persona) => persona.rol == rol && persona.seniority == seniority
  );

  if (resultados.length === 0) {
    return res
      .status(404)
      .send(
        `No se encontró personal que cumpla con rol ${rol} y sea ${seniority}`
      );
  }

  res.send(resultados);
});

//codigos de estado
// "res.status(404)" porque el recurso no fue encontrado ".send"...
// status(200) viene por defecto, significa todo ok

//Parametros Query
// Al final de la URL, empiezan con ? y tienen un par clave=valor
// ej: ...?ordenar=id
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
const routerProyectos = express.Router();
app.use("/api/datos/proyectos", routerProyectos);
// Reemplazan: app.get("/api/datos/proyectos/:id", (req,...
// Por: routerProyectos.get("/:id", (req,...

//El archivo quedaba demasiado grande. Entoces llega la separacion en distintos archivos
//Carpeta routers

//Probando POST mediante la extension REST Client

//PUT - hay que enviar todos los campos de la entidad, aunque solo cambien algunos de esos valores (el resto se sobreescribe)
// Sino, utilizar Patch
routerPersonas.put("/:id", (req, res) => {
  //actualizo con la info que viaja en el body, que en este caso simulo con la extension
  const personalActualizado = req.body;
  //capturo el id con req.params
  const id = req.params.id;
  //averiguo a que ìndice del array de personal pertenece la persona con ese nro de id
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
res.json(datos);
//que lo que hace, es llamar detras de escena a json.stringify

// 3-11-22 *************

//HTML

//https://developer.mozilla.org/es/
//En un archivo nuevo del tipo html o ejs , "!" y enter, para que complete la estructura basica
//Elementos: componentes basicos de HTML. Se determinan con las etiquetas/Tags
//identacion recomendada, 2 espacios. Si el codigo ya fue escrito, Ctrl + ] ó Ctrl + [
// Alt + Z adapta a que todo el codigo se vea sin tener que desplazarse lateralmente
//<!---->

/*seleccionando codigo Ctrl + / lo comenta .. No funciona
Ir a Preferences->Key Bindings - User y pegar lo siguiente:
{ "keys": ["ctrl+7"], "command": "toggle_comment", "args": { "block": false } },
{ "keys": ["ctrl+shift+7"], "command": "toggle_comment", "args": { "block": true } }
Para probarlo, selecciona el texto, y presiona simultáneamente Ctrl7. Y listo, a disfrutar! La solución fue reemplazar el métodos abreviados de teclado por defecto Ctrl/. Por Ctrl7, que es la misma tecla en el teclado.*/

//<a href="https://translate.google.com.ar/" target="_blank" rel="nooper noreferrer">tablero React</a> Para que el enlace abra otra pestaña (sin irse de la actual) y por motivos de seguridad (para prevenir un ataque donde la pestaña de origen se reemplaza, para que le usuario deje sus datos, lo cual es una brecha de seguridad)

/*Enlaces a otros lugares de la misma pagina:
<a href="#prueba">Prueba</a>
<h4 id="prueba">Prueba</h4>*/

//Dead Links href="#" se usan durante el desarrollo, para ver como quedan, antes de direccionar.
// Listas No ordenadas:   <ul> <li>1</li> <li>2</li> </ul> (viñetas)
// Ordenadas: Idem con <ol> (numeradas)
//<strong>Prueba</strong> <s>Prueba</s> <em>Prueba</em> <small>Prueba</small>
//dividir secciones: <hr> (linea)
//Salto de linea: <br />

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
-name hace referencia al grupo (todos los que tengan el mismo name) de ellos, solo uno podra quedar seleccionado
-Casillas de Verificacion, a igual name, mismo grupo, pero varias simultaneas a diferencia de radio
-Checked - Hace que esa opcion venga determinada por defecto en la pagina  
-value el valor que tomara el formulario cuando se envie
*/

//div - cajita para contener elementos
//head - elementos detras de escena (por ejemplo, titulo, links a css, a js, fuentes, bootstraps..) y son importantes para el ranking de google

//CSS
// * { } - selector universal   // .nombre { } - class="" //  #nombre { } - id=""

//font-family: 'Franklin Gothic Medium' va entre comillas porque son vs palabras, sino no hace falta
/* En inspeccionar - Elementos - Calculados - por lo bajo figuran las fuentes renderizadas
Muy util para saber si tomo el estilo o no
https://fonts.google.com/   - copiar links al head, en la pagina, debajo de lo que copio, ver como llamarla en el css */

// de mas interno a externo: contenido, padding, border, margin
// 20vw depende del tamaño del navegador
// 1.5em depende del tamaño de la fuente del contenedor (si todo en ese contenedor tiene un tamaño de 16px, y quiero hacer resaltar algo, le pongo 1.5em y tendra 24px
// rem relativa al tamaño de letra del elemento raiz
// vw relativa al 1% del ancho de la ventana grafica
// vh relativa al 1% del alto de la ventana grafica

/* Priorizar estilos 
*Caso 1: h1 class="texto-azul texto morado"  lo mismo da, que los escriba al reves
el color que se aplicara, es el de la ultima regla del archivo de css
Por ej:
texto-azul { color: blue }
texto-morado { color: purple }
Determinara que el texto sera purple, independientemente del orden de las clases en el archivo .js

*Caso 2: En css: a { text-decoration: purple wavy underline}
Y al mismo elemento le pongo una clase .sin-subrayado { text-decoration: none }
Tiene precedencia (mayor prioridad) la clase, por lo que no tendra subrayado

*Caso 3: id vs class - Id tiene prioridad
*Caso 4: estilo en linea vs id (ponerle en el html el atributo style="color:purple" gana esto)
*Caso 5: si quiero que gane un estilo, sin importar nada, le tengo que agregar:" !important " 
Ej. .texto-azul { color:blue !important}
Prioridades: !important > estilo en linea > id > class > selectores
*/

/* Variables en CSS
pongo al elemento la clase correspondiente, por ej "color-variable", y en el css:
.color-variable {  --nombre-variable: blue   } 
con eso (los "--") defino la variable, y luego la aplico en las otras reglas que quiero usarla:
.imagen-epigrafe {
  background-color: var(--color-variable, black) 
} asi, al cambiar el color en la variable, cambiara en todas las reglas donde la haya usado.
El: ...", black )" corresponde al color de respaldo, por si no se puede acceder a la variable.
En el caso de que algunos navegadores no reconozcan las variables de CSS, se solìa poner la propiedad antes. Cosa de que configuren el color, y si, toman las variables, lo reemplacen. Y si no las toman, al menos ya quedo ese color. Ejemplo:
background-color: black
background-color: var(--color-variable, black)
*/

// 4-11-22 *************

//EJS (Embedded JS) - Template Engine (Se pueden usar varios otros)
/*
Hacen dinamicos los html (los muestra entrando a las URL), me permiten introducir en el html, contenido de js como arrays, ciclos for, etc mediante el uso de etiquetas como <% %>, y me evitan repetir codigo con los partials (Headers, Footers, NavBars..)
La extension de los html debe pasar a .ejs
npm install ejs
en app.js Seteo el motor de plantillas que quiero usar mediante: */
app.set("view engine", "ejs");
/* todos los ejs deben estar en una carpeta views en la raiz del proyecto
si quisiera reubicarla, o renombrarla, por ejemplo:*/
app.set("views", "./src/nombreCarpeta");
/* M-V-C - las vistas se comunican con los controladores, y toman la informacion que estos reciben de los modelos*/
/* Acordarse de setear en app.js la carpeta con contenido publico*/
app.use(express.static("./public"));
//En el sistema de ruteo de app, fijarse que las rutas mas especificas vayan primero, finalizando en la raiz "/"
/* Archivo de ruta basico:
const express = require("express");
const routerMain = express.Router();
const mainController = require("../controllers/mainController");

routerMain.get("/", mainController.main);

module.exports = routerMain; */
/* Archivo de controlador basico 
const controller = {
  main: (req, res) => {
    res.render("index");
  },
};

module.exports = controller;
Observar que ya con EJS uso el metodo render, para renderizar la vista (en lugar de send para enviar los datos*/

/* Etiquetas EJS
<% %> Para embeber codigo de JS como condicionales, ciclos, etc
<%= %> Para imprimir en el html */

/* Bootstraps - Pegar links de CSS en header y de JS al fin del body
Se puede descargar o instalar con npm - luego indagar */

// CRUD **********************************

// *********** Search ***********
/* Vista:
<h2>Buscador de Usuarios: </h2>
Un form por Get, para que me traiga la vista con los resultados:
<form action="/personal/search" method="GET">
  <input type="text" name="search" />  // (*search*)
  <input type="submit" value="Enviar" />
</form>
Por estar bien configurado el form, cuando presione en Enviar, me dirijira a la siguiente URL:
http://localhost:3000/personal/search?search=a
donde el ..al/search?.. es porque ahi configure que fuera el form
y el ?search=a es porque (*search*) lo llame... y "a" es lo que puse en el input para que se busque.
La info del input del form, viaja en el query porque asi viene configurado el form? */

// Controlador:
search: (req, res) => {
  //lo que busca el usuario lo levanto con una query, con el mismo nompre que le puse al input
  const loQueBuscoElUsuario = req.query.search; // (*search*)
  // si buscara risotto por ej:
  console.log(req.query); //{ search: 'risotto' }
  console.log(req.query.search); //risotto
  // LA INFO VIAJA EN EL QUERY PORQUE ESTOY USANDO EL METODO GET! (probar de cambiar el POST del register por un get, y vere los clave valor de los inputs todos en la URL! )

  const results = [];

  //paso ambos strings a minuscula para hacer la comparacion
  for (let i = 0; i < datos.personal.length; i++) {
    if (
      datos.personal[i].nombre
        .toLocaleLowerCase()
        .includes(loQueBuscoElUsuario.toLocaleLowerCase())
    ) {
      results.push(datos.personal[i].nombre);
    }
  }

  res.render("./staff/search", { loQueBuscoElUsuario, results });
};

//lo importante, es que los controladores le comparten, como segundo parametro, un objeto a la vista, que puede tener todas las propiedades valor que yo necesite. Notar que los nombres de las claves son los que necesitare en la vista para acudir al valor (clave: valor). Y recordar que {results} == {results: results}

/* Obs Orden de Rutas
routerProyectos.use("/search", proyectsController.search);

routerProyectos.get("/:id", proyectsController.detail);

routerProyectos.get("/", proyectsController.list);

Si /search, estuviera luego de /:id ... no podrìa acceder, dado que buscaria primero que que la palabra "search", fuera un id.. y por como lo configure, diria que no se encuentra dicho id */

// En app.js , para capturar todo lo que venga de un Form, en forma de un Obj. Lit: (*sigue*)
app.use(express.urlencoded({ extended: false }));
//y que, a su vez, me permita convertir dicha data a un formato JSON, si asi lo quiero:
app.use(express.json());
//*sigue* - la info viaja en el body. Body es el objeto literal (clave / valor) donde los nombres de las claves son los "name" que le haya puesto a los inputs. Y el valor, lo que el visitante haya ingresado. Obs! Si el input no tuviera name, el valor no llega al body..

/*   store: (req, res) => {
    //al viajar por post, la info viene en el body (por get venia por query) ****IMPORTANTE****
    //res.send(req.body) //todos los inputs con sus valores
    let usuario = {nombre: req.body.nombre, edad: req.body.edad, email: req.body.email}
    console.log(usuario);
    //falta guardarlo
    //Para los metodos que no son GET, recordar el "redirect"
    res.redirect("/personal")
  } */

/* Dado que "no todos los navegadores soportan PUT/DELETE" (method solo por GET y POST), instalo method-override para asegurar compatibilidad.
npm install method-override -save
luego lo requiero en app.js*/
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
/* con esto voy a poder sobrescribir los methods originales de los form (GET y POST) 
Este "_method" es el que voy a utilizar en la etiqueta de los Form, para decir que, indistintamente del method que diga, lo que quiero enviar, irá por el verbo que yo pase como query string
<form action="/personal/:id/update?_method=PUT" method="POST">
*/

//Obs los put/patch/delete viajan en los form - No hacer botones sueltos

/* PATH
viene por defecto en Node.js - lo requiero donde lo quiere usar: */
let path = require("path")
/* La funcion que trae, join(), permite: */
let archivoUsuarios = path.join("registros","usuarios","archivo.json")
console.log(archivoUsuarios); // /registros/usuarios/archivo.json
let extension = path.extname(archivoUsuarios);
console.log(extension);//.json
let directorio = path.dirname(archivoUsuarios);
console.log(directorio);// /registros/usuarios

/* FS
-es otro paquete nativo - permite levantar info de un archivo. Hay que requerirlo: */
const fs = require("fs")
/* 1er parametro, la ruta donde esta. - Ruta absoluta desde la raiz. Ej: let data = fs.readFileSync("src/data/data.json", "utf-8");
2do parametro, "utf-8", para decodificarlo
- si levanto un JSON, lo convierto a obj. lit con JSON.parse() */
let users = fs.readFileSync("users.json", "utf-8")
let usersJson = JSON.parse(users)

/*
edit: (req, res) => {
    let id = req.params.id;
    let personalToEdit = datos.personal.find(persona => persona.id == id);
    //OBS! antes tenia filter.. y me daba un array.. entonces tenia que poner:
     personalToEdit: personalToEdit[0] para indicar que era el primer (y unico) elemento del mismo..
     Pero, como es justamente, un unico elemento, uso "find", que devuelve el primer elemento que cumple
    res.render("./staff/edit", { personalToEdit: personalToEdit });
  }, */
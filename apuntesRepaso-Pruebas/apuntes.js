// 1-11-22 *************

// npm init - package.json - dependencias/modulos
// npm install express - requerirlo - guardar su ejecución en una constante "app"
// Express me permite manejar las peticiones de los diferentes verbos HTTP, en diferentes caminos URL (rutas)
// BD: creo datos como un objeto con propiedades clave-valor, y lo exporto - lo requiero en app.js - Mas adelante reemplazare por JSON con el JsonModel - Luego adaptaré a MongoDB

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
//en el query viaja la info por GET - Probar de a un Form , ponerle method GET, y vere los clave valor de los inputs viajar por la URL

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
//Carpeta routers y controladores

//Probando POST/PUT/PATCH/DELETE mediante la extension REST Client - luego la desinstale

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

/*seleccionando codigo HTML y CSS, tambien lo comento con ctrl + k + c */

//<a href="https://translate.google.com.ar/" target="_blank" rel="nooper noreferrer">tablero React</a> Para que el enlace abra otra pestaña (sin irse de la actual) y por motivos de seguridad (para prevenir un ataque donde la pestaña de origen se reemplaza, para que le usuario deje sus datos, lo cual es una brecha de seguridad)

/*Enlaces a otros lugares de la misma pagina - en lugar de una ruta, le paso un id

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

ID PARA LOS FORs DE LAS LABELS
NAME PARA QUE VIAJEN LOS DATOS EN ESAS PROPS

-Label hace que al hacer click en el texto al lado del checkbox, este se seleccione, lo cual es mas comodo para el usuario
-For="" la vincula al input con el id correspondiente!! si, el id! (no, el name)
-name hace referencia al grupo (todos los que tengan el mismo name) de ellos, solo uno podra quedar seleccionado
name es el nombre de la prop con la que viajara la info en el body !!!
-Casillas de Verificacion, a igual name, mismo grupo, pero varias simultaneas a diferencia de radio
-Checked - Hace que esa opcion venga determinada por defecto en la pagina  
-value el valor que tomara el formulario cuando se envie (no todos tienen "VALUE", por ej. TextArea no lo tiene)
*/

//div - cajita para contener elementos
//head - elementos detras de escena (por ejemplo, titulo, links a css, a js, fuentes, bootstraps..) y son importantes para el ranking de google

//CSS
// * { } - selector universal
// selectores { }
// .nombre { } - class=""
// #nombre { } - id=""

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
.variables {  --nombre-variable: blue   } 
con eso (los "--") defino la variable, y luego la aplico en las otras reglas que quiero usarla:
.encabezado {
  background-color: var(--color-variable, black) 
} asi, al cambiar el color en la variable, cambiara en todas las reglas donde la haya usado.

Se necesitan ambas clases en la etiqueta: <h1 class="encabezado variables">dev4it</h1>

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
Por viajar por GET, el form, cuando presione en Enviar, me dirijira a la siguiente URL:
http://localhost:3000/personal/search?search=a
donde el ..al/search?.. es porque ahi configure que fuera el form
y el ?search=a es porque (*search*) lo llame con NAME (no con ID)... y "a" es lo que puse en el input para que se busque.
La info del input del form, viaja en el query porque por ahi viaja la info por GET */

// Controlador:
search: (req, res) => {
  //lo que busca el usuario, como fue por GET, viajo en la query, por lo que la levanto, con el mismo nompre que le puse al input
  //que seria el nombre de la propiedad del objeto req.query, y lo que busco el usuario, su valor
  const loQueBuscoElUsuario = req.query.search; // (*search*)
  // si buscara risotto por ej:
  console.log(req.query); //{ search: 'risotto' } - AHI VEO EL NOMBRE DEL INPUT
  console.log(req.query.search); //risotto
  // LA INFO VIAJA EN EL QUERY PORQUE ESTOY USANDO EL METODO GET (probar de cambiar el POST del register por un get, y vere los clave valor de los inputs todos en la URL )

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

Si /search, estuviera luego de /:id ... no podrìa acceder, dado que buscaria primero que la palabra "search", fuera un id.. y por como lo configure, diria que no se encuentra dicho id */

//IMPORTANTE:
// En app.js , para capturar todo lo que venga de un Form, en forma de un Obj. Lit: (*sigue*)
app.use(express.urlencoded({ extended: false }));
//y que, a su vez, me permita convertir dicha data a un formato JSON, si asi lo quiero:
app.use(express.json());
//*sigue* - la info viaja en el body. Body es el objeto literal (clave / valor) donde los nombres de las claves son los "name"!! que le haya puesto a los inputs. Y el valor, lo que el visitante haya ingresado. Obs! Si el input no tuviera name, el valor no llega al body..

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
let path = require("path");
/* La funcion que trae, join(), permite: */
let archivoUsuarios = path.join("registros", "usuarios", "archivo.json");
console.log(archivoUsuarios); // /registros/usuarios/archivo.json
let extension = path.extname(archivoUsuarios);
console.log(extension); //.json
let directorio = path.dirname(archivoUsuarios);
console.log(directorio); // /registros/usuarios

/* FS
-es otro paquete nativo - permite levantar info de un archivo. Hay que requerirlo: */
const fs = require("fs");
/* 1er parametro, la ruta donde esta. - Ruta absoluta desde la raiz. Ej: let data = fs.readFileSync("src/data/data.json", "utf-8");
2do parametro, "utf-8", para decodificarlo
- si levanto un JSON, lo convierto a obj. lit con JSON.parse() */
let users = fs.readFileSync("users.json", "utf-8");
let usersJson = JSON.parse(users);

/*
edit: (req, res) => {
    let id = req.params.id;
    let personalToEdit = datos.personal.find(persona => persona.id == id);
    //OBS! antes tenia filter.. y me daba un array.. entonces tenia que poner:
     personalToEdit: personalToEdit[0] para indicar que era el primer (y unico) elemento del mismo..
     Pero, como es justamente, un unico elemento, uso "find", que devuelve el primer elemento que cumple
    res.render("./staff/edit", { personalToEdit: personalToEdit });
  }, */

/*  store: (req, res) => {
    let newPersonal = {
      nombre: req.body.nombre,
      edad: req.body.edad,
      email: req.body.email,
    };

    fs.appendFileSync("src/data/data.json", JSON.stringify(newPersonal));
    res.redirect("/personal");
  },
  lo guarda al final del JSON, no puedo elegir en que parte
   */

// 9-11-22 *************
/* POO
  - con la palabra clave "new", y el objeto preconstruido "Object()"
  - tengo un especie de marco en blanco para construir cualquier objeto.
  - al cual le puedo ir agregando cualquier propiedad:
  */
let nuevoObjeto = new Object();
console.log(nuevoObjeto); //{}
nuevoObjeto.info = "Soy la 1er prop de este objeto!";
console.log(nuevoObjeto); //{ info: 'Soy la 1er prop de este objeto!' }
nuevoObjeto.mostrarInfo = function () {
  alert(this.info);
};
console.log(nuevoObjeto); /* { info: 'Soy la 1er prop de este objeto!',
                              mostrarInfo: [Function (anonymous)]} */
/* Esta forma sirve, si tuviera que crear un solo objeto - "Patron de diseño Singleton"
 Pero si tuviera que ir creando varios objetos, cada uno con sus propiedades, lo mejor es una:
 Funcion Constructora: (multiples instancias) - una especie de plantilla para instanciar los objetos que quiera */
function Constructora() {
  this.info = "Soy un nuevo objeto";
  this.mostrarInfo = function () {
    alert(this.info);
  };
  this.configurarInfo = function (nuevaInfo) {
    this.info = nuevaInfo;
  };
}

let nuevoObjeto1 = new Constructora();
console.log(nuevoObjeto1); /*
    Constructora {
  info: 'Soy un nuevo objeto',
  mostrarInfo: [Function (anonymous)],
  configurarInfo: [Function (anonymous)]
} */
let nuevoObjeto2 = new Constructora();
nuevoObjeto2.configurarInfo("Cambio!");
console.log(nuevoObjeto2); /*
    Constructora {
  info: 'Cambio!',
  mostrarInfo: [Function (anonymous)],
  configurarInfo: [Function (anonymous)]
} */

/* Otro Ej. con Argumentos */
function Persona(nombrePersona) {
  this.nombre = nombrePersona;
  this.info = "Esta persona se llama " + this.nombre;
  this.mostrarInfo = function () {
    alert(this.info);
  };
}
let persona1 = new Persona("Adán");
let persona2 = new Persona("Eva");

/* JsonModel
const JsonModel = require("../models/jsonModel");
const personalModel = new JsonModel("personal");
//console.log(personalModel);
/*
JsonModel {
  name: 'personal',
  dataDir: '../data/',
  dataPath: 'C:\\Users\\Albert\\Desktop\\dev4it\\src\\data\\personal.json' 
}
*/

// let dataJSON = fs.readFileSync("src/data/personal.json", "utf-8");
// let datos = JSON.parse(dataJSON);  // Se reduce a :
let datos = personalModel.readJsonFile();

/*
detail: (req, res) => {
    const id = req.params.id;
  //antes: const resultados = datos.filter((persona) => persona.id == id);
    let persona = personalModel.buscar(id) //se redujo a esta expresion

    if (!persona) {
  //  if (resultados.length === 0) {
      return res.status(404).send(`No se encontro a nadie con el id ${id}`);
    }

    res.send(resultados);
  },
  
  */

/* VALIDACIONES
  npm install express-validator
  para usar en rutas y controladores

  en el ejs:
  <form action="/personal/register" method="POST" enctype="multipart/form-data">
  para usar Multer (imagenes) - la informacion ahora no solo es texto, sino que viene con archivos
  npm install multer - es un middleware
  lo requiero en el archivo de RUTAS y lo configuro:
  const multer = require("multer");
  const path = require("path");

  const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/avatars");
  },
  filename: (req, file, cb) => {
    console.log(file)
    let filename = `${Date.now()}_img${path.extname(file.originalname)}`;
    cb(null, filename);
  },
  });

  const uploadFile = multer({ storage });

y lo paso en la ruta como el middleware que es:

  routerPersonas.post(
  "/register",
  uploadFile.single("avatar"),   // "avatar" porque es el nombre del input del form
  personalController.store       // "single" porque levanto de a una sola foto
  );

Ya con multer, ahora al viajar por post, tengo, ademas del objeto body, el objeto file

siguiendo con express-validations
requiero body en la ruta:
const { body } = require("express-validator") // body o check
(solo necesito la funcion body)
esto me permite pasar el middleware de validaciones:
const validations = [
  body("name").notEmpty(),
  body("rol").notEmpty(),
  body("seniority").notEmpty(),
  body("email").notEmpty()
];

routerPersonas.post(
  "/register",
  uploadFile.single("avatar"), validations,
  personalController.store
);

requiero validationResult en el controlador para capturar el resultado de las validaciones
const { validationResult } = require("express-validator")
  store: (req, res) => {
    const resultValidation = validationResult(req);
    return res.send(resultValidation);
   
//     {
// "errors": [
// {
// "value": "",
// "msg": "Invalid value", // se cambia si en las validaciones pongo .withmessage("Otro msj")
// "param": "email",
// "location": "body"
// }
// ]
// } 

    //res.send({ body:req.body, file:req.file});

    //res.redirect("/personal");
  },

   */

/*
    store: (req, res) => {
    const resultValidation = validationResult(req);
    console.log(resultValidation.mapped()); 

    //mapped() returns: an object where the keys are the field names, and the values are the validation errors

    
    {
  name: {
    value: '',
    msg: 'Este campo no puede estar vacio',
    param: 'name',
    location: 'body'
  },
  rol: {
    value: '',
    msg: 'Este campo no puede estar vacio',
    param: 'rol',
    location: 'body'
  },
  seniority: {
    value: '',
    msg: 'Este campo no puede estar vacio',
    param: 'seniority',
    location: 'body'
  },
  email: {
    value: '',
    msg: 'Este campo no puede estar vacio',
    param: 'email',
    location: 'body'
  }
}
  
  */

// 10-11-22 *************
/* Bootstrap
-Un estilo de formulario responsive - con una sola row, y columnas dentro, donde cada vez que se superan las 12 columnas, se pasa al renglón debajo

<body>
    <div class="container">
    Siempre como marco

      <form action="" method="post" class="row g-3 mt-3">
      row para que ponga los inputs en fila, uno al lado del otro
      g-3 para el espacio vertical entre etiquetas
      la clase row la puede tener directo el form como en este caso
      o hacer un div que lo envuelva, si luego del form, y dentro del div, quiesiera poner mas cosas
      mt-3 - margin top de 3, para que lo separe un poco

        <div class="col-6">
          el espacio disponible lo divide en 12 columnas, 6 ocupa la mitad
          12 para que ocupe todo el espacio disponible
          puedo completar 6 - 3 - 3, o, 9 - 3 , o dejar solo un input de cualquier tamaño

          <label for="email" class="form-label">Email</label>
          form-label para estilos etiquetas

          <input
            type="email"
            class="form-control"
            form-control para estilos inputs

            id="email"
            placeholder="Ingresa tu mail"
          />
        </div>

        <div class="col-12">
          <div class="form-check">
          un div con form-check es necesario para envolver a los checkboxs. Sino no funcionan las clases internas

            <label for="checkTerms" class="form-check-label">Acepto los términos</label>
            form-check-label para que la etiqueta se acomode al lado del checkbox

            <input type="checkbox" class="form-check-input" id="checkTerms" />
            form-check-input para que el cuadradito tome el mismo formato que los inputs
          </>
        </div>

          <div class="col-12">
          <button type="submit" class="btn btn-primary">Registrarse</button>
          btn btn-primary estilo del boton a gusto

        </div>

      </form>
    </div>
  </body> */

/* Otro Estilo de form con bootstrap - para que queden los nombres de los inputs, al costado de los mismos:

      <div class="container">
      <form action="" class="mt-3">
        <div class="row mb-3">
        mb-3 margin boton para dejar espacio con el que esta abajo

          <label for="name" class="col-2 col-form-label"> Nombre del proyecto: </label>
          la clase ahora se llama col-form-label

          <div class="col-10">
            <input type="text" id="name" class="form-control" />
          </div>
        </div>
        <div class="row mb-3">
          <label for="date" class="col-2 col-form-label"> Fecha de inicio: </label>
          <div class="col-2">
            <input type="date" id="date" class="form-control" />
          </div>
        </div>
        
      </form>
    </div>
   */

/* Seguiste con Formularios - Vistas - Validaciones - Partiales - Navbar  */

// 15-11-22 *************
/* Sesions y Cookies 
    
    Carpeta Middlewares, y paso los middlewares que estaban en las rutas, y los exporto/importo,
    cada uno en un archivo (multer por un lado, y el conjunto de validaciones de cada pogina por otro.
    
    Hasta ahora, del modelo M-V-C, tengo las vistas y controladores, pero falta el modelo.
    Aun no toque base de datos de lleno por tratarse de Documentales (solo vi relacionales - MySQL)
    por lo que voy a usar el JsonModel que tiene las funciones basicas del CRUD: (Más adelante adopto MongoDB)

  Guardar al usuario en la DB
  Buscar al usuario a loguear (por su email)
  Buscar al usuario por ID
  Editar info usuario
  Eliminar usuario de la DB
    
    Recordar luego que los nombres de los Modelos van con Mayuscula, por convencion
*/

{
  store: (req, res) => {
    const resultValidation = validationResult(req);

    //Verifico que no haya sido cargado previamente:
    let userInDB = personalModel.filtrarPorCampoValor("email", req.body.email);

    if (userInDB.length >= 1) {
      res.render("./staff/register", {
        /*Para usar la misma config de validaciones, le comparto a la vista un objeto de igual nombre:
        "errors", con la misma prop y msg, para que salte como una validacion mas.
        Notar que no estoy asociando este errors a a validationResult */
        errors: {
          email: { msg: "Ya existe un usuario registrado con este email" },
        },
        oldData: req.body,
      });
    } else if (resultValidation.isEmpty()) {
      /* Si el mail no estaba ya ingresado, y no hubo errores de validacion (isEmpty es una propiedad
        que viene con validationResult), procedo a guardar en BD, pero cambio los valores de las props
        password (lo encripto), y avatar /(que me guarde la ruta, no solo el nombre). Filename es como defini
        el nombre en la config del storage */
      (req.body.password = bcryptjs.hashSync(req.body.password, 10)),
        (req.body.avatar = "/images/avatars/" + req.file.filename);

      //bcryptjs.compareSync("contraseña", hash) esta la usaré para chequear en el Login
      console.log(req.body);

      /* guardo en la BD, y obtengo el nuevo ID, el cual uso para enviar al detalle de usuario */
      let updatedUserId = personalModel.save(req.body);

      res.redirect("/personal/" + updatedUserId);
    } else {
      res.render("./staff/register", {
        errors: resultValidation.mapped(),
        oldData: req.body,
      });
    }
    //mapped() returns: an object where the keys are the field names, and the values are the validation errors
  };
}

/* Encriptado de Contraseñas:
  npm install bcryptjs */
const bcryptjs = require("bcryptjs");
let hash = bcryptjs.hashSync("contraseña", 10);
console.log(hash); //hashea la contraseña, 10 o 12 era el nivel de salt, "suficiente para contraseñas".
console.log(bcryptjs.compareSync("contraseña", hash)); // T o F

// 16-11-22 *************
/* Continuo con el CRUD
Completando el register de personas - Vista Detalles - Login - Profile -etc

Session, es un objeto literal, que cruza toda la app (req.session), y va a tener la info que yo quiera.
Session se destruye al cerrar el navegador.
Los datos de profile vienen de Session.
Pero para usarlo, tengo que instalarlo:
npm install express-session
Y requerirlo en app:
const session = require("express-session")
Y se va a pasar como un middleware a nivel app para que cruce toda la app:
app.use(
  session({
    secret:
      "texto único aleatorio para identificar este sitio web y evitar que otras páginas usen lo que guardo en session",
    //tendría que ir encriptada con bcrypts??
    resave: false, 
    saveUninitialized: false, //https://github.com/expressjs/session#options"
  })
); */
//En el login , si email y password OK, guardo al usuario en session. Inventandole a session una prop. userLogged:
req.session.userLogged = userToLogin;
console.log(req.session);
/*
Session {
  cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }, // viene por default
  userLogged: {                                                                // prop que agrego p/guardar al usuario
    name: 'Alberto Daniel Ranno',
    email: 'albert@hotmail.com',
    rol: 'Magic Dev',
    password: '$2a$10$uLtPpvXS64Po0euX1QcrE.4Guu1pmbuXnjyuyJtjix3u1nse7bVCa',
    seniority: 'Jr.',
    repeatPassword: '$2a$10$jkLVCYZbBwc7dnIoUP9fT.KtAzWqlAzPTL953L1adIQKMJ3jtFjPy',
    proyects: [ 'DevOps interno', 'Exp. de producto' ],
    avatar: '/images/avatars/1668619176234_img.png',
    id: 5
  }
}
*/
/* implementé los: */
delete req.body.repeatPassword; // en el register, para que directamente no se guarde
delete req.body.password; // en el login, cuando estoy guardando al usuario en session, para que no ande viajando el password por toda la app

/* Si estoy logueado, no entrar al register/login. Hago middleware a nivel ruta - si hay alguien en session, redirijo al profile, sino sigue camino */
function guest(req, res, next) {
  if (req.session.userLogged) {
    res.redirect("/personal/profile/:id");
  }
  next();
}

module.exports = guest;
/* complemento: hago otro middleware, auth, si no hay nadie en session, por la URL no deberia de poder acceder al profile */

{
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  };
}

/* middleware userLogged - middleware a nivel app, para saber si hay alguien logueado y mostrar/no-mostrar menues. Lo paso en la app. Sin ejecutarlo, porque al no tener parametros el solo sabra cuando ejecutarse */
const userLogged = require("./middlewares/userLogged");
app.use(userLogged);

/* recordar que el orden en que ponga los middleware de app, en ese orden se ejecutaran.
POR LO TANTO, este middleware, tiene que ir despues del middleware de session!

Y recordar que si pusiera un console.log("Pasé por el middleware userLogged") dentro del archivo userLogged en la carpeta middlewares, por cada pagina a la que entre, veria la leyenda un monton de veces, porque se
ejecuta por cada peticion que hace la app */

/* res.locals son variables que cruzan toda la app, (esté o no, en session... ) por eso les creo una prop
"isLogged" y en base a esa informo rapidamente a cada seccion si hay un usuario logueado, o no, y su comportamiento.
Si lo hiciera directo con session, tendrìa que poner condicionales en cada lado, en cambio, asì hago uno solo para todos los casos*/
function userLogged(req, res, next) {
  if (req.session && req.session.userLogged) {
    /*req.session se crea una vez que entro al login, por eso tmb tengo que preguntar si hay alguien logueado */
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged; //paso obj session, a locals, para tenerlo disponible globalmente
  }
  next();
}

module.exports = userLogged;

/* https://developer.mozilla.org/es/docs/Web/HTTP/Cookies
RECORDAR: session se guarda del lado del servidor, y cookies del lado del cliente (por servidor y por navegador. Lo que guardo en Firefox, no estara disponible en chrome)
npm i cookie-parser
idem, es un middleware a nivel app: */
const cookies = require("cookie-parser");
app.use(cookies()); //este si se ejecuta
/* idem, es otro objeto literal */

// 17-11-22 *************
/* Pause cookies, retome CRUD sobre proyectos - con sus vistas - controladores - validaciones

OBS! IMP! Recordar que en los value de los EJS , aunque los complete con <%= %>, hay que ponerles las comillas!! sino, solo toma la primer palabra de los strings!
value= " <%= ... %> "

Obs, recordad los condicionales ternarios:
<%= locals.oldData && oldData.condition === estados[i] ? "selected" : " " ; %>

retomo cookies:

seteo de a una sola cookie, por eso singular "cookie" - y res porque la guardo en el cliente
if (req.body.rememberUser) { //si vino la casilla tildada, seteo una nueva cookie:
          res.cookie("userEmail", req.body.email, {maxAge: (1000 * 60 * 60 * 24 * 30)})
        }
Al entrar al controlador donde puse eso, me crea la cookie userEmail en el navegador (la puedo ver por el mismo)

si quisiera ver las cookies, las traigo todas, por eso plural "cookies"
login: (req, res) => {
    console.log(req.cookies); 
    res.render("./staff/login");
  },

Reutilizo el middleware userLogged: (ya que el usuario puede estar en sesion por loguearse, o por haber dejado recordado el usuario con la cookie)

const JsonModel = require("../models/jsonModel");
const usersModel = new JsonModel("users"); // lo traigo para buscar el usuario de la cookie

// ************ NavBar - Logout - RememberUser - Middleware a nivel app  ************

function userLoggedMiddleware(req, res, next) {
  //si tengo a alguien en session muestro una parte de la barra de navegación
  //let isLogged = false; // invento esta variable para determinar cuando muestro y cuando no
  res.locals.isLogged = false;
  //IMP! la paso a variable local, para que se puedan compartir entre las vistas, indistintamente del controlador (1)

  // si tengo a alguien en una cookie, quiero buscar a esa persona y loguearlo
  let emailInCookie = req.cookies.userEmail;
  //console.log(emailInCookie);
  let usersFromCookie = usersModel.filtrarPorCampoValor("email", emailInCookie); // Recordar que devuelve un ARRAY!!!
  let userFromCookie = usersFromCookie[0];
  //console.log(userFromCookie);
  // Por lo tanto, si encuentro a alguien, lo paso a session! (2)
  if (userFromCookie) {
    req.session.userLogged = userFromCookie
  }

  // (1) Por lo que en el header, puedo hacer un condicional sobre lo que muestro, basado en este booleano
  // y, si tengo alguien en session (2), es porque tengo a alguien logueado, 
  if (req.session.userLogged) {
    // la session se crea una vez que entro al Login, por lo que pregunto si hay alguien logueado
    res.locals.isLogged = true;
    //Por lo que si tengo a alguien logueado se mostrará Mi cuenta y Logout, caso contrario, login y register
    res.locals.userLogged = req.session.userLogged;
    //Arriba estoy pasando lo que tengo en session a las variables locales (de nuevo, para tenerlas disponible en todas las vistas)
  }

  next();
}

module.exports = userLoggedMiddleware;

*/

// 18-11-22 *************
/*
Organización de pendientes - CSS en gral, botoneras de flujo, vistas de EDIT */

// 24-11-22 *************
/*Mongo DB 
BD NoSQL - significa No relacional (es decir, que no se guardan en tablas relacionales, pero SI PUEDEN GUARDAR RELACIONES ENTRE DATOS - Las relaciones pueden estar incluso anidadas en una única escritura - banca bien cruce de miles de datos, la otra -la que usé - se usa para cruce de muchos millones de datos)
Su versión community - es una versión masiva gratuita
Base de datos de documentos (Mayor productividad y escalabilidad) Cada registro, es un documento, que no es más que una estructura de pares Clave-Valor, que pueden contener diferentes tipos: strings - booleans - numbers... Los cuales son similares a objetos JSON. y las valores de los campos pueden tener otros documentos, arrays, o arrays de documentos.Ej:
{
  name: "sue",
  age: 26,
  status: "A",
  groups: ["news", "sports"]
}
Los objetos anidados, permiten omitir los JOINS de SQL, lo que hace las consultas más sencillas.
Mongo almacena los documentos en colecciones, que son el equivalente a las Tablas

MongoDB es el servidor, que de por sí viene con una consola.
MongoDB Compass, es la interfaz grafica de esa consola, es decir, es más fácil manejar las conexiones por Compass, que solo tipear comandos en la consola.
https://www.mongodb.com/try/download/community
Descargo de ahí, y destildo la opción de que se instale como un servicio. Si se instalara como tal, estaría funcionando desde que arranca el windows, y no es necesario. (aunque si lo instalo como servicio, también después se podría revertir)
Por lo cual, al entrar a Compass, en nueva conexión, mongo estará apagado. Entro en:
C:\Program Files\MongoDB\Server\6.0\bin y tendré 1 ejecutable:
mongod.exe - es el servidor de la BD - doble click , lo abro
Pero se cierra porque necesita que cree un directorio previo:
C:\data\db (creo una carpeta en la raiz, y la otra dentro)
Acá almacenará la info de las colecciones
Ahora sí ejecuto mongod.exe, y veré un:
Listening on","attr":{"address":"127.0.0.1"}} que es la dirección de IP de la propia PC
"Waiting for connections","attr":{"port":27017,"ssl":"off"}}
Al ver esto sé que MongoDB está funcionando. Puedo minimizar la ventana, pero tiene que estar corriendo.
En compass, ya viene la URL local por defecto: mongodb://localhost:27017 , le doy a conectar
Y vienen 3 colecciones por defecto: admin / config / local

Propiedades del sistema - Variables de entorno - Path - Editar - Nuevo y agregar:
C:\Program Files\MongoDB\Server\6.0\bin
Así podré ejecutar el servidor de Mongo, desde cualquier parte de la ventana de comandos

//BD online:
https://cloud.mongodb.com/v2/637f8dbca8f9c471f53ed62e#clusters/edit?filter=starter&fromPathSelector=true
Username: Halgren
Password: 0AA1tjxDGwtuyb7y
Connect from: My Local Environment - IP Access List: 190.49.22.181/32  - 
Connect to Cluster0 
Copy the connection string, then open MongoDB Compass:
mongodb+srv://Halgren:<password>@cluster0.2sd9dcs.mongodb.net/test
reemplazo el password:
mongodb+srv://Halgren:0AA1tjxDGwtuyb7y@cluster0.2sd9dcs.mongodb.net/test

Y hay diferentes programas para conectarse con Mongo:
ROBOT 3T: https://studio3t.com/download-studio3t-free (Viejo - preferible usar Compass)
Voy a New Connection - pego la dirección, y pongo conectar

Para conectar Node.Js con MongoDB, se usa Mongoose 
(es un ODM - Object Document Mapped)
npm install mongoose
en app o sus correspondientes modulos (conexion en db.js en data - Schema y Modelo en Persona.js en models - Mostrar/Crear/Etc en los correspondientes controladores)*/
const mongoose = require("mongoose"); //vincula la app con la BD
const url = "mongodb://localhost/dev4it"; //la dirección de la BD - La que me pide Compass en New Connection
/*dentro de esta url:
-mongodb - para que sepa que es una base de este tipo
-localhost - servidor local
-/nombreDeLaBaseDeDatos

1º Defino conexiones:
-si es a una sola BD - mongoose.connect
-si es a más de una BD - mongoose.createConnection.

Ambas, connect y createConnection toman: mongodb:// URI, or the parameters host, database, port, options.*/

//conecto con la BD - los parámetros comentados en versiones viejas son necesarios para evitar todos los avisos de Deprecated
mongoose
  .connect(
    url
    /*
    ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
    }
  */
  )
  .then(() => console.log("Conectado a Mongoose"))
  .catch((e) => console.log("El error de conexión es " + e));

/* Para crear el Modelo de datos que va a seguir mi BD (M-v-c), necesito un Schema. Ej.

const Comment = new Schema({
  name: { type: String, default: 'hahaha' },
  age: { type: Number, min: 18, index: true },
  bio: { type: String, match: /[a-z]/ },
  date: { type: Date, default: Date.now },
  buff: Buffer
}); */

//Ojo a las mayúsculas que no me funcionaba...
//const mongoose = require("mongoose");
//const { Schema } = mongoose;

const PersonaSchema = new mongoose.Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    rol: { type: String },
    password: { type: String },
    proyects: [{ type: Schema.Types.ObjectId, ref: "Proyecto" }],
    seniority: { type: String },
    avatar: { type: String },
  },
  { versionKey: false }
);

//convención, arrancar con Mayúscula, y aclarar que es un modelo
const Persona = mongoose.model("Persona", PersonaSchema);
//"Persona" es el nombre en singular de la colección para la cual sirve el modelo
module.exports = Persona;

//Mostrar
const mostrar = async () => {
  const personal = await PersonalModel.find({ name: "Hernán Mercado" }); //find() para todos
  console.log(personal);
};
mostrar();

//Crear
const crear = async () => {
  const personal = new PersonalModel({
    name: "Mario",
    email: "Mario",
    rol: "Mario",
    password: "Mario",
    seniority: "Mario",
    avatar: "Mario",
  });
  const resultado = await personal.save();
  console.log(resultado);
};
crear();

// 25-11-22 *************
/* Días de quilombos, que siguen.. le vengo dedicando poco...
Hoy corrección de Labels - Edit de proyectos (falta update) - Repaso - Separación en módulos de MongoDB - Comenzando con el CRUD sobre la BD

OBS! Sin esto: */
const db = require("./data/db");
/* Sin eso, aunque no se use directamente db, no se conecta a la BD */

// 29-11-22 *************
/*Entendí en parte como traer en base al ID de MongoDB, y logré acceder a Detalle de usuario */

// 30-11-22 *************
/* 
De usuarios: el search, edit, update, delete, login (todo gracias a lo del id que me tenía bloqueado)

OJO con find vs findONE
Si find, encuentra uno, lo deja como un elemento dentro de un array, en cambio findOne, brinda directamente el objeto

Observacion vieja para recordar:
- Tremenda contra de usar un simple JSON como BD, es que no hay vínculos, por ej. los proyectos de las personas no se actualizan */

// 01-12-22 *************
/*
const ProyectoSchema = new mongoose.Schema(
  {
   _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    description: { type: String },
    manager: { type: String },
    condition: { type: String },
    dateStart: { type: Date, default: Date.now },
    dateEnd: { type: Date },
    involved: [{ type: Schema.Types.ObjectId, ref: "Persona" }],
    link: { type: String },
  },
  { versionKey: false }
); // Para que no cree el __v:0 en la BD
 */

/* Así se exporta cuando es más de una variable:
const Proyecto = mongoose.model("Proyecto", proyectoSchema);
const Persona = mongoose.model("Persona", personaSchema);
module.exports = { Proyecto, Persona };

Así se importa:
const { Persona, Proyecto } = require("../models/Persona");

Hay otras formas para ECMAScript 6, pero hay que habilitarlas primero, las de arriba son las clásicas
*/

// 06-12-22 *************
/*
Corregido POR FIN el error que no permitía grabar usuariuos y proyectos:
If you have declared _id field explicitly in schema, you must initialize it explicitly
If you have not declared it in schema, MongoDB will declare and initialize it.
What you can't do, is to have it in the schema but not initialize it. It will throw an error

Lo mejor, es no ponerlo en ningún lado, y dejar que Mongo lo cree automáticamente
MMMM... no, luego lo necesité.. así que lo volví a aclarar en el Schema, pero también en el controlador:  */

const personal = new Persona({
  _id: new mongoose.Types.ObjectId(),
  name: req.body.name,
  email: req.body.email,
  rol: req.body.rol,
  password: bcryptjs.hashSync(req.body.password, 10),
  proyects: req.body.proyects,
  seniority: req.body.seniority,
  avatar: "/images/avatars/" + req.file.filename,
});

// 07-12-22 *************
/* Para las relaciones muchos a muchos en MongoDB hay que ver:

1- la relación entre los esquemas/modelos: */
/* const mongoose = require("mongoose");
const { Schema } = mongoose;

const PersonaSchema = new mongoose.Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    name: { type: String },
    email: { type: String },
    rol: { type: String },
    password: { type: String },
    proyects: [{ type: Schema.Types.ObjectId, ref: "Proyecto" }],
    seniority: { type: String },
    avatar: { type: String },
  },
  { versionKey: false }
);

const Persona = mongoose.model("Persona", PersonaSchema);
module.exports = Persona;
*/

/*
const mongoose = require("mongoose")
const { Schema } = mongoose;

const ProyectoSchema = new mongoose.Schema(
  {
   _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    description: { type: String },
    manager: { type: String },
    condition: { type: String },
    dateStart: { type: Date, default: Date.now },
    dateEnd: { type: Date },
    involved: [{ type: Schema.Types.ObjectId, ref: "Persona" }],
    link: { type: String },
  },
  { versionKey: false }
);


const Proyecto = mongoose.model("Proyecto", ProyectoSchema)
*/

/* 2- Aclarar el ID tanto en el esquema, como en el controlador... (o en ninguno de los 2 lados /pero no 1 y 1)
Acá los declaré en ambos lados, porque después necesité el ID para la relación */

store: (req, res) => {
  const resultValidation = validationResult(req);

  Persona.findOne(
    {
      email: req.body.email,
    },
    (error, userInDB) => {
      if (error) {
        return res.status(500).json({
          message: "Error buscando las personas",
        });
      }
      if (userInDB) {
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
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          rol: req.body.rol,
          password: bcryptjs.hashSync(req.body.password, 10),
          proyects: req.body.proyects,
          seniority: req.body.seniority,
          avatar: "/images/avatars/" + req.file.filename,
        });

        //en este caso estoy creando un objeto a grabar.. y no directamente grabando todo lo que viene en el body, por eso no hace falta el delete req.body.repeatPassword

        //3- capturo el array de objetos relacionados, encuentro cada uno por su ID, cambio la propiedad, y lo guardo:
        let proyectosInvolucrados = req.body.proyects;
        for (let i = 0; i < proyectosInvolucrados.length; i++) {
          Proyecto.findById(proyectosInvolucrados[i], (error, proyecto) => {
            if (error) {
              return res.status(500).json({
                message: "Error buscando los proyectos",
              });
            }
            /*The concat() method is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array*/
            proyecto.involved = proyecto.involved.concat(personal._id);
            proyecto.save();
          });
        }

        //4- Luego de haber guardado el cambio en la colección relacionada, guardo el cambio en la colección principal

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
        });
      }
    }
  );
};

/*5- Es importante tener las mismas consideraciones en ambos controladores: 
   (fragemento del store de proyects: )
... primera parte del controlador... :
   */
let personalInvolucrado = req.body.involved;
for (let i = 0; i < personalInvolucrado.length; i++) {
  Persona.findById(personalInvolucrado[i], (error, persona) => {
    if (error) {
      return res.status(500).json({ message: "Error buscando al personal" });
    }
    persona.proyects = persona.proyects.concat(proyect._id);
    persona.save();
  });
}
// ... sigue guardando la colección principal, en este caso, proyect

// POR FIN! ERRORES ENCONTRADOS:

const Persona = mongoose.model("Persona", PersonaSchema);
/* el ("Persona",... es el nombre del modelo y TAMBIÉN VA EN MAYÚSCULA
Fácil= Todos los nombres dentro de los modelos, que comiencen con Mayúscula y listo */

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
/* en el path, va el Nombre de la propiedad de la colección que quiero ampliar */

// 08-12-22 *************
/* Corregido Store para ningun vinculo, 1, o mas // css register (checkbox y labels) 
Resulta que cuando seleccionaba un solo proyecto (o, en el caso del register de proyectos, una sola persona),
por default, lo guarda como string suelto, y no como un array de un solo string...
Entonces hubo que hacerle un condicional if( typeof ... == "string"){...}
Y al hacer esto, también hubo que cambiar el condicional de cuando venían varios vínculos... lo curioso acá,
es que el typeof, NO era un array... sino un OBJECT!
*/

// 15-12-22 *************
/* Corrigiendo el Update con JS, porque no pude con las querys de Mongo.
 Tuve que cambiar la sucesión de IF a un Switch, por el tema del break (en el caso de undefined, 
redefinía proyects como un array o un string, por lo que entraba en esos ifs... 

No supe corregir este tipo de consulta de Mongo:*/
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

// 4-1-23 *************
/* FINALMENTE los UPDATE funcionando completos!
El punto fue el cambio de lógica: primero borrar el ID en cuestión de Todos los documentos relaciones, 
y después, acorde el caso, grabar el ID solo donde corresponda
(PEGAR DIAGRAMA HECHO EN EXCEL QUE ME AYUDÓ A CORREGIR LA LÓGICA)
*/

// Moment - modulo instalable para cambiar los formatos de las fechas: **** OJO QUE YA NO SE USA ****
const moment = require("moment");
let formattedDateStart = moment(proyectToEdit.dateStart).format("YYYY-MM-DD");
// donde proyectToEdit.dateStart es la fecha que levanto de MongoDB

// 5-1-23 *************
/* Retomo persistencia fecha, tengo que usar el "add", porque mongo me lo guarda con hora.. y a las
00:00:00 Hs de un día, al levantarlo, me lo toma como el dìa anterior, por eso le sumo 1 día */
let formattedDateStart1 = moment(proyectToEdit.dateStart)
  .add(1, "days")
  .format("YYYY-MM-DD");

body("dateStart").custom((value, { req }) => {
  let fechaInicio = req.body.dateStart;
  let fechaFinal = req.body.dateEnd;

  if (moment(fechaInicio).isAfter(fechaFinal)) {
    console.log("La fecha de finalización No puede ser menor a la de inicio");
    throw new Error(
      "La fecha de finalización No puede ser menor a la de inicio"
    );
  }
  return true;
});

/* Día de muchas correciones pendientes.. persistencia de datos, validaciones, reemplazo por selects, agregar campos solicitados, etc... */

// 6-1-23 *************
/* Avanzando, torpemente, con las últimas validaciones..
Moment parece que entró en desuso hace rato... tratar de reemplazarla después

"Si la fecha de fin del proyecto es mayor a la actual, cambiar el estado a Pausado"
Si apunta a que cambie solo, sin ningún disparador... quizás un middleware a nivel app, que se ejecute, chequee y cambie...*/
if (proyect.dateEnd < new Date()) {
  proyect.condition = "Pausado";
}
/* Por ahora lo implenté al momento de que cualquier usuario guarde un nuevo proyecto. */

// 11-1-23 *************
/* Quiero implementarle la parte de API (Application Programming Interface), para luego consumirla con el front-end creado 
con REACT. - y QUE LA PLANTILLA DE REACT SEA EL HOME??

 Me tengo que olvidar de las vistas de la app, y pensar que la info de mis sistema se envíe en formato json, a un endpoint (URL), para ser consumida por otra app, o Postman (en get, es simil buscar en el navegador, pero permite usar los otros 
  verbos http), u otro cliente, el cual no tiene que ser necesariamente del tipo navegador web.
 Tener en cuenta que las rutas no cambian, solo cambiará la forma en que nuestro servidor responderá a las peticiones. (cambian un poco los controladores. Por ej, ya no va el render, sino el res.json configurando como lo enviaré)
 Surgen para compartir información entre apps, son las responsables que pueda dejar una peli empezada en Netflix y retomarla
desde el celu.
 Las hay públicas (info paises), semi-públicas (Twiter - puedo pagar por X cantidad de info) - privadas (Netflix)

 API REST: 
 REST son las siglas de Representational State Transfer
 un sistema a través del cual un front-end se puede comunicar con un back-end de una manera mucho más organizada y funcional.
 Siempre pensando en la optimización y la velocidad del sistema, com así también en la facilidad del uso del mismo.

SISTEMA REST:
  busca implementar un esquema o protocolo que le permita a todos los sistemas que se comunican con él entender en qué forma lo 
 tienen que hacer y bajo que estructura deberán enviar sus peticiones para que sean atendidas

HTTP:
  protocolo que permite que, a través de internet, 2 entidades (cliente y servidor) standarizadas, puedan comunicarse y entenderse mutuamente. Pero no habla de la forma en que lo hacen.. con la forma esta se fue tmb standarizando, y tomó la forma de arquitectura del servicio, donde la más conocida, es REST (ej. Whatsapp - FB - Google)

Características REST:
1- Separar la app en 2.. por un lado la interfaz de usuario, por otro, todo lo que la app provee como servicio que la interfaz
consume. Esto permite que se agreguen nuevas funcionalidades a los servicios sin afectar la interfaz. (Uno podría mudar una parte a la nube, o amazon, y la otra parte seguiría corriendo).
Arquitectura cliente-servidor

Desde el lado del servidor, una arquitectura REST expone a los clientes una interfaz uniforme:
-Todos los recursos del servidor tienen un nombre en forma de URL o hipervínculo
-Toda la información se intercambia a través del protocolo HTTP
A esas URL, les llamamos ENDPOINTS, es decir, el servidor expone a los clientes, un conjunto de endpoints para que este pueda 
acceder. Al conjunto de endpoints, se lo denomina API.
Un endpoint está ligado al recurso (json, pdf, imagen...) que solicitamos

2- SIN ESTADO (STATELESS):
REST propone que todas las interacciones entre cliente y servidor, deben ser tratadas como nuevas, y de forma independiente SIN
guardar estado ( a diferencia de las sesiones de los usuarios). Por lo que para diferencia a un usuario logueado de otro que no,
 debemos mandar la autenticación necesaria CADA VEZ. Lo que permite desarrollar apps más confiables, performantes y escalables.

3- CACHEABLE:
Debe soportar un sistema de cachés. En REST, el cacheo de datos es una herramienta muy importante que se implementa del lado del
cliente (poniendo cachés de su lado, nos ahorramos realizar peticiones al servidor), con lo cual mejora la performance al 
reducir la demanda al servidor.
El cacheo de datos en REST, significa una memoria intermedia que almacena datos. 

4- FORMATOS:
Debe proveer una interfaz uniforme, para que la info se transfiera de forma estandarizada.

Cuando el servidor envía una solicitud, esta transfiere una representación del estado del recurso requerido, a quien se lo haya
solicitado. Dicha info se entrega por medio de HTTP, en uno de los siguientes formatos:
JSON - RAW (datos sin formato)- XLT - texto sin formato (para HTML y CSS) - URL-encoded (datos codificados en forma de URL, lo que sería algo muy similar a un query string - ej: {} email%3Dcosmefulanito.fox%26passwird%3Dverysecret)
Para enviar este info se debe agregar un encabezado en los headers:
{} "Content-Type": "application/json"
JSON {
  "ID": 1,
  "title": "..."
}

5- Tiene que ser un sistema por capas, invisible para el cliente.

CONSTRUCCIÓN API REST:
* Realizo un plano de lo que voy a hacer:
1- identificar (siempre con sustantivos. Ej. Libros- canciones) los recursos que voy a compartir (consumir con React)
2- crear los identificadores de recursos (URL o endpoints). Al conjunto se los llama colleciones.
Obs! en toda API REST se sugiere que se pueda acceder al detalle de un recurso de una colección de forma sencilla como por ej:
 /albumes/59
donde 59 es lógicamente el ID /albumes/{id}
Obs! a un recurso se puede acceder de varios lados, por ej: /artistas/2/albumes...  lo cual es una cuestión de diseño.
3- pensar la estructura de lo que va devolver:
 por lo gral en formato JSON, y contiene un link al mismo endpoint, info genérica y específica:
Ej:
{
  "link": "http://domain.com/api/genres",
  "total_items": 5,
  "data1": [
    {"id": 1, "name": "Rock", "link": "http://domain.com/api/genres/1"},
    {"id": 2, "name": "Jazz", "link": "http://domain.com/api/genres/2"},
    {"id": 3, "name": "Blues", "link": "http://domain.com/api/genres/3"},
  ]
}
4- asociar a los métodos con los HTTP, por ejemplo:
get /generos --- da info
post /generos --- guarda info
patch (parcial) - put / generos --- cambia info
delete / generos --- elimina info
 */
infoReact: (req, res) => {
  Proyecto.find({}, (error, proyectos) => {
    if (error) {
      return res.status(500).json({
        message: "Error buscando los proyectos",
      });
    } else {
      res.json({ total: proyectos.length, data: proyectos });
    }
  }).populate({ path: "involved", strictPopulate: false });
};

/* Nota: Cliente REST y Servidor REST */

/*POSTMAN - Es un cliente HTTP para probar servicios web, que permite testear, consumir y depurar API REST, monitorizarlas,
   escribir pruebas automatizadas, documentarlas, mockearlas y simularlas */

/*CONSUMO de APIs Propias y de Terceros:
   Al consumir una API de 3eros tendrá la certeza de cuando se envía una solicitud, pero no la certeza de cuando llegará la
  respuesta, por lo que es un pedido asincrónico.
   Para llevar a cabo este tipo de pedidos desde el backend, se usa un paquete de Node: node-fetch
   
   NODE FETCH (hace lo mismo que AXIOS = Hacer solicitudes HTTP a una API)
  Si instalo "npm i node-fetch" me da un error porque las versiones recientes solo soportan ESM.
  Por lo tanto instalo la última versión de las viejas que funciona normalmente:

  npm i node-fetch@2.6.1
  */
const fetch = require("node-fetch");

fetch("https://apis.datos.gob.ar/georef/api/provincias")
  .then((res) => res.json()) // CON LA RESPUESTA A MI PEDIDO, LE PIDO QUE LO CONVIERTA A JSON
  .then((provincias) => {
    // UNA VEZ QUE TENGA EL JSON, A TRAVÉS DE OTRA PROMESA, PUEDO HACER LO QUE QUIERA...
    return res.json({ listado: provincias }); // POR EJEMPLO, ENVIAR LOS DATOS, O RENDERIZARLOS EN UNA VISTA
  });

// 12-1-23 *************

// IMPORTANTE: API - PROMISES (Async-await Vs Then)

/* Podría simplificar que hacer una API, es hacer lo mismo que hice con toda la App, pero en lugar de hacer los EJS/CSS y todo lo que sea del front, me limito a configurar los controladores para que estos dejen disponibles los recursos (la info de la BBDD), a través de distintas URL (endpoints).
  Para consumir APIs de 3eros, se puede usar Fetch, o Axios. Estos se instalan, requieren, y llaman mediante un pedido asincrónico (Promesas / .then / async - await)
  Los pedidos asincrónicos, están para que no se bloquee toda la app, mientras se espera un dato, la app sigue funcionando haciendo otra cosa. Cuando se pide algo, se genera una promesa, esta se puede cumplir o no. Si se cumple la promesa, se obtiene lo deseado, y opera con él, sino, se ejecuta el catch para ver cual fue el error.
  Para tratar con estas promesas se puede usar el then, o el asyn/await.
  El then, genera las peticiones en paralelo, lo cual lo hace más rápido, dado que el async/await es una tras otra.
  El async/await, surgió para que tenga una forma más sencilla de lectura.. leo una función async, y sé que viene una promesa, al llegar al await, me dice que espera a obtener ese valor, para proseguir con la función o presentar el error.
  Pero lo que tiene este método a favor, es que si bien no es en paralelo (a diferencia del then), es que si fueran muchas peticiones, mejor que vayan de a tandas, porque sino pueden tildar todo el proceso en sí.

  Mejor explicación encontrada: 
  https://www.aluracursos.com/blog/asyncawait-en-javascript-que-es-y-cuando-usar-programacion-asincrona

  Usando Promesas con .then():
*/
function getUser(userId) {
  const userData = fetch(`https://api.com/api/user/${userId}`)
    .then((response) => response.json())
    .then((data) => console.log(data.name));
}

getUser(1); // "Nombre Apellido"

/*
El método fetch() recibe el endpoint como parámetro y devuelve una Promise.
¿Y cómo funcionan las Promesas? Las promesas tienen un método llamado .then(), que recibe una función callback y retorna un "objeto-promesa". NO ES un retorno de los datos, ES la promesa del retorno de esos datos.
Entonces, podemos escribir el código de lo que sucederá a continuación con los datos recibidos por Promise, y JavaScript esperará a que Promise se resuelva sin pausar el flujo del programa.
El resultado puede o no estar listo todavía, y no hay forma de obtener el valor de una Promesa de forma síncrona; Solo es posible pedirle a Promise que ejecute una función callback cuando el resultado esté disponible, ya sea lo que se solicitó (los datos de la API, por ejemplo) o un mensaje de error si algo salió mal con la solicitud (el servidor puede estar fuera de servicio, por ejemplo).

En el ejemplo anterior: cuando iniciamos una cadena de promesas, por ejemplo para hacer una solicitud HTTP, mientras la respuesta está pendiente, retorna un Promise object. El objeto, a su vez, define una instancia del método .then(). En lugar de pasar la función callback directamente a la función inicial, se pasa a .then(). Cuando llega el resultado de la solicitud HTTP, el cuerpo de la solicitud se convierte a JSON y este valor convertido se pasa al siguiente método .then().

La cadena de funciones fetch() .then() .then() no significa que se utilicen varias funciones callback con el mismo objeto de respuesta, sino que cada instancia de .then() a su vez devuelve una new Promise(). Toda la cadena se lee de forma síncrona en la primera ejecución y luego se ejecuta de forma asíncrona.

Captura de errores con promesas

El manejo de errores es importante en las operaciones asincrónicas. Cuando el código es síncrono, puede generar al menos una excepción incluso sin ningún tipo de manejo de errores. Sin embargo, en asincrónico, las excepciones no controladas a menudo pasan sin previo aviso y se vuelve mucho más difícil de depurar.

No hay forma de usar try/catch cuando se usa .then(), ya que el cálculo solo se realizará después de devolver el objeto-Promise. Luego debemos pasar funciones que ejecuten las alternativas, en caso de éxito o fracaso de la operación. Por ejemplo:
*/

function getUserAgain(userId) {
  const userData = fetch(`https://api.com/api/user/${userId}`)
    .then((response) => response.json())
    .then((data) => console.log(data.name))
    .catch((error) => console.log(error))
    .finally(() => {
      "aviso de fin de cargamento ";
    });
}

getUserAgain(1); // "Nombre Apellido"

/*
Además del método .then() que recibe el objeto-Promise para ser resuelto, el método .catch() retorna en caso de rechazo de la Promesa. Además, el último método, .finally(), se llama independientemente de si la promesa tiene éxito o falla, y la función callback de este método siempre se ejecuta en último lugar y se puede usar, por ejemplo, para cerrar una conexión o dar algún aviso de finalización.

Resolviendo varias promesas (PROMISE.ALL)

En el caso de múltiples promesas que se pueden hacer en paralelo (por ejemplo, algunos datos en diferentes endpoints REST), se puede usar Promise.all:
 */

const endpoints = [
  "https://api.com/api/user/1",
  "https://api.com/api/user/2",
  "https://api.com/api/user/3",
  "https://api.com/api/user/4",
];

const promises = endpoints.map((url) => fetch(url).then((res) => res.json()));

Promise.all(promises).then((body) => console.log(body.name));

/* Usando async/await

Las palabras clave async y await, implementadas a partir de ES2017, son una sintaxis que simplifica la programación asíncrona, facilitando el flujo de escritura y lectura de código; por lo que es posible escribir código que funcione de forma asíncrona, pero que se lea y estructure de forma síncrona. Async/await funciona con código basado en Promises, pero oculta las promesas para que la lectura sea más fluida y sencilla de entender.

Al definir una función como async, podemos usar la palabra clave await antes de cualquier expresión que retorne una promesa. De esta forma, la ejecución de la función externa (la función async) se pausará hasta que se resuelva la Promesa.

La palabra clave await recibe una Promesa y la convierte en un valor de retorno (o genera una excepción en caso de error). Cuando usamos await, JavaScript esperará hasta que finalice la Promesa. Si se completa con éxito (el término utilizado es fulfilled), el valor obtenido es retornado. Si la Promesa es rechazada (el término utilizado es rejected), se retorna el error arrojado por la excepción.

Un ejemplo:*/

let response = await fetch(`https://api.com/api/user/${userId}`);
let userData = await response.json();

//Solo puede usar await en funciones declaradas con la palabra-clave async, así que agréguela:

async function getUser(userId) {
  let response = await fetch(`https://api.com/api/user/${userId}`);
  let userData = await response.json();
  return userData.name; // no es necesario await en el return
}

/* Una función declarada como async significa que el valor de retorno de la función será, "por dentro de javascript", una Promesa. Si la promesa se resuelve normalmente, el objeto-promesa retornará el valor. Si arroja una excepción, podemos usar try/catch como estamos acostumbrados en los programas síncronos.

Para ejecutar la función getUser(), ya que retorna una Promesa, puedes usar await:

exibeDatosUser(await getUser(1))
Recordar que await solo funciona si está dentro de otra función async. Si todavía no estás familiarizado, puedes usar .then() normalmente:

getUser(1).then(exibeDadosUser).catch(reject)

Resolviendo varias promesas

En el caso de múltiples promesas que se pueden hacer en paralelo (por ejemplo, algunos datos en diferentes endpoints REST), puedes usar async/await junto con Promise.all: */

async function getUser(userId) {
  let response = await fetch(`https://api.com/api/user/${userId}`);
  let userData = await response.json();
  return userData;
}

let [user1, user2] = await Promise.all([getUser(1), getUser(2)]);

/* Si quisiera consumir una API externa, desde el backend, que me permita poner en el register, un select con todas las provincias de argentina: */

register: (req, res) => {
  fetch("https://apis.datos.gob.ar/georef/api/provincias")
    .then((response) => response.json())
    .then((provincias) =>
      res.render("./staff/register", {
        datosProyectos,
        roles,
        seniority,
        provincias: provincias.provincias,
      })
    )
    .catch((error) => console.log(error))
    .finally(() => {
      "Se cargaron los datos de la API consumida";
    });
};

/* y en el EJS:

  <div class="col-md-6 mt-3">
              <div class="form-group">
                <label for="home"><b>Reside en:</b></label>

                <select name="home" id="home" class="form-control <%=
                  locals.errors && errors.home ? "is-invalid" : null %>">
                  <option value="sinAsignar"
                    <%= locals.oldData && oldData.home === "sinAsignar" ? "selected" : " " ; %>>
                    Elige uno:</option>
                  <% for (let i = 0; i < provincias.length; i++) { %>
                  <option value="<%= provincias[i].nombre %>"
                    <%= locals.oldData && oldData.home === provincias[i] ? "selected" : " " ; %>>
                    <%= provincias[i].nombre %> </option>

                  <% } %>

                </select>

              </div>
            </div>
            */

// 13-1-23 *************
/* JS FRONT
Es el único de los lenguajes que acepta el Front.
Se vincula al HTML, mediante la etiqueta script.
Tiene 2 formas: 
-en línea o interna: poniendo la etiqueta directo en el html, en cada parte donde quiera que aplique. 
(No es recomendable, repite mucho código, por lo que es dificil de mantener, y hace dificil de leer)
-externa: mediante el atributo src, vinculo al documento ubicado en public/js.
(La aplicación de esta última, anula la interna)

Obs1: si bien es un documento js, comandos como req., res., render, no funcionan en él, dado que está orientado a la consola del navegador (por lo que no veré nada en la de node).
Obs2: es BUENA PRÁCTICA colocar la etiqueta antes del final del body 
...
<script src=""></script>
</body>
y NO en el HEAD, porque JS es procedural, y si mi JS requiere algo del body, al momento de cargar el head, no lo tendrá..
El tema es que si no requiere algo del cuerpo, y necesito aplicarlo a varios lados, yo lo pondría en el partial del head...
O PONERLA EN EL HEAD, PERO DENTRO DEL ARCHIVO JS, PONER TODO DENTRO DE UN EVENTO ONLOAD

 OBS! En el partial del HEAD, NO PONER la etiqueta head en el mismo (sí el resto del contenido), sino en cada página. Y luego el enlace al partial, dentro de cada etiqueta head, en cada página.
Esto me va a permitir vincular diferentes scripts por cada pagina, evitando tener que poner los condicionales para evitar los null 

Obs3: Puedo vincular vs archivos
Obs4: puede llevar el atributo type="text/javascript"... pero no aporte mucho..

LA IMPORTANCIA DEL JS EN EL FRONT
es que permite modificar la interfaz, es decir, lo que tengo cargado, sin tener que ir de nuevo al servidor y volver!
Para lograr dicho cometido, nos da 2 objetos nativos (los llamo cuando quiera, sin tener que guardarlos en variables):

WINDOW y DOCUMENT
Window, es la ventana.
Para Document, primero entender DOM:
DOM (Document Object Model) es LA REPRESENTACIÓN que hace JS de lo que hay en el HTML (como se ve cuando inspecciono)
Document, me permite acceder al DOM

Ambos tienen sus métodos (en la consola del navegador, los puedo ver)
De Window principalmente se usa el objeto location, (window.location) y los relacionados al height y weight de la ventana.
De Document son los que más se usan, ya que son los que me permitirán modificar los estilos, clases, eventos (onclick, onload..)

La estructura, de más externa a interna, sería:
Navegador - Window con su barra de navegación - Document con sus etiquetas html

1- SELECCIONAR (DÓNDE??)
Para empezar a modificar, lo importante primero es capturar lo que quiero modificar, y guardarlo en una variable, para tenerlo disponible. 
 *************** Al elemento capturado, se lo denomina Nodo ******************
*/
let titulo = window.document.querySelector("h1"); // donde el window se suele omitir

/* DOM SELECTORES */
let captura1 = document.querySelector("form"); // siempre un string
let captura2 = document.querySelector("form.registration"); // puntos para las clases
let captura3 = document.querySelector("form#unico"); // # para ID
let captura4 = document.querySelector(".registration"); // solo clases = CSS // De haber más de un elemento con esa clase, captura solo el primero. Si los quisiera todos:
let captura5 = document.querySelectorAll(".registration"); // TODOS //En la consola vería una NODELIST, que No es un Array, pero lo podemos tratar como tal.
let captura6 = document.querySelector(".especial strong"); // Idem CSS, de los que tienen clase especial, el que tenga la etiqueta strong.
let captura7 = document.getElementById("unico"); // idem a document.querySelector("#unico");

/* OBS. IMPORTANTE
si uso el mismo archivo de scrip, para diferentes html, y hay elementos que están en uno de ellos, pero en el otro no, en la consola veería varios null.. para evitar esto, usar condicionales de la forma if ( captura7 != null ) { ... }, o genero otro archivo js para cada archivo

2- MODIFICAR (QUÉ??)

A la variable capturada, le puedo reemplazar contenido:*/
captura1.innerText = "Lo que decía, lo reemplazo por esto";
//o anexo:
captura1.innerText += " o sin modificar lo que estaba, le agrego esto";
// mismos casos, pero si quiero que interprete etiquetas HTML:
captura1.innerHTML += "<strong>Le sumo esto remarcado</strong>";

/* Cambio de Estilos CSS - (  MODO OSCURO )
Elimino y/o agrego lineas al CSS que afecta al elemento

Propiedad Style
Permite sobreescribir las reglas de CSS que se aplican sobre un elemento */
captura1.style.color = "cyan"; // se indica siempre en string
captura1.style.fontSize = "12px"; //NOTAR: que las props que llevaban guiones, se escriben en camelCase

//INTERACCION básica:
let confirmaCambios = confirm("Querés cambiar el color del título?"); // devuelve T or F

if (confirmaCambios) {
  elH1.innerHTML += "<strong> - Uso el Home para repasar JS-Front</strong>";
  elH1.style.backgroundColor = "cyan";
}

/* CLASSLIST
 Si quisiera aplicar/desaplicar varios cambios de una sola vez, lo mejor es hacer una clase en el CSS y aplicarla o no. Por eso se recomienda esta forma, y no la anterior de propiedades sueltas: */
captura1.classList.add("home");
captura1.classList.remove("home");
captura1.classList.toggle("home"); // switchea al refrescar, entre add y remove (o evento)

/* CONTAINS
 Sirve para preguntar si un elemento tiene una clase determinada. Devuelve un booleano: */
captura1.classList.contains("home"); // true or false
/* Se utiliza para hacer operaciones lógicas con los if/else */

/* EVENTOS (click - presionar cierta tecla - ingresar texto en input - esperar 2 segundos...)
 Para que los cambios sucedan en base a interacciones con el DOM (por lo gral interactuan los usuarios, pero también lo podría hacer la ventana (window) que carga el documento):

 1ero Cuál es el elemento que va a estar observando?
 2do Cuál es el evento que puede suceder en él?
 3ro Qué sucederá cuando el evento tome lugar?

 2 formas:
 - on + accion = onload , onclick... que van a acompañados de una función que dice que hará
 - función addEventListener = toma 2 parámetros, la acción, sin el "On", y el callback, que dice que hará

 En ambos casos:
 - la palabra reserva "this", que hará referencia a dónde sucedió el evento
 - preventDefault, que evita la acción default de la etiqueta, por ej, que A, no nos traslade

 con window.onload, puedo poner al script tranquilamente en el head, ya que le estoy indicando que se ejecute, una vez que se cargue completamente el objeto Document, dentro del objeto Window*/
window.onload = function () {
  // (*) La llamo onload
  "lo que quiero que haga el script en si ";
};
//o con la sintaxis alternativa:
window.addEventListener("load", function () {
  // (*) la llamo addevent
  console.log("el documento está listo");
});

//DIFERENCIA ENTRE AMBOS!! // (*)
/* Si hiciera varios (*) onload sucesivos... solo se implementará el último, ya que piso al resto. Ej: */
window.onload = function () {
  console.log("no se verá...");
};
window.onload = function () {
  console.log("... porque este lo pisa");
};
/* En cambio si hiciera varios (*) addevent, sucederían todos. Es decir  addEventListener permite poner varias reacciones a un evento, versus, onload que permite tener solo la última*/

/* Todas las funciones de los eventos, pueden tener un parámetro, usualmente llamado "event" o "e", que si lo veo en la consola (console.log(e) dentro del evento), veré mucha info del evento en sí.
También me permite el : e.preventDefault() 

OBS! con un console.log(this), dentro del evento, veré en detalle, dónde sucedió el evento

Eventos + usados:
onclick ondblclick onmouseover onmousemove onscroll onkeydown onload onsubmit

THIS
En este caso usaré THIS para que automaticamente dectecte donde sucedió el evento:*/
for (let i = 0; i < losH2.length; i++) {
  losH2[i].addEventListener("click", function () {
    this.style.color = "green";
  });
}

/* EVENTOS HABITUALES DEL TECLADO:
keydown keyup keypress (al completar el recorrido de ascenso y descenso)
si quisiera saber que tecla presioné:*/
window.addEventListener("keypress", function (e) {
  console.log(e.key);
});

// 17-1-23 *************
/* Sin luz - internet
Leí apuntes, y acomodé los partials/head */

// 18-1-23 *************
/* 
*Validaciones de Form desde el Front - se llaman "on time"
-nunca está de más sumar capas de validaciones
-Se desactivan / Mejor experiencia - Feedback + rápido

*Eventos:
-Focus (mouse sobre input) 
-Blur (mouse abandona input)
-Change (el valor cambia - se aplica no solo sobre los inputs, sino sobre cualquiera, incluso sobre el propio form)
-Submit (enviar / preventDefault - if (form OK) { } else { e.preventDefault })

*This - donde ocurre
this.value - retorna la info en el campo que esté validando

Importante! para que la validación del email, del lado del front, pueda ejecutarse, tuve que cambiar el 
type del input. Pasarlo de “email”, a “text”, porque si no hago eso, el formulario directamente no permite
hacer submit, si la expresión a validar no cumple con el tipo email. Pero tampoco muestra ningún error...
Para que la expresión a validar viaje, es que paso el tipo del input a text.. y en ese caso será la función
validarEmail la que la analice en base a la expresión regular que le haya pasado y muestre los errores 
correspondientes
        
*/

// 20-1-23 *************
/* sigo con las validaciones del register */
function validarImage() {
  // Obtener nombre de archivo
  let archivo = image.value;
  // Obtener extensión del archivo
  let extension = archivo.substring(
    /*substring() devuelve una parte de una cadena definida por los índices pasados ​​como parámetros a esta función.
        Toma dos parámetros, el índice inicial y el índice final*/
    archivo.lastIndexOf("."),
    /*lastIndexOf(), el 1er parámetro, averigua la última posición donde el "." está presente */
    archivo.length //2do parámetro, el índice final.
  );
  // Si la extensión obtenida no está incluida en la lista de valores del atributo "accept", mostraré el error.
  if (
    document
      .querySelector("input.image")
      .getAttribute("accept")
      .split(
        ","
      ) /*String original del accept=".jpg, .png, .jpeg, .gif". El método split() devuelve un array con cada uno de
           los elementos que estaban entre los separadores, en este caso, las comas: [.jpg, .png, .jpeg, .gif].*/
      .indexOf(extension) < 0 //si la extensión no se encuentra en ese array, el indexOf dará "-1"
  ) {
    return true; /* devuelve que es verdad que la extensión no está en el array. Por lo que si la validación es true,
        devuelvo un error*/
  }
}

/* Pedidos asincrónicos - FETCH del lado del FRONT - donde más se usa!
La estructura de fetch siempre será la misma:*/
fetch("URL")
  .then(function (respuesta) {
    return respuesta.json();
  })
  .then(function (informacion) {
    console.log(informacion);
    // Lo que hará con esa info...  (* Ejemplo abajo)
  })
  .catch(function (error) {
    alert(`Intente más tarde, error: ${error} `);
  });
/*- la URL o endpoint, al que pido la info
 - un primer Then, que es la promesa de la petición, y como los endpoints por lo gral vienen configurados para entregar info en en formato json, ya de paso la configuro para poder usar, con .json()
 - un segundo Then, que es la promesa que trae la info en sí, la cual necesito para trabajar, pero siempre tengo que ver como viene configurada (por lo gral, o siempre un objeto..), por eso el console.log()
 - lo que quiera hacer con esa info
 - el catch en caso de que algo falle...
 
 (*ejemplo): */
console.log(informacion.provincias);
let list = document.querySelector("ul.list-prov");

for (let i = 0; i < informacion.provincias.length; i++) {
  let nombre = informacion.provincias[i].nombre;
  list.innerHTML += "<li>" + nombre + "</li>";
}

/* Para conseguir que se muestre este listado, traido desde una api ajena, necesito en el EJS, tener la etiqueta <ul> que capturé, y es el lugar donde voy a mostrar los datos por medio del innerHTML con las etiquetas <li> */

/* FETCH POR POST: envío datos a una API */
fetch("URL", settings)
  .then(function (respuesta) {
    return respuesta.json();
  })
  .then(function (informacion) {
    console.log(informacion);
    // Lo que hará con esa info...  (* Ejemplo abajo)
  })
  .catch(function (error) {
    alert(`Intente más tarde, error: ${error} `);
  });

/* Misma estructura que por GET, pero con un segundo parámetro, usualmente llamado "settings"
  Básicamente, en este parámetro viaja la info que quiero mandar, pero hay que estructurarla: */
let data = { id: 27, nombre: "Alberto Ranno", estado: "furioso" };
//1- la info en forma de objeto

let settings = {
  method: "POST",
  //3- aclaro que irá por POST
  headers: {
    "content-type": "application/json",
    "x-api-key":
      "dato-que-suelen-darnos-las-paginas-a-las-que-les-enviamos-la info",
  },
  //4- los encabezados, pueden o no ser opcionales, y su contenido puede cambiar
  body: JSON.stringify(data),
  //2- con JSON.stringify convierto la info que quiero mandar a JSON
};

// 26-1-23 *************
/* Estoy aprendiendo JAVA, pero pausé para retomar esto.
Preparando el endpoint para el tablero de React.
Se puede poblar más de un path: */
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
};
/* Para llegar a esto, modifiqué el value del register user, para que guarde el ID del manager del proyecto (y no su nombre), con lo cual, modificando el schema, y usando populate, tengo disponibles todos los datos del manager.
  Ahora agregaré más campos que piden en el detalle de proyectos */

// 1-2-23 *************
/* Días complicados.. poco tiempo y ánimo negativo...
Repasé el archivo de apuntes completo. */

// 2-2-23 *************
/*
https://mongoosejs.com/docs/api/schema.html#schema_Schema
Example:
const child = new Schema({ name: String });
const schema = new Schema({ name: String, age: Number, children: [child] });
const Tree = mongoose.model('Tree', schema);
 */

// 3-2-23 *************
/* Para cuando haga la nueva edición de proyectos */
for (let i = 0; i < persona.projectsInfo.length; i++) {
  if (persona.projectsInfo[i].proyect == proyect._id) {
    persona.projectsInfo = persona.projectsInfo.filter(
      persona.projectsInfo[i].proyect != proyect._id
    );
    console.log(persona.projectsInfo);
  }
}
/* Al haber cambiado el schema de Persona, no funcionaba la asociacion de proyectos cuando guardaba un usuario nuevo. Lo corregí aprovechando cada caso (string - object): */
const personaal = {
  //... objeto "personal" del store
  projectsInfo: [], // defino acá el array
};
// string:
personal.projectsInfo.push({ proyect: req.body.proyects });
// object: (dentro del for - donde proyectosInvolucrados es el array de req.body.proyects)
personal.projectsInfo.push({ proyect: proyectosInvolucrados[i] });

// 9 y 10/2/23 *************
/* Demoré un montón corrigiendo el UPDTADE de projects, con dataExtra, porque buscaba el error leeejos, d
donde estaba... todo por no prestar atención, y haber corregido antes al indicador `${error}`. El error era que el value del 
campo Manager, me estaba guardando el Nombre, en lugar del ID, y no se condecìa con el modelo.. una huevada...
Luego tuve que aplicar las modificaciones pertinentes por el cambio de Schema.
Luego demoré por querer usar en MONGO, indicaciones genéricas como el "delete... ", o querer usar los métodos comunes de los
arrays, pero con arrays multidimensionales (y la mayoría, no funcionan).
La solución, fue pensar, de nuevo, mejor la lógica, a algo más simple:
-Que busque a todas las personas, que rastree a c/u por su ID, y actualice su propiedad "projectsInfo" a []
-Esto, con la propiedad de Mongoose "findByIdAndUpdate", que sabía, (a diferencia de con lo que perdí tanto tiempo, que funcionaba).
-Luego, con la misma prop, actualizo DONDE corresponda (habiendo borrado todo previamente).
-La propiedad que vuelve a grabar los datos extras en cada persona, es involved, que según el tipo de dato que viajó en el body
(undefined, string, object), no hará nada (undefined - ya había borrado previamente, y no se quiere asociar el proyecto a 
ninguna persona), defino el objecto con los datos extra, y lo pusheo al [] de la persona que corresponda (string), recorro el
array de IDs que trae "involved", y para cada uno de esos casos, hago lo que hice para el string (object)

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
            }, (error, proyect) => {
              if (error) {
                return res.status(500).json({
                  message: `Error ${error}`,
                });
              } else {
                res.redirect("/proyectos");
              }
            } */

// 14 y 15-2-23 *************
/* Cansado de emparchar la estructura, y complicarme con los comandos propios de Mongo, para que modifique
objectos que están demasiado sumergidos en la estructura, opto por crear una nueva rama en GIT, y probar
de cambiar la estructura una vez más, con el fin de simplificarla, y poder trabajar con los comandos simples
que aprendé de Mongo */
/*
git branch // Me dice, marcándome en verde, en que rama estoy
git branch cambioEstructura // Crea la rama "cambioEstructura"
git checkout cambioEstructura // Me deja parado en la rama nueva - "Switched to branch "cambioEstructura"
git add . / git commit -m "" / git push , harán las modificaciones sobre esta rama, si quiero seguir como
venía, porque el experimento se complica, solo cambio de rama, y esta la puedo eliminar:
git branch -d cambioEstructura // la va a eliminar, siempre y cuando no esté parado sobre ella
Si el experimento funcionan, luego hago el merge
Puedo ver las diferencias entre ramas con "diff"
git diff nombreRama1 nombreRama2 // con el cursos en la consola, y el Enter presionado, avanza en mostrarme los cambios,
hasta que vea "(END)"
Si cambio el orden de los nombres, cambia lo que devuelve: (muestra como adición y sustración - forma invertida)
git diff nombreRama2 nombreRama1
Unifico ramas con MERGE:
Obs! si hiciera git merge cambioEstructura main - me dice "Already up to date.", porque estoy parado en la rama + Actualizada.
Por lo que para actualizar main (o la rama que quiero que reciba los cambios), primero tengo que pararme sobre ella: 
( PRIMERO COMITEAR LOS CAMBIOS ANTES DE CAMBIAR DE RAMA, SINO DA ERROR Y PIDE QUE LO HAGAS) - git checkout main
y ahora si, estando parado en main:
git merge cambioEstructura main (origen (desde la que quiero pasar los datos) a destino (la que quiero actualizar))
*/

/* Req.body is not iterable in node.js!!
Servirá el FOR..IN ?? */
const object = { a: 1, b: 2, c: 3 };

for (const property in object) {
  console.log(`${property}: ${object[property]}`);
}

// Expected output:
// "a: 1"
// "b: 2"
// "c: 3"

/*
Mongoose uses the mongodb-native driver, which uses the custom ObjectID type. You can compare ObjectIDs with the .equals() method. With your example, results.userId.equals(AnotherMongoDocument._id). The ObjectID type also has a toString() method, if you wish to store a stringified version of the ObjectID in JSON format, or a cookie.
*/

// 19 y 22-2-23 *************

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

    /* Acá había hecho un find dentro de otro find.. funcionaba, pero totalmente innecesario. 
    En cada objecto "personas", busco en la propiedad "projectInfo", la ubicación del ID del proyecto.
    Si efectivamente tiene una ubicación, lo corto de ese array.
    Guardo los cambios
    */
    for (let i = 0; i < personas.length; i++) {
      let indiceArray = personas[i].projectInfo.indexOf(id);
      if (indiceArray != -1) {
        personas[i].projectInfo.splice(indiceArray, 1);
        personas[i].save();
      }
    }
  });

  /*Encuentro al proyecto por su ID.
  Utilicé el array "toAssign", que ya lo tenía creado de una de las versiones del schema anterior,
  para no hacer tantas modificaciones, pero correspondía que lo pase una vez sola como variable a 
  nivel general para todos los controladores. */

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
      /* Si todo está bien para que se dé el caso de comenzar la edición de los campos... Recordar que:
      - como voy a utilizar findByIdAndUpdate - lo que voy a actualizar lo trato como VARIABLES, 
      NO como: Objecto, ni como propiedadesa del mismo (proyectToEdit.name)
       */
      if (resultValidation.isEmpty()) {
        let name = req.body.name;
        let description = req.body.description;
        let manager = req.body.manager;
        let condition = req.body.condition;
        let dateStart = req.body.dateStart;
        let dateEnd = req.body.dateEnd;
        /* Acá tuve otro error bobo... cuando defino la variable involved, la tengo que asociar a lo que venga en el body.
        Si la definía como un array vacío de entrada, el switch debajo, no tenía sentido.. */
        let involved = req.body.involved;
        let projectsInfo = [];
        let link = req.body.link;
        let observations = req.body.observations;
        let active = req.body.active;

        console.log(typeof involved);

        switch (typeof involved) {
          case "undefined":
            involved = [];
            // viaje un undefined, pero me interesa recalcar que es un array, y no hay personal involucrado
            break;

          case "string":
            /* Defino como array, y dentro va a tener un único string (el único involucrado) */
            involved = [];
            involved.push(req.body.involved);

            /* Encuentro a este involucrado, y en su propiedad projectInfo, agrego al ID de este proyecto.
            Teniendo en cuenta que previamente había borrado el ID de este proyecto, de todas las personas que 
            estaban involucradas. Guardo los cambios que corresponden al schema persona */
            Persona.findById(req.body.involved, (error, persona) => {
              if (error) {
                return res.status(500).json({
                  message: "Error buscando el proyecto",
                });
              }
              persona.projectInfo.push(id);
              persona.save();
            });

            /* Lo siguiente me confundí varias veces al plantearlo. Y tiene que ver en como viajan los datos del body, en
            el HTML de Edit.
            Lo importante es entender, que, yo tenía que listar a todo el personal disponible, para que el usuario eligiera,quien iba o no participar en dicho proyecto. 
            Como la cantidad de campos iba a aumentar mientras que más personal disponible haya, en el body, cada uno estos items, devolvía un array:
            req.body.nivel traía [,,,"muy bueno",,"excelente"] 
            Y que si bien estaban vacíos, también viajan los valores de los campos, de las personas disponibles
            Por lo que voy a tener un conjunto de valores (un objecto, formado por los elementos en las mismas posiciones
            de los arrays), por cada persona disponible.*/

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

              /* Lo siguiente es una funcionalidad de Mongo, para que si algo está como un simple string, 
              lo convierta a un ObjectID. Lo tuve que implementar porque viendo que era el mismo string, no me lo tomaba..
              (haciendo esto, y viendo que la comparación era verdadera, fue que me di cuenta que tenía un error en otro lado) */
              const objectId1 = new ObjectId(projectInfo.person);
              const objectId2 = new ObjectId(req.body.involved);
              console.log(objectId1.equals(objectId2));
              console.log(projectsInfo);

              /* La lógica, es que solo grabe, cuando la persona (ID de la persona disponible - projectInfo.person ),
              haya sido seleccionada como involucrada en el proyecto (req.body.involved). Y como estoy en el caso "string",
              es decir, un solo involucrado, la comparación es directa: */
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

              /* Para el caso de Object, la única diferencia con string, es que la comparación,
              no es directa, porque hay varios involucrados (involved tiene varios elementos), entonces
              los tengo que comparar uno a 1 (projectInfo.person, va ir cambiando con la [i], osea, a
              medida se recorre el personal a asignar, se va a ir generando un nuevo objecto projectInfo.
              Y si este nuevo obj. en su prop. person (ID), coincide con el ID de uno de los involucrados
              (involved[j] entonces, pusheo ese objeto a la prop. projectsInfo del proyecto en cuestiòn.)) */
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
};

// 14 y 15-2-23 *************
/*REACT
Etiquetas HTML con minúscula siempre. Propias, con Mayúscula, siempre.
Atributos que se escriben de forma distinta:
-class pasa a className (xq class es palabra reservada)
-for pasa htmlFor (en las labels)
-style, acepta un obj, con propiedades, escritas en camelCase (background-image --> backgroundImage)
const estiloDiv = {
  color: "yellow",
  backgroundColor: "black"
}
<div style={estiloDiv}> !Hola Mundo! </div> 
Las llaves en JSX, indican que lo que está dentro es JS
Si hubiera muy pocas propiedades, puedo usar estilo en linea:
<div style={ {color: "yellow"} }> !Hola Mundo! </div> - unas llaves para indicar JS, las otras por el obj.
 CREAR APP REACT
En la consola, tipeo:
npx create-react-app nombre-carpeta
el nombre de la carpeta que quiero que cree y me almacene react en su totalidad, no acepta mayúsculas.
luego, con "cd nombre-carpeta" (change directory), me posiciono en la misma, y con npm start, inicializo el proyecto
(a lo nodemon)

ORGANIZO ESTRUCTURA (elimino los tests y demases que no vaya a usar)
public:
favicon - icono de la solapa
index, contiene:
- el head para agregar fuentes, modificar el titulo, etc...
- el body, donde se aloja el div con clase root (raíz) que es donde se almacenará todo lo que haga
los logos en png, se pueden borrar
manifest-pequeña descripción
robots - para darle guías a los robots - no lo vi aun...

src:
index es el elemento contenedor de App, viene con su CSS default, y es el archivo que inserta el contenido
en el HTML index de public, mediante el getElementById("root").
App, es el componente sobre el que voy a comenzar a trabajar, con su forma básica:
//import logo from './logo.svg';
//import './App.css';

function App() {
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
*/

//****** 27/2/23
/*
- Sintaxis JSX - Permite escribir todo el código dentro del HTML, en JS (similar al template engine - EJS) 
- "Componentes" (bloques de código) para hacer la app + dinámica mediante la reutilización de código
- Si bien React es una librería que se instala y ejecuta con node, todo lo que haga aquí, es agnóstico del back-end, a menos
 que lo vincule. React no sabe del back, por lo que tendré que consumirlo mediante una API.
- React es puro 100% front-end!
- La gracia de React, es crear el front reutilizando componentes. Todos los componentes juntos forman el DOM. React, hace una 
copia del DOM ("Virtual DOM"), y lo compara con el Real ( proceso que recibe el nombre de Diffing) , constantemente. 
Cuando ve que un componente cambió, hace un renderizaciòn parcial del mismo ("Reconciliation"), ahorrando la necesidad de 
volver a renderizar todo el documento. Estos cambios los percibe mediante los estados!
- Los componentes son funciones. Lo más simples se conocen como "stateless" - sin estado -
- Para que todos los componentes/funcionalidades, puedan terminar en un solo HTML (el index.html en Public), React utiliza
la librerìa webpack (o "module bundler" o "empaquetador de módulos"). Gracias a ella al navegador le llega un solo archivo 
html, con todos los .js empaquetados.
-La otra librería que usa React es Babel, que lo que hace es traducir, todos los códigos nuevos, a lenguaje más antiguo y 
estable, para que sea interpretado por todos los navegadores. ("Transpilación")
-Todo esto viene configurado cuando corro el comando "npx create-react-app nombre-carpeta", pero si quisiera, se podría 
modificar.
- Estructura básica componente:

*/
import React from "react";

function Saludo() {
  return (
    //siempre () luego del return, y una sola etiqueta HTML, que envuelve todas las internas. Incluso podría ser <></>
    <div>
      <h1>!hOLA mUNDO!</h1>
      <h2>como va?</h2>
    </div>
  );
}

export default Saludo;

/* JSX - JavaScript XML
-cerrar las etiquetas! ojo con <img   />
-class pasa a className
-puedo imprimir variables: */
function App() {
  let nombre = "Diana";
  return <h1> Hola {nombre}</h1>;
}
/*
-Las { } permiten siempre escribir dentro, sentencias completas de JS
-En JSX, no se pueden utilizar ciclos FOR / FOR EACH... Se reemplazan por MAP/FILTER/REDUCE

MAP
-crea un nuevo array, con los resultados de la llamada a la funciòn indicada, aplicada a cada uno de sus elementos:
*/
let numbers = [1, 2, 3];
let doubles = numbers.map((nro) => nro * 2);

function Saludo() {
  let apodos = ["corneta", "zapallo", "cuerno"];
  return (
    <div>
      <h1>!hOLA mUNDO!</h1>
      <h2>como va?</h2>
      <ul>
        {apodos.map((apodo) => (
          <li> {apodo} </li>
        ))}
      </ul>
    </div>
  );
}

/* PROPS
Es info que se pasa de padre a hijo, en forma de objeto literal:
*/

function App() {
  return (
    <div className="">
      <Saludo nombre="Carlos" rango="Boina verde" />
      <Saludo nombre="Mariano" rango="Soldado" />
    </div>
  );
}

function Saludo(props) {
  return (
    <div>
      <h1>{props.nombre}</h1>
      <h2>{props.rango}</h2>
    </div>
  );
}

/* KEY PROPS
Como props, también puedo pasar un array de valores. Pero tengo que tener las siguientes consideraciones:
-en el componente padre, el array, lo paso entre llaves, que permiten escribir otro tipo de elemento que no sea string:
 apodos={["corneta", "zapallo", "cuerno"]}
-en el componente hijo,solo puedo usar map. PEEEERO, ADEMAS, NECECITO UNA KEY. ESTO ES COMO UN ID PARA REACT, QUE IDENTIFIQUE
CADA UNO DE LOS ELEMENTOS DE CADA ARRAY CON UN NOMBRE ÚNICO. DE NO HACERLO, EN CONSOLA VERÉ EL ERROR DE KEY PROPS.
MAP, permite usar como segundo parámetro, un iterador (apodo,i), esto hará que cada nombre sea único
{props.apodos.map((apodo,i) => <li key={apodo + i}> {apodo} </li>)}

PROP TYPES
-Cuando un proyecto crece, es una buena medida, delimitar el tipo de dato, que puede recibir cada una de las props.
Si creo que el componente lo necesita, pero no es obligatorio, es mas bien una ayuda.
Para esto, necesito instalar un paquete con: 
npm install prop-types --save
luego hay que requerirlo con:
import propTypes from "prop-types"

Saludo.propTypes = {
  apodos: propTypes.array,
};

DEFAULT PROP
-Una manera elegante para evitar que la generaciòn de un componente falle, por omisión de alguna prop
Saludo.defaultProps = {
  nombre: "Visitante Anónimo",
  rango: "desconocido",
};
 */

//import React from "react";
//import propTypes from "prop-types";
function Saludos(props) {
  let listadoDeApodos; // para que exista siempre

  if (props.apodos != null) {
    // null es el valor default seteado abajo
    listadoDeApodos = (
      <ul>
        {props.apodos.map((apodo, i) => (
          <li key={apodo + i}> {apodo} </li>
        ))}
      </ul>
    );
  } else {
    listadoDeApodos = "";
  }
  return (
    <div>
      <h1> Hola {props.nombre}</h1>
      <h2>{props.rango}</h2>
      {listadoDeApodos}
    </div>
  );
}

Saludos.propTypes = {
  apodos: propTypes.array,
};

Saludos.defaultProps = {
  nombre: "Visitante Anónimo",
  rango: "desconocido",
  apodos: null,
};

/* PROP CHILDREN
Dentro del objeto props, SIEMPRE existe la propiedad CHILDREN.
En la misma puedo pasar, de un padre a un hijo, CUALQUIER estructura que yo quiera.
Teniendo en cuenta que:
- en el hijo, dictamino donde van a aparecer los children mediante: {props.children}
- en el padre, lo que envío a los children tiene que estar dentro de una etiqueta propia,
que se ABRA Y CIERRE:
      <Saludo>
        <p>Acá está el children</p>
        <h6>que puede ser ...</h6>
        <ul>
          <li>lo que..</li>
          <li>yo quiera..</li>
        </ul>
      </Saludo>
Es sumamente útil para darle flexibilidad a un componente, para dejar un expacio abierto, listo a cualquier
cosa que quiera venir, por ejemplo, para espacios publicitarios
Se puede decir que los children permiten renderizar un componente o HTML dentro de otro

React permite una hoja de estilo por Compònente (potente, tiene grandes ventajas, como modularizar todo
  al detalle, de modo que frente a un cambio, por ej, en el componente de publicidad, tengo todo a la mano)
hay que vincularla: import "./EstiloDelComponente.css"
Ojo! con los selectores, ser específico, porque un selector por atributo igualmente afectaría a todos
los atributos de la página.

o la clásica hoja de estilo gral en public, y vincularla en el html:
<link rel="stylesheet" href="./styles.css" />
Esta opción servirá en caso de estilos generales

COMPONENTES CON ESTADO o STATEFUL
Hasta ahora, los componentes que generaba solo se mostraban en pantalla, y, la forma en la que se generaban
dependía únicamente de las props pasadas por el componente padre en el momento de su creación, pero
luego, no quedaban preparados para ser modificados.. (por ejemplo algún efecto con el evento de seleccionarlo).
Los stateful pueden cambiar el contenido interno, a partir de eventos externos, por lo que se utilizan cuando se espera
interacción del usuario.

Para que un componente sea sensible a cambiar durante un evento, tiene que tener estado.
Para que un componente tenga estado, tengo que cambiar algunas cuestiones:
- import Reac from "react", pasa a: impor React, { Component } from "react"
- function Saludo () { }, pasa a: class Saludo extendes Component {  }
- el return, es envuelto por un render: render(){ return ( )}
Estos cambios hacen que el componente deje de ser una función nativa de JS, para pasar a ser una Clase

Obs a completar:
-Los componentes con estado, son los padres, los que pasan los valores a los props.

-No puedo tener una class Saludo extends Component (props) {  }... porque no reconocen las props-
Si puedo tener clases con props, solo que se pasan así:
class App extends Component {
 constructor(props){
  super(props);
  this.state = {
    valor: props.inicial
  }
 }

El estado de un comp. es aquel que permite guardar info internamente. Es un obj. lit. (clave/valor), que guardará lo que 
deseemos. Y que puede variar a lo largo del tiempo bajo distintas circunstancias, ej, eventos.

Es necesario inicializar el estado en un valor determinado (partir de una base)
Para esto es necesario la implementación de 2 cosas:
-del método Constructor, con su método interno "super".
-del estado en sí: this.state = { nombre:valor }
y lo represento en el render como: <h2>{ this.state.nombre}</h2>

Para CAMBIAR EL ESTADO -setState
actualiza todas aquellas propiedades del estado interno del componente que sean escritas dentro de él

-cómo lo cambio? antes del render defino un método (cómo una función pero sin la palabra function), 
que utilice el método setState:
 aumentarValor(){
  this.setState({valor: this.state.valor + 1})
 }
-cuándo lo cambio? cuando se ejecute el evento que yo quiero:
<button onClick={()=>this.aumentarValor()}>Aumentar</button>

Cada vez que cambio el estado se vuelve a ejecutar el render, esta es la magia de React

Eventos:
Se manejan sobre el JSX del componente, y los mismos se escriben como si fuesen atributos.
Siempre con la forma onClick // onMouseOver // onBlur // onSubmit (on + camelCase)
Pasando, dentro de llaves, una arrow function que ejecute el método creado:
onMouseOver= { () => this.aumentarValor() }
*/

import React, { Component } from "react";
import Saludo from "./Saludo";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valor: props.inicial, //en el componente index paso inicial={0} - acordarse de las llaves!
    };
  }

  aumentarValor() {
    this.setState({ valor: this.state.valor + 1 });
  }
  decrementarValor() {
    this.setState({ valor: this.state.valor - 1 });
  }
  cambiarVerde() {
    document.querySelector("body").style.backgroundColor = "green";
  }
  cambiarCeleste() {
    document.querySelector("body").style.backgroundColor = "aquamarine";
  }
  lanzarAlerta() {
    alert("Me clickeaste!");
  }

  render() {
    return (
      <div // Más ejemplos de eventos. Notar que en este caso no Ejecuto los métodos
        className=""
        onMouseOver={this.cambiarVerde}
        onMouseOut={this.cambiarCeleste}
        onClick={this.lanzarAlerta}
      >
        <h2>{this.state.valor}</h2>
        <button onClick={() => this.aumentarValor()}>Aumentar</button>
        <button onClick={() => this.decrementarValor()}>Decrementar</button>
        <Saludo nombre="Carlos" rango="Boina verde" apodos={["Groso"]} />
        <Saludo
          nombre="Mariano"
          rango="Soldado"
          apodos={["corneta", "zapallo", "cuerno"]}
        />
        <Saludo>
          <p>Acá está el children</p>
          <h6>que puede ser ...</h6>
          <ul>
            <li>lo que..</li>
            <li>yo quiera..</li>
          </ul>
        </Saludo>
        <Saludo />
      </div>
    );
  }
}

//export default App;

/*CICLO DE VIDA
Serie de estados por los que pasa un componente: Montaje - Actualización - Desmontaje.
Es fundamente en React.
ComponentDidMount - Se ejecuta en el cliente,inmediatamente despues del 1er renderizado. Una vez
q se ejecuta quedarán disponibles los elementos renderizados dentro del DOM.
Si se realizan pedidos asincrónicos en ese componente, este es el momento ideal para llamarlos.
ComponentDidUpdate - Se ejecuta cada vez que el componente sufre un cambio de estado, sea provocado,
por si mismo, o por un componente padre.
Puede recibir 2 parámetros: las props existentes previas a la actualización, y estado previo. En ambos
casos son objetos.
ComponentWillUnmount - se produce la limpieza necesaria, como por ej. la cancelación de solicitudes
asíncronas a las APIS. Acá no tienen ningún sentido usar setState */

/* Consumo de APIs 
cuándo consigo la info de la Api? componentDidMount
dónde guardo los datos? estado inicial
Gracias a los ciclos de vida, puedo mostrar desde un primer momento, los datos extraidos de un pedido
asíncrono a los endpoints de una API (es decir, antes de que se ejecute cualquier evento por parte
del usuario) 
  En React NO necesito importar Fetch porque viene incluido en el objeto window, de hecho podrìa hacer:
window.fetch, pero se puede omitir como siempre.

REACT ROUTER
SPA- SIMPLE PAGE APPLICATION: Levanto un gran, pero único HTML, y mediante la barra de direcciones,
y lo que configure se van a mostrar algunos componentes, y esconder otros, dando la sensación de que se
está navegando por varias páginas de manera muy fluida. Esto es gracias a react router, el cual
gestiona las rutas en las apps que utilizan React. lo instalo:

npm install react-router-dom
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"

 BrowserRouter envuelve toda la app para que la app sepa que voy a utilizar react router(en Index.js 
cambio la etiqueta React.StrictMode por BrowserRouter)

 Link - es el enlace para que pueda ir a cualquier lugar
 <Link to="/">Home</Link> // Podría usar: <a href="/">Home</a> PEERO con <a> el documento se carga completo
 y pierdo la gracia de React

 Route - permite definir cual es el componente que quiero renderizar dependiendo de la ruta. En las
 versiones recientes solo se puede utilizar dentro de Routes
*/
import Projects from "./Projects";
import Users from "./Users";
import NotFound from "./NotFound";
import { Routes, Route, Link } from "react-router-dom";

//function App() {
return (
  /*En la V6, ya no se puede usar el prop "component". Este fue reemplazado por "element", 
    con la siguiente sintaxis: <Route path="/" element={<Home />}></Route>
      Además, <Route> solo puede ser usado como hijo de <Routes>, ya no más directamente.
      Por lo que hay que importar también Routes. Y usarlo para envolver todos los <Route>*/
  <div>
    <Link to="/projects" exact="true">
      {" "}
      {/* exact="true" evita que si tuviera otra dirección, por ej,  "/projectsInfo",
        al entrar a "/projects" NO se carguen ambos componentes. Sumamente útil para el caso
        de la raíz "/". */}
      Projects
    </Link>
    <br></br>
    <Link to="/users" exact="true">
      Users
    </Link>
    <Link to="/no-existe" exact="true">
      No existe
      {/* No muestra nada, porque la ruta no tiene ningún macheo con ningún path*/}
    </Link>

    <Routes>
      <Route path="/projects" element={<Projects />}></Route>
      <Route path="/users" element={<Users />}></Route>
      <Route path="/*" element={<NotFound />}></Route>
      {/* "/*" hace que cualquier ruta que no sea las mencionadas en este Routes, levanten el
        componente de NotFound */}
    </Routes>
  </div>
);
//}

//export default App;

/* Rutas Parametrizadas:
 */

/* HOOKS
Los hooks (desde aprox 2019), permiten prescindir de los componentes del tipo Class.
Basicamente permiten que cualquier componente funcional tenga estados (mediante useState),
y ciclo de vida (mediante useEffect).
Hice una nueva versión del componente Projects, antiguamente con Class, y lo hice tipo Hooks:  */
import ProjectsTable from "./ProjectsTable";
import ProjectDetail from "./ProjectDetail";
import { useState, useEffect } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  /* Así defino el estado inicial. El primer elemento, el que acá llamé "projects", será lo que defina
  dentro del useState, en este caso, un array vacío. El 2do elemento, por convención se llamará siempre
  "set + nombreDelPrimerElemento", es la función, mediante la cual se cambiará el estado inicial. */

  useEffect(() => {
    fetch("http://localhost:3001/proyectos/infoReact", {
      "content-type": "application/json",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setProjects(data.data))
      .catch((error) => console.log(error));
  }, []);
  /* El useEffect, se usa para los 3 ciclos de vida, cambiando la forma en que se lo llama. El equivalente
  al componentDidMount, es "useEffect(()=>{ acá va la función que quiero ejecutar, por ej. Fetch}, [] )" 
  y siempre va de 2do parámetro el "[]", (para el caso de que quiera que se ejecute al montarse).
  Notar que uso, en el 2do then, la función que cambia el estado inicial "setProjects*/

  return (
    <div>
      <ProjectsTable projectsList={projects}></ProjectsTable>
    </div>
  );
}

//export default Projects;

/* BOOTSTRAP-REACT
https://react-bootstrap.github.io/getting-started/introduction/
en la consola, parado en el directorio de React, lo instalo con:
npm install react-bootstrap bootstrap
y en el index.js, o app.js, importo lo siguiente:*/

import "bootstrap/dist/css/bootstrap.min.css";
/*luego importo cada componente que vaya a usar , y en el envoltorio de App, pongo un className, con
con el tipo de container que mejor quede
https://getbootstrap.com/docs/5.0/layout/containers/
className="container-fluid" ajusta al 100% en todos los breakpoints (responsive)
*/


/* Componente que brinda la tabla de "detalles del proyecto" 
Tiene varias cosas interesantes a repasar:*/
function DetailsProjectsTable() {
  const params = useParams();
  console.log(params.projectId);
  /* -Capturo el parámetro que viene por la URL, mediante useParams.
   -Notar que para obtenerlo, del objeto params, le paso la propiedad con el nombre que le puse en la ruta.
   -Ver el enrutador en el componente App, por eso el "projectId"
   ( <Route  path="/details-projects/:projectId" element={<DetailsProjectsTable />}></Route>) */
  const [project, setProjects] = useState([]);
  /* -uso useState para cargar los datos de los proyectos en el estado inicial.
   -el estado inicial es un array vacío
   -fetch para consumirlos desde la API. Con los headers sino me daba error. VER CORS
   -el 1er then, lo mismo the siempre
   -el 2do, le aplico la funcion "setProjects" para actualizar el estado, así, de una sola vez, camio el array vacío, por
   el proyecto en cuestión.
   -"data.data" es el array que consumo, y ya ahí mismo le aplico el find, para que me lo deje actualizado
   -mediante el uso del parámetro, utilizo "find", para encontrar el proyecto indicado (si usara filter recordar que 
    devuelve un array)
   - Etiquetas de tabla:
  <Table>
        <thead> "table headers" - encabezados agrupados
          <tr> "table row" - filas
            <th>staff</th> "table head" - encabezado columna
            <th>rol</th>
            ...
          </tr>
        </thead>

        <tbody>
          <tr> 
            <td>algo..</td> - celdas
            <td></td>
            ...
          </tr>
         </tbody>
      </Table>
   -luego, LO QUE ME HABÍA COMPLICADO DE ESTE COMPONENTE, fue: como armar una tabla, cuando los datos vienen de 2 arrays, 
   ergo, 2 maps, que tenían que coincidir en la misma linea los mismos datos...
   -Seguir los nros...
   */

  useEffect(() => {
    fetch("http://localhost:3001/proyectos/infoReact", {
      "content-type": "application/json",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) =>
        setProjects(data.data.find((proy) => proy._id === params.projectId))
      )
      .catch((error) => console.log(error));
  }, []);


  /* 6- Entonces, defino las variables, utilizco el condicional para asegurarme que renderice una vez cargado los datos... 
  y...  */
  let nombre,
    contenido,
    nivel,
    porcAsigXContrato,
    porcAsigReal,
    hsMensXContrato,
    hsReales,
    observationsUser;

  if (project.projectsInfo) {
    /* 7- PLANTEO UN MAP CADA CELDA!! TENIENDO EN CUENTA LAS KEY PROPS!!
    Con esto, recorro todo los valores de cara array, y los puedo ubicar en orden gracias a ...
     */
    nivel = project.projectsInfo.map((projectInfo, i) => (
      <td key={projectInfo + i}>{projectInfo.nivel}</td>
    ));
    porcAsigXContrato = project.projectsInfo.map((projectInfo, i) => (
      <td key={projectInfo + i}>{projectInfo.porcAsigXContrato}</td>
    ));
    porcAsigReal = project.projectsInfo.map((projectInfo, i) => (
      <td key={projectInfo + i}>{projectInfo.porcAsigReal}</td>
    ));
    hsMensXContrato = project.projectsInfo.map((projectInfo, i) => (
      <td key={projectInfo + i}>{projectInfo.hsMensXContrato}</td>
    ));
    hsReales = project.projectsInfo.map((projectInfo, i) => (
      <td key={projectInfo + i}>{projectInfo.hsReales}</td>
    ));
    observationsUser = project.projectsInfo.map((projectInfo, i) => (
      <td key={projectInfo + i}>{projectInfo.observationsUser}</td>
    ));
  }

  /* 1- Con "if (project.involved)" le indico que lo ejecute una vez que el componente cargó el estado. Evito Errores.  */
  if (project.involved) {
    nombre = project.name;
    /* 2- Lo importante viene acá. Por CADA PERSONA, quería una fila (tr), entonces, un map, sobre el array de involucrados */
    contenido = project.involved.map((involved, i) => (
      <tr>
        <td>
          {" "}
          {/* 3- La primer celda de esta fila, será el nombre de la persona, el cual se desprende de este array sin problemas */}
          <a
            key={involved + i}
            href={"http://localhost:3001/personal/detail/" + involved._id}
          >
            {involved.name}
          </a>
        </td>
        <td key={involved + i}>{involved.rol}</td>{" "}
        {/*4 Esto también se desprende del mismo array, por lo que uso el mismo map  */}
        {/*5 Con lo que me había trabado mal, fue con lo que sigue, cada una de las siguientes celdas, vienen de otro array */}
        {/*8- gracias a esta [i], que es la que itera cada componente en este map
        9- El hecho te tener que definir cada variable afuera, y traerla dentro de la celda también me había trabado */}
        <td>{nivel[i]}</td>
        <td>{porcAsigXContrato[i]}</td>
        <td>{porcAsigReal[i]}</td>
        <td>{hsMensXContrato[i]}</td>
        <td>{hsReales[i]}</td>
        <td>{observationsUser[i]}</td>
      </tr>
    ));
  }

  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">{nombre}</h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr className="encabezadosTabla">
            <th>staff</th>
            <th>rol</th>
            <th>level</th>
            <th>% assignment contract</th>
            <th>% assignment real</th>
            <th>monthly hours contract</th>
            <th>monthly hours real</th>
            <th>observations</th>
          </tr>
        </thead>

        <tbody>{contenido}</tbody>
      </Table>
    </>
  );
}

/* CSS en React
los archivos css no se pueden colocar en la carpeta Public externa, tienen que estar
dentro de src, por eso la creación de la carpeta "assets (activos)" */

/* Posicionar footer al pie de la página:
-Obs, footer va dentro del body si lo que quiero es un pie de página, sino será el pie de otro elemento

html {
  min-height: 75%; //si hay más contenido, que esta caja mínima, la caja va a crecer hasta envolver el contenido
  position: relative; //el elemento esta posicionado relativo respecto a si mismo, pero un "absolute", se posiciona en relacion
                     // a este
}

body {
  margin: 0; // no dejo ningún margen
  margin-bottom: 35px; // css es procedural, en el borde inferior dejo un espacio de 35px
}

footer {
  position: absolute; //se a ubicar en relación al elemento con position relative
  bottom: 0; // al pie del elemento con relative
  width: 100%;
  height: 35px; //ocupando este espacio, que es el que le deja el body
}*/
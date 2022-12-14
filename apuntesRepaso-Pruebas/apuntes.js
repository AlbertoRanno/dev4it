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
BD NoSQL - significa No relacional (es decir, que no se guardan en tablas relacionales, pero SI PUEDEN GUARDAR RELACIONES ENTRE DATOS - Las relaciones pueden estar incluso anidadas en una única escritura)
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

// Moment - modulo instalable para cambiar los formatos de las fechas:
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
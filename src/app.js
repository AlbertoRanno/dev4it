/*****************  Requires  ***************/
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const session = require("express-session");
const userLogged = require("./middlewares/userLogged");
const cookies = require("cookie-parser");
const db = require("./data/db");

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
  const resultado = await personal.save()
  console.log(resultado);
}
//crear()

/*****************  view engine setup  ***************/
app.set("view engine", "ejs");
app.set("views", "./src/views");

/*****************  middlewares  ***************/
app.use(express.static("./public"));

app.use(
  session({
    secret:
      "texto único aleatorio para identificar este sitio web y evitar que otras páginas usen lo que guardo en session",
    //tendría que ir encriptada con bcrypts??
    resave: false,
    saveUninitialized: false, //https://github.com/expressjs/session#options"
  })
);

app.use(cookies());

app.use(userLogged);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride("_method"));

/*****************  Routers  ***************/
const routerMain = require("./routes/main.js");
const routerPersonas = require("./routes/personal.js");
const routerProyectos = require("./routes/proyectos.js");
const { array } = require("./middlewares/multer");

app.use("/personal", routerPersonas);
app.use("/proyectos", routerProyectos);
app.use("/", routerMain);

/*****************  Listen  ***************/
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`El servidor se esta escuchando en el puerto ${PUERTO}...`);
});

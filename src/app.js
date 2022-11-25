/*****************  Requires  ***************/
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const session = require("express-session");
const userLogged = require("./middlewares/userLogged");
const cookies = require("cookie-parser");
const db = require("./data/db");


const mongoose = require("mongoose");
const url = "mongodb://localhost/dev4it";

/*Connecting to MongoDB
First, we need to define a connection. If your app uses only one database, you should use mongoose.connect. If you need to create additional connections, use mongoose.createConnection.

Both connect and createConnection take a mongodb:// URI, or the parameters host, database, port, options.*/

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    /*
    useFindAndModify: false,
    useCreateIndex: true
    */
  })
  .then(() => console.log("Conectado a Mongoose"))
  .catch((e) => console.log("El error de conexión es " + e));

/*The following example shows some of these features:

const Comment = new Schema({
  name: { type: String, default: 'hahaha' },
  age: { type: Number, min: 18, index: true },
  bio: { type: String, match: /[a-z]/ },
  date: { type: Date, default: Date.now },
  buff: Buffer
}); */

//convención, arrancar con minúscula, y decir que es un Schema
const personalSchema = mongoose.Schema({
  name: String,
  email: String,
  rol: String,
  password: String,
  proyects: Array,
  seniority: String,
  avatar: String,
});

//convención, arrancar con Mayúscula, y aclarar que es un modelo
const PersonalModel = mongoose.model("persona", personalSchema);

//Mostrar
const mostrar = async () => {
  const personal = await PersonalModel.find({ name: "Hernán Mercado" }); //find() para todos
  console.log(personal);
}
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

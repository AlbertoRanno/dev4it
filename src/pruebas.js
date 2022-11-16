const bcryptjs = require("bcryptjs");
let hash = bcryptjs.hashSync("contraseña", 10);
console.log(hash);
//hashea la contraseña, 10 o 12 era el nivel de salt..
console.log(bcryptjs.compareSync("contraseña",hash));

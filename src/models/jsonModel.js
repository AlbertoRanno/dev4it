const fs = require("fs");
const path = require("path");

class JsonModel {
  constructor(name) {
    this.name = name;
    this.dataDir = "../data/";
    this.dataPath = path.resolve(__dirname, this.dataDir, this.name + ".json");
  }

  /** Lee el archivo JSON */
  readJsonFile() {
    let fileContents = fs.readFileSync(this.dataPath, "utf-8");
    if (fileContents) {
      return JSON.parse(fileContents);
    }
    return [];
  }

  /** Escribe el archivo JSON */
  writeJsonFile(data) {
    let jsonData = JSON.stringify(data, null, " "); // Para que conserve el formato de la B.D.
    fs.writeFileSync(this.dataPath, jsonData);
  }

  /** Genera el próximo valor para la pk (primary key) */
  generatePk() {
    let items = this.readJsonFile();
    let lastItem = items.pop(); // extraigo al último usuario

    if (lastItem) {
      return lastItem.id + 1; 
    }

    return 1; //si no tuviera registros, el primero será el nro 1
  }

  /** Trae todos los registros */
  all() {
    return this.readJsonFile();
  }

  /** Trae un registro por su valor de pk */
  buscar(id) {
    let items = this.readJsonFile(); // array con todos los items (usuarios o productos)
    return items.find((item) => item.id == id);
    //va a iterar todos los items, y va a retornar a aquel cuyo id sea al que tomé por parámetro
    //si no lo encuentra, devuelve undefined
  }

  /** Filtra registros por su clave y valor */
  filtrarPorCampoValor(campo, valor) {
    let items = this.readJsonFile();
    return items.filter((item) => item[campo] == valor);
    //a diferencia del anterior, acá puedo traer varios (en el anterior solo el primero que encuentre)
  }

  /** Guarda el registro en la colección */
  save(item) {
    let items = this.readJsonFile();
    item.id = this.generatePk(); // el id NO va a venir del formulario, lo tiene que crear este modelo

    // Se hace esto para setear como enteros campos id, price y discount. Sino quedan como strings en BD.
    // item.id = parseInt(item.id);
    // item.price = parseInt(item.price);
    // item.discount = parseInt(item.discount);

    items.push(item);

    this.writeJsonFile(items);

    return item.id;
  }

  /** Actualiza el registro de la colección */
  update(item) {
    let items = this.readJsonFile();

    let updatedItems = items.map((currentItem) => {
      if (currentItem.id == item.id) {
        return (currentItem = item);
      }
      return currentItem;
    });

    // // Se hace esto para setear como enteros campos id, price y discount. Sino quedan como strings en BD.
    // updatedItems = updatedItems.map((currentItem) => {
    //   currentItem.id = parseInt(currentItem.id);
    //   currentItem.price = parseInt(currentItem.price);
    //   currentItem.discount = parseInt(currentItem.discount);

    //   return currentItem;
    // });

    this.writeJsonFile(updatedItems);

    return item.id;
  }

  /** Elimina el registro de la colección */
  destroy(id) {
    let items = this.readJsonFile();

    let filteredItems = items.filter((currentItem) => currentItem.id != id);
    //recorre el array de usuarios de a 1, y devuelve todos aquellos cuyos id NO coinciden con el indicado
    this.writeJsonFile(filteredItems); // y sobreescribe ese nuevo array en el json

    return "se eliminó el registro con el ID " + id
  }
}

module.exports = JsonModel;

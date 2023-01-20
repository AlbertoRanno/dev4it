window.addEventListener("load", function () {
  let form = document.querySelector("button.register");

  form.addEventListener("click", function (e) {
    let errors = 0;

    let name = document.querySelector("input.name");
    let nameDiv = document.querySelector("div.name");
    let email = document.querySelector("input.email");
    let emailDiv = document.querySelector("div.email");
    let image = document.querySelector("input.image");
    let imageDiv = document.querySelector("div.image");
    let password = document.querySelector("input.password");
    let passwordDiv = document.querySelector("div.password");
    let repeatPassword = document.querySelector("input.repeatPassword");
    let repeatPasswordDiv = document.querySelector("div.repeatPassword");

    //expresión regular recomendada para validacion de email básico:
    function validarEmail(valor) {
      let regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;

      return regex.test(valor); //si cumple la validación devolverá un True
    }

    function validarImage() {
      let archivo = image.value;
      let extension = archivo.substring(
        /*substring() devuelve una parte de una cadena definida por los índices pasados ​​como parámetros a esta función.
        Toma dos parámetros, el índice inicial y el índice final*/
        archivo.lastIndexOf("."),
        /*lastIndexOf(), el 1er parámetro, averigua la última posición donde el "." está presente */
        archivo.length //2do parámetro, el índice final.
      );
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

    if (name.value.length == 0) {
      errors++;
      name.classList.add("is-invalid");
      nameDiv.classList.add("invalid-feedback");
      nameDiv.innerHTML = "Completar el nombre es necesario";
    } else if (name.value.length <= 2) {
      errors++;
      name.classList.add("is-invalid");
      nameDiv.classList.add("invalid-feedback");
      nameDiv.innerHTML = "Al menos 3 caracteres";
    } else {
      name.classList.remove("is-invalid");
      nameDiv.classList.remove("invalid-feedback");
      name.classList.add("is-valid");
      nameDiv.classList.add("valid-feedback");
      nameDiv.innerHTML = "Bien hecho!!";
    }

    if (email.value.length == 0) {
      errors++;
      email.classList.add("is-invalid");
      emailDiv.classList.add("invalid-feedback");
      emailDiv.innerHTML = "Tienes que escribir un email";
    } else if (!validarEmail(email.value)) {
      errors++;
      email.classList.add("is-invalid");
      emailDiv.classList.add("invalid-feedback");
      emailDiv.innerHTML = "Escribilo bien";
    } else {
      email.classList.remove("is-invalid");
      emailDiv.classList.remove("invalid-feedback");
      email.classList.add("is-valid");
      emailDiv.classList.add("valid-feedback");
      emailDiv.innerHTML = "Bien hecho!!";
    }

    if (image.value.length == 0) {
      errors++;
      image.classList.add("is-invalid");
      imageDiv.classList.add("invalid-feedback");
      imageDiv.innerHTML = "Falta la foto";
    } else if (validarImage(image.value)) {
      //No puedo chequearla, porque saltan primero las validaciones del back, y como la selección de la imagen no persiste, cuando vuelvo a proceder, vuelve a salir la del back
      errors++;
      image.classList.add("is-invalid");
      imageDiv.classList.add("invalid-feedback");
      imageDiv.innerHTML = "El formato no es correcto";
    } else {
      image.classList.remove("is-invalid");
      imageDiv.classList.remove("invalid-feedback");
      image.classList.add("is-valid");
      imageDiv.classList.add("valid-feedback");
      imageDiv.innerHTML = "Buenísimo, ya tenés la foto";
    }

    if (password.value.length == 0) {
      errors++;
      password.classList.add("is-invalid");
      passwordDiv.classList.add("invalid-feedback");
      passwordDiv.innerHTML = "Debes elegir una contraseña";
    } else if (password.value.length < 3) {
      //idem image, al no persistir, y salir primero el back.. =(
      errors++;
      password.classList.add("is-invalid");
      passwordDiv.classList.add("invalid-feedback");
      passwordDiv.innerHTML = "Demasiado corta para ser la contraseña";
    } else {
      password.classList.remove("is-invalid");
      passwordDiv.classList.remove("invalid-feedback");
      password.classList.add("is-valid");
      passwordDiv.classList.add("valid-feedback");
      passwordDiv.innerHTML = "Genial, recordala";
    }

    if (repeatPassword.value.length == 0) {
      errors++;
      repeatPassword.classList.add("is-invalid");
      repeatPasswordDiv.classList.add("invalid-feedback");
      repeatPasswordDiv.innerHTML =
        "Repetir la contraseña para asegurarse que está correcta";
    } else if (repeatPassword.value !== password.value) {
      // idem todo lo que no persiste...
      errors++;
      repeatPassword.classList.add("is-invalid");
      repeatPasswordDiv.classList.add("invalid-feedback");
      repeatPasswordDiv.innerHTML = "No coinciden";
    } else {
      repeatPassword.classList.remove("is-invalid");
      repeatPasswordDiv.classList.remove("invalid-feedback");
      repeatPassword.classList.add("is-valid");
      repeatPasswordDiv.classList.add("valid-feedback");
      repeatPasswordDiv.innerHTML = "Genial, recordala";
    }

    if (errors > 0) {
      e.preventDefault();
    }
  });
});

window.addEventListener("load", function () {
  let form = document.querySelector("button.register");
  let name = document.querySelector("input.name");
  let nameDiv = document.querySelector("div.name");
  let email = document.querySelector("input.email");
  let emailDiv = document.querySelector("div.email");

  //expresión regular recomendada para validacion de email básico:
  function validarEmail(valor) {
    let regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g;

    return regex.test(valor); //si cumple la validación devolverá un True
  }

  form.addEventListener("click", function (e) {
    let errors = 0;

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
      nameDiv.classList.remove("is-invalid");
      name.classList.add("is-valid");
      nameDiv.classList.add("valid-feedback");
      nameDiv.innerHTML = "Bien hecho!";
    }

    // if (email.value == "") {
    //   errors++;
    //   email.classList.add("validationsOnTime");
    //   emailDiv.innerHTML = "<small> Tienes que escribir un email </small>";
    // } else if (!validarEmail(email.value)) {
    //   errors++;
    //   email.classList.add("validationsOnTime");
    //   emailDiv.innerHTML = "<small> Escribilo bien </small>";
    // } else {
    //   email.classList.remove("validationsOnTime");
    //   name.classList.remove("is-invalid");
    //   email.classList.add("corregido");
    //   emailDiv.innerHTML = "<small> Bien hecho! </small>";
    // }

    if (errors > 0) {
      e.preventDefault();
    }
  });
});

window.onload = function () {
  let elH1 = document.querySelector("h1");
  let elh2 = document.querySelector("h2");
  let losH2 = document.querySelectorAll("h2");

  // let confirmaCambios = confirm("Querés cambiar el color del título?"); // devuelve T or F
  // if (confirmaCambios) {
  //   elH1.innerHTML += "<strong> - Uso el Home para repasar JS-Front</strong>";
  //   elH1.style.backgroundColor = "cyan";
  //   elh2.classList.add("home");
  // }

  // elH1.addEventListener("mouseover", function () {
  //   elH1.classList.toggle("home");
  // });

  // let chequeo = elh2.classList.contains("home");
  // console.log(chequeo);

  // elh2.addEventListener("dblclick", function () {
  //   elh2.style.color = prompt("Decime un color en inglés...")
  // })

  for (let i = 0; i < losH2.length; i++) {
    losH2[i].addEventListener("click", function () {
      this.style.color = "green";
    });
  }

  window.addEventListener("keypress", function (e) {
    console.log(e.key);
    if (e.key == "Enter") {
      alert("Tocaste Enter!");
    }
  });
};

import fetch from "node-fetch";
import React, { Component } from "react";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: "",
    };
  }

  // apiCall(url, consecuencia) {
  //   fetch(url, {mode: "no-cors"})
  //     .then((response) => response.json())
  //     .then((data) => consecuencia(data))
  //     .catch((error) => console.log(error));
  // }

  // mostrarData = (data) => {
  //   console.log(data);
  // };

  componentDidMount() {
    //this.apiCall("http://localhost:3001/proyectos/infoReact", this.mostrarData);


 var requestOptions = {
   "content-type": "application/json",
   method: "GET",
   redirect: "follow",
 };
 fetch("http://localhost:3001/proyectos/infoReact", requestOptions)
   .then((response) => response.json())
   .then((data) => console.log(data));

  }
  componentDidUpdate() {
  }

  render() {

    let contenido;

    if (this.state.project === "") {
      contenido = <p> Cargando... </p>;
    } else {
      contenido = <h2> {this.state.project} </h2>;
    }
    return <div>{contenido}</div>;
  }
}

export default Projects;

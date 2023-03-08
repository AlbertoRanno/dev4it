import React, { Component } from "react";
import ProjectsTable from "./ProjectsTable";
import ProjectDetail from "./ProjectDetail";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  apiCall(url, consecuencia) {
    fetch(url, {
      "content-type": "application/json",
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => consecuencia(data))
      .catch((error) => console.log(error));
  }

  mostrarData = (data) => {
    //console.log(data.data[0].name);
    console.log(data.data);
    this.setState({
      projects: data.data,
    });
  };

  componentDidMount() {
    this.apiCall("http://localhost:3001/proyectos/infoReact", this.mostrarData);
  }
  componentDidUpdate() {}

  render() {
    let contenido;

    if (this.state.projects === []) {
      contenido = <p> Cargando... </p>;
    } else {
      contenido = (
        <>
          <ProjectDetail projectsList={this.state.projects}></ProjectDetail>
          <ProjectsTable projectsList={this.state.projects}></ProjectsTable>
        </>
      );
        

    
    }
    return <div>{contenido}</div>;
  }
}

export default Projects;

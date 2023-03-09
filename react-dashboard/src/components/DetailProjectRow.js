import { useState, useEffect } from "react";

function DetailProjectRow(props) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/proyectos/infoReact", {
      "content-type": "application/json",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) =>
        setProjects(data.data.find(proy => proy._id === props.id))
      )
      .catch((error) => console.log(error));
  }, []);

  let contenido1,
    contenido2,
    contenido3,
    contenido4,
    contenido5,
    contenido6,
    contenido7,
    contenido8;

  if (projects.involved) {
    contenido1 = projects.involved.map((involved, i) => (
      <a
        key={involved + i}
      
        href={"http://localhost:3001/personal/detail/" + involved._id}
      >
        {involved.name}
      </a>
    ));
    contenido2 = projects.involved.map((involved, i) => (
      <span key={involved + i}>
        {involved.rol}
        <br />
        <br />
      </span>
    ));
  }

  if (projects.projectsInfo) {
    contenido3 = projects.projectsInfo.map((projectInfo, i) => (
      <span key={projectInfo + i}>
        {projectInfo.nivel}
        <br />
        <br />
      </span>
    ));
    contenido4 = projects.projectsInfo.map((projectInfo, i) => (
      <span key={projectInfo + i}>
        {projectInfo.porcAsigXContrato}
        <br />
        <br />
      </span>
    ));

    contenido5 = projects.projectsInfo.map((projectInfo, i) => (
      <span key={projectInfo + i}>
        {projectInfo.porcAsigReal}
        <br />
        <br />
      </span>
    ));

    contenido6 = projects.projectsInfo.map((projectInfo, i) => (
      <span key={projectInfo + i}>
        {projectInfo.hsMensXContrato}
        <br />
        <br />
      </span>
    ));
    contenido7 = projects.projectsInfo.map((projectInfo, i) => (
      <span key={projectInfo + i}>
        {projectInfo.hsReales}
        <br />
        <br />
      </span>
    ));
    contenido8 = projects.projectsInfo.map((projectInfo, i) => (
      <span key={projectInfo + i}>
        {projectInfo.observationsUser}
        <br />
        <br />
      </span>
    ));
  }

  return (
    <>
      <td>{contenido1}</td>
      <td>{contenido2}</td>
      <td>{contenido3}</td>
      <td>{contenido4}</td>
      <td>{contenido5}</td>
      <td>{contenido6}</td>
      <td>{contenido7}</td>
      <td>{contenido8}</td>
    </>
  );
}

export default DetailProjectRow;

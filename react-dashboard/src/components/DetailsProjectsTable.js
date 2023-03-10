import Table from "react-bootstrap/Table";
import "../assets/styles.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function DetailsProjectsTable() {
  const params = useParams();
  //console.log(params.projectId);

  const [project, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/proyectos/infoReact", {
      "content-type": "application/json",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) =>
        setProjects(data.data.find((proy) => proy._id === params.projectId))
      )
      .catch((error) => console.log(error));
  }, []);

  let nombre,
    contenido,
    nivel,
    porcAsigXContrato,
    porcAsigReal,
    hsMensXContrato,
    hsReales,
    observationsUser;

  if (project.projectsInfo) {
    nivel = project.projectsInfo.map((projectInfo, i) => (
      <td key={projectInfo + i}>{projectInfo.nivel}</td>
    ));
    porcAsigXContrato = project.projectsInfo.map((projectInfo, i) => (
      <td key={projectInfo + i}>{projectInfo.porcAsigXContrato}</td>
    ));
      porcAsigReal = project.projectsInfo.map((projectInfo, i) => (
        <td key={projectInfo + i}>{projectInfo.porcAsigReal}</td>
      ));
      hsMensXContrato = project.projectsInfo.map((projectInfo, i) => (
        <td key={projectInfo + i}>{projectInfo.hsMensXContrato}</td>
      ));
      hsReales = project.projectsInfo.map((projectInfo, i) => (
        <td key={projectInfo + i}>{projectInfo.hsReales}</td>
      ));
      observationsUser = project.projectsInfo.map((projectInfo, i) => (
        <td key={projectInfo + i}>{projectInfo.observationsUser}</td>
      ));

  }
  if (project.involved) {
    nombre = project.name;
    contenido = project.involved.map((involved, i) => (
      <tr>
        <td>
          <a
            key={involved + i}
            href={"http://localhost:3001/personal/detail/" + involved._id}
          >
            {involved.name}
          </a>
        </td>
        <td key={involved + i}>{involved.rol}</td>
        <td>{nivel[i]}</td>
        <td>{porcAsigXContrato[i]}</td>
        <td>{porcAsigReal[i]}</td>
        <td>{hsMensXContrato[i]}</td>
        <td>{hsReales[i]}</td>
        <td>{observationsUser[i]}</td>
      </tr>
    ));
  }

  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">{nombre}</h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr className="encabezadosTabla">
            <th>staff</th>
            <th>rol</th>
            <th>level</th>
            <th>% assignment contract</th>
            <th>% assignment real</th>
            <th>monthly hours contract</th>
            <th>monthly hours real</th>
            <th>observations</th>
          </tr>
        </thead>

        <tbody>{contenido}</tbody>
      </Table>
    </>
  );
}

export default DetailsProjectsTable;

import { useState, useEffect } from "react";
import ProjectRow from "./ProjectRow";
import Table from "react-bootstrap/Table";
import "../assets/encabezadosTabla.css";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/proyectos/infoReact", {
      "content-type": "application/json",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setProjects(data.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr className="encabezadosTabla">
          <th>Projects</th>
          <th>Description</th>
          <th>Manager</th>
          <th>Condition</th>
          <th>Start date</th>
          <th>Deadline</th>
          <th>Staff</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, i) => (
          <tr key={i}>
            <ProjectRow {...project} />
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Projects;

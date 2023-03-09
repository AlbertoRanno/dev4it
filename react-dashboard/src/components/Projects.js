import { useState, useEffect } from "react";
import ProjectRow from "./ProjectRow";
import Table from "react-bootstrap/Table";

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
    <>
      <h1 className="h3 mb-2 text-gray-800">
        {" "}
        All the projects in the Database
      </h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>name</th>
            <th>description</th>
            <th>manager</th>
            <th>condition</th>
            <th>start date</th>
            <th>deadline</th>
            <th>staff</th>
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
    </>
  );
}

export default Projects;

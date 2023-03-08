import ProjectsTable from "./ProjectsTable";
import ProjectDetail from "./ProjectDetail";
import { useState, useEffect } from "react";

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

  <ProjectDetail projectsList={projects}></ProjectDetail>;
  
  return (
    <div>
      <ProjectsTable projectsList={projects}></ProjectsTable>
    </div>
  );
}

export default Projects;

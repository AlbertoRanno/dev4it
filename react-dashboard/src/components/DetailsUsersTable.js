import Table from "react-bootstrap/Table";
import "../assets/encabezadosTabla.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function DetailsUsersTable() {
  const params = useParams();
  //console.log(params.projectId);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/personal/infoReact", {
      "content-type": "application/json",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) =>
        setUsers(data.data.find((user) => user._id === params.userId))
      )
      .catch((error) => console.log(error));
  }, []);

  let contenido, name, email, rol, seniority, admin, projectInfo;

  if (users.projectInfo) {
    name = users.name;
    email = users.email;
    rol = users.rol;
    seniority = users.seniority;
    if (users.admin === true) {
      admin = "Yes";
    } else {
      admin = "No";
    }

    projectInfo = users.projectInfo.map((project, i) => (
      <tr key={project + i}>{project.name}</tr>
    ));

    contenido = (
      <tr>
        <td>{rol}</td>
        <td>{seniority}</td>
        <td>{projectInfo}</td>
        <td>{admin}</td>
        <td>{email}</td>
      </tr>
    );
  }

  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">
        {name} -
        <a href={"http://localhost:3001/personal/detail/" + params.userId}>
          Edit
        </a>
      </h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr className="encabezadosTabla">
            <th>Rol</th>
            <th>Seniority</th>
            <th>Projects involved</th>
            <th>Admin?</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>{contenido}</tbody>
      </Table>
    </>
  );
}

export default DetailsUsersTable;

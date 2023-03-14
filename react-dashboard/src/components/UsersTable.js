import UserRow from "./UserRow";
import Table from "react-bootstrap/Table";
import "../assets/encabezadosTabla.css";

function UsersTable(props) {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr className="encabezadosTabla">
          <th>Name</th>
          <th>Rol</th>
          <th>Seniority</th>
          <th>Projects</th>
        </tr>
      </thead>
      <tbody>
        {props.usersList.map((user, i) => (
          <tr key={i}>
            <UserRow {...user} />
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default UsersTable;

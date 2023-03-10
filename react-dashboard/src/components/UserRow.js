import { Link } from "react-router-dom";

function UserRow(props) {
  return (
    <>
      <td>
        <span>{props.name}</span>
      </td>
      <td>{props.rol}</td>
      <td>{props.seniority}</td>
      <td>
        {props.projectInfo.map((project) => (
          <Link to={"/details-projects/" + project._id}>{project.name}<br/></Link>
        ))}
      </td>
    </>
  );
}

export default UserRow;

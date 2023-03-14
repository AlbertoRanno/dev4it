import { Link } from "react-router-dom";

function ProjectRow(props) {
  return (
    <>
      <td>
        <Link to={"/details-projects/" + props._id}>{props.name}</Link>
      </td>
      <td>{props.description}</td>
      <td>{props.manager.name}</td>
      <td>{props.condition}</td>
      <td>{props.dateStart}</td>
      <td>{props.dateEnd}</td>
      <td>
        {props.involved.map((involved, i) => (
          <Link key={involved + i} to={"/details-users/" + involved._id}>
            {involved.name}
            <br />
          </Link>
        ))}
      </td>
    </>
  );
}

export default ProjectRow;

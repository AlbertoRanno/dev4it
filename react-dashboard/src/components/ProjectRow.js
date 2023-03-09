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
          <a
            key={involved + i}
            className="nav-link"
            href={"http://localhost:3001/personal/detail/" + involved._id}
          >
            {involved.name}
          </a>
        ))}
      </td>
    </>
  );
}

export default ProjectRow;

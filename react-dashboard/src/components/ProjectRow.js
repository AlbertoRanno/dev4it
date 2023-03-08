import { Link } from "react-router-dom";

function ProjectRow(props) {
  return (
    <>
      <td>
        <Link to={"/projectDetail/" + props._id}>{props.name}</Link>
      </td>
      <td>{props.description}</td>
      <td>{props.manager.name}</td>
      <td>{props.condition}</td>
      <td>{props.dateStart}</td>
      <td>{props.dateEnd}</td>
      <td>
        {props.involved.map((involved) => (
          <a
            className="nav-link"
            href={"http://localhost:3001/personal/detail/" + involved._id}
          >
            {involved.name} - {involved.rol}
          </a>
        ))}
      </td>
      <td>
        {props.projectsInfo.map((projectInfo) => (
          <>
            {" "}
            {projectInfo.nivel} - {projectInfo.porcAsigXContrato} -{" "}
            {projectInfo.porcAsigReal} - {projectInfo.hsMensXContrato} -{" "}
            {projectInfo.hsReales} - {projectInfo.observationsUser}
          </>
        ))}
      </td>
    </>
  );
}

export default ProjectRow;

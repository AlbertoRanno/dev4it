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
          <h5>
            <a
              className="nav-link"
              href={"http://localhost:3001/proyectos/detail/" + project._id}
            >
              <span>{project.name}</span>
            </a>
          </h5>
        ))}
      </td>
    </>
  );
}

export default UserRow;

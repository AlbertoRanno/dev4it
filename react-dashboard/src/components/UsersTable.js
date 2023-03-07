import UserRow from "./UserRow";

function UsersTable(props) {
  return (
    <>
      <h1 className="h3 mb-2 text-gray-800"> All the users in the Database</h1>

      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered"
              id="dataTable"
              width="100%"
              cellSpacing="0"
            >
              <thead>
                <tr>
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
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default UsersTable;

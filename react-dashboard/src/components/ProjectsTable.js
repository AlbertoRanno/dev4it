import ProjectRow from "./ProjectRow";
import Table from "react-bootstrap/Table";

function ProductsTable(props) {
  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">
        {" "}
        All the projects in the Database
      </h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Manager</th>
            <th>Condition</th>
            <th>Start date</th>
            <th>Deadline</th>
            <th>Staff</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {props.projectsList.map((project, i) => (
            <tr key={i}>
              <ProjectRow {...project} />
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default ProductsTable;

/*
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
                  <th>Description</th>
                  <th>Manager</th>
                  <th>Condition</th>
                  <th>Start date</th>
                  <th>Deadline</th>
                  <th>Staff</th>
                </tr>
              </thead>
              <tbody>
                {props.projectsList.map((project, i) => (
                  <tr key={i}>
                    <ProjectRow {...project} />
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


*/

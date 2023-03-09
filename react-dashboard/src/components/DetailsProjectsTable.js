import DetailProjectRow from "./DetailProjectRow";
import Table from "react-bootstrap/Table";
import { useParams } from "react-router-dom";

function DetailsProjectsTable() {
   const params = useParams();
   console.log(params.projectId);

  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">
        Details of the project {params.projectId}
      </h1>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>staff</th>
            <th>rol</th>
            <th>level</th>
            <th>% assignment - contract</th>
            <th>% assignment - real</th>
            <th>monthly hours - contract</th>
            <th>monthly hours - real</th>
            <th>observations</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <DetailProjectRow id={params.projectId} />
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default DetailsProjectsTable;

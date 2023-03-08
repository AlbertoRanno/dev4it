//import { useParams } from "react-router-dom"; // NECESARIO PARA CAPTURAR EL PARÁMETRO EN V6

function ProjectDetail(props) {

  // const { id } = useParams();
  // console.log(useParams());
  //console.log(typeof id); // String
  //IMPORTANTE - Lo paso a Nro, para poder realizar la comparación
  //const product = productsList.find((product) => product.id === Number(id));
  //console.log(product); // el objeto product
  const project = props.projectsList
  //console.log(typeof project);

  return (
    <div>
      <h2> Detalle del proyecto...{project}</h2>
      {/* <table
        className="table table-bordered"
        id="dataTable"
        width="100%"
        cellSpacing="0"
      >
        <thead>
          <tr>
            <th>person</th>
            <th>nivel</th>
            <th>porcAsigXContrato</th>
            <th>porcAsigReal</th>
            <th>hsMensXContrato</th>
            <th>hsReales</th>
            <th>observationsUser</th>
          </tr>
        </thead>
      </table> */}
    </div>
  );
}
export default ProjectDetail;

import Fila from "./ProductRow";

function ProductsTable(props) {
  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">
        {" "}
        All the products in the Database
      </h1>

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
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {props.productsList.map((product, i) => (
                  <tr key={i}>
                    <Fila {...product} />
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

export default ProductsTable;

function ProductRow(props) {
  return (
    <>
      <td>
        <h6>{props.name}</h6>
      </td>
      <td>
        <h6>
          <a
            className="nav-link"
            href={"http://localhost:3001/products/detail/" + props.id}
          >
            <span>{props.name}</span>
          </a>
        </h6>
      </td>
      <td>
        <h6>{props.categories.description}</h6>
      </td>
      <td>
        <h6>{props.description}</h6>
      </td>
    </>
  );
}

export default ProductRow;

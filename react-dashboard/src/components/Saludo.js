import React from "react";
import propTypes from "prop-types";


function Saludo(props) {
  let listadoDeApodos

  if (props.apodos != null){
    listadoDeApodos= 
<ul>
  {props.apodos.map((apodo, i) => (
    <li key={apodo + i}> {apodo} </li>
  ))}
</ul>;
  } else {
    listadoDeApodos=""
  }
  return (
    <div>
      <h1> Hola {props.nombre}</h1>
      <h2>{props.rango}</h2>
      {listadoDeApodos}
    </div>
  );
}

Saludo.propTypes = {
  apodos: propTypes.array,
};

Saludo.defaultProps = {
  nombre: "Visitante Anónimo",
  rango: "desconocido",
  apodos: null
};

export default Saludo;

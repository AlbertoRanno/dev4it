import React from "react";
import propTypes from "prop-types";
import "./Saludo.css"


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
      <h1 className="nombres"> Hola {props.nombre}</h1>
      {props.children}
      <h2>Tu rol será {props.rango}</h2>
      <h3>Y tus nombres claves serán: </h3>
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

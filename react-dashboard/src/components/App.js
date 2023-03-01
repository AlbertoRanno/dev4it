import React, { Component } from "react"
import Saludo from "./Saludo";

class App extends Component {
  render() {
    return (
      <div className="">
        <Saludo nombre="Carlos" rango="Boina verde" apodos={["Groso"]} />
        <Saludo
          nombre="Mariano"
          rango="Soldado"
          apodos={["corneta", "zapallo", "cuerno"]}
        />
        <Saludo>
          <p>Acá está el children</p>
          <h6>que puede ser ...</h6>
          <ul>
            <li>lo que..</li>
            <li>yo quiera..</li>
          </ul>
        </Saludo>
        <Saludo />
      </div>
    );
  }
}

export default App;

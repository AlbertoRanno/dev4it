import React, { Component } from "react";
import Saludo from "./Saludo";
import Projects from "./Projects"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valor: props.inicial,
    };
  }

  aumentarValor() {
    this.setState({ valor: this.state.valor + 1 });
  }
  decrementarValor() {
    this.setState({ valor: this.state.valor - 1 });
  }
  cambiarVerde() {
    document.querySelector("body").style.backgroundColor = "green";
  }
  cambiarCeleste() {
    document.querySelector("body").style.backgroundColor = "aquamarine";
  }
  lanzarAlerta() {
    alert("Me clickeaste!");
  }
  componentDidMount() {
    console.log("Me monté");
    
  }
  componentDidUpdate() {
    console.log("Me actualicé");
  }
  componentWillUnmount() {
    console.log("Me desmonté");
  }

  render() {
    return (
      <div
        className=""
        onMouseOver={this.cambiarVerde}
        onMouseOut={this.cambiarCeleste}
        onClick={this.lanzarAlerta}
      >
        <Projects></Projects>
        <h2>{this.state.valor}</h2>
        <button onClick={() => this.aumentarValor()}>Aumentar</button>
        <button onClick={() => this.decrementarValor()}>Decrementar</button>
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

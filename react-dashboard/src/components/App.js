import React, { Component } from "react";
import Projects from "./Projects";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valor: props.inicial,
    };
  }

  render() {
    return (
      <div>
        <Projects></Projects>
      </div>
    );
  }
}

export default App;

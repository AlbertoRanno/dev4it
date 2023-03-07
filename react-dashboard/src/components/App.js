import React, { Component } from "react";
import Projects from "./Projects";
import Users from "./Users";
//import { Link, Route, Switch } from "react-router-dom";

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
        <Users></Users>
      </div>
    );
  }
}

export default App;

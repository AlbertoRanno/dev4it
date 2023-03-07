import React, { Component } from "react";
import UsersTable from "./UsersTable";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  apiCall(url, consecuencia) {
    fetch(url, {
      "content-type": "application/json",
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((data) => consecuencia(data))
      .catch((error) => console.log(error));
  }

  mostrarData = (data) => {
    //console.log(data.data[0].name);
    console.log(data.data);
    this.setState({
      users: data.data,
    });
  };

  componentDidMount() {
    this.apiCall("http://localhost:3001/personal/infoReact", this.mostrarData);
  }
  componentDidUpdate() {}

  render() {
    let contenido;

    if (this.state.users === []) {
      contenido = <p> Cargando... </p>;
    } else {
      contenido = 
        <UsersTable usersList={this.state.users}></UsersTable>      
    }
    return <div>{contenido}</div>;
  }
}

export default Users;

import Saludo from "./Saludo";

function App() {
  return (
    <div className="">
      <Saludo nombre="Carlos" rango="Boina verde" apodos={["Groso"]} />
      <Saludo
        nombre="Mariano"
        rango="Soldado"
        apodos={["corneta", "zapallo", "cuerno"]}
      />
      <Saludo  />
    </div>
  );
}

export default App;

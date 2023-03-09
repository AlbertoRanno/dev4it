import Projects from "./Projects";
import Users from "./Users";
import NotFound from "./NotFound";
import DetailsProjectsTable from "./DetailsProjectsTable";
import Navbar from "./Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <main className="container-fluid">
      <Navbar/>

      <Routes>
        <Route path="/projects" element={<Projects />}></Route>
        <Route
          path="/details-projects/:projectId"
          element={<DetailsProjectsTable />}
        ></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </main>
  );
}

export default App;

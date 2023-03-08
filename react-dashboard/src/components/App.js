import Projects from "./Projects";
import Users from "./Users";
import NotFound from "./NotFound";
import ProjectDetail from "./ProjectDetail";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <main className="container-fluid">
      <Link to="/projects" exact="true">
        Projects
      </Link>
      <br></br>
      <Link to="/users" exact="true">
        Users
      </Link>
      <br></br>

      <Routes>
        <Route path="/projects" element={<Projects />}></Route>
        <Route path="/projectDetail/:id" element={<ProjectDetail />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
    </main>
  );
}

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import "./App.css";
import TableComponet from "./Componet/Table/TableComponet";
import TshirtLogoDesigner from "./Componet/TshirtLogo/TshirtLogo";

const App = () => {
  return (
    <Router>
      <div
        className="navbar-style"
        style={{ textAlign: "center", color: "white" }}
      >
        <NavLink to="/">Home</NavLink>
        <NavLink to="/tshirt-logo">Tshirt Logo</NavLink>
      </div>
      <Routes>
        <Route path="/" element={<TableComponet />} />
        <Route path="/tshirt-logo" element={<TshirtLogoDesigner />} />
      </Routes>
    </Router>
  );
};

export default App;

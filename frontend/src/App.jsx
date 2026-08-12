import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Navbar from "./components/Navbar";
import Transfers from "./pages/Transfers";
import Assignments from "./pages/Assignments";
import Expenditures from "./pages/Expenditures";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>

      {token && <Navbar />}

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Inventory */}
        <Route
          path="/inventory"
          element={
            token ? (
              <Inventory />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Purchases */}
        <Route
          path="/purchases"
          element={
            token ? (
              <Purchases />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
<Route
  path="/transfers"
  element={
    token ? (
      <Transfers />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
  path="/assignments"
  element={
    token ? (
      <Assignments />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
<Route
  path="/expenditures"
  element={
    token ? (
      <Expenditures />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
        {/* Any unknown URL */}
        <Route
          path="*"
          element={
            <Navigate
              to={token ? "/dashboard" : "/login"}
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        Military Asset Management
      </div>

      <div className="navbar-links">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/inventory">
          Inventory
        </Link>

        <Link to="/purchases">
          Purchases
        </Link>

        <Link to="/transfers">
          Transfers
        </Link>

        <Link to="/assignments">
          Assignments
        </Link>

        <Link to="/expenditures">
          Expenditures
        </Link>

        <span>
          {user?.username || "User"}
        </span>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
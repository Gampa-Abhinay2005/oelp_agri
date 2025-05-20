import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between bg-gray-800 p-4 text-white">
      <Link to="/" className="font-bold">Community</Link>
      <div>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="mx-2">Dashboard</Link>
            <button onClick={handleLogout} className="mx-2">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mx-2">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Nav = () => {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  if (!user) return null;

  const toggleLogout = () => setShowLogout(prev => !prev);

  return (
    <nav className="bg-white shadow fixed w-full top-0 z-10">
      <div className="container flex items-center justify-between pt-3 pb-1">

        <Link to="/" className="font-bold text-xl">
          <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div className="flex gap-1 items-center">
            <h1 className="font-bold text-lg">EventX</h1>
            <p className="text-xs text-gray-400">STUDIO</p>
          </div>
        </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="hover:underline">
            Events
          </Link>

          {user.role === "admin" ? (
            <Link to="/dashboard/insights" className="hover:underline">
              Admin
            </Link>
          ) : (
            <Link to="/mytickets" className="hover:underline">
              My Tickets
            </Link>
          )}

          {/* user dropdown with click */}
          <div className="relative ml-4">
            <div
              className="bg-black text-white px-3 py-1 rounded-lg text-sm font-medium cursor-pointer"
              onClick={toggleLogout}
            >
              {user.name}
            </div>

            {showLogout && (
              <div className="absolute right-0 mt-2 w-max bg-red-500 text-white rounded-lg shadow-lg">
                <button
                  onClick={ ()=> logout() }
                  className="px-4 py-2 text-sm hover:bg-red-400 w-full text-center"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

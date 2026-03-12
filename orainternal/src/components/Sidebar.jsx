// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Analytics Dashboard", path: "/dashboard" },
    { name: "User Management", path: "/users" },
    { name: "Case Oversight", path: "/cases" },
    { name: "STL Viewer Setup", path: "/stl-viewer" },
    { name: "Audit Logs", path: "/audit-logs" },
    { name: "Platform Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Portal</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link
          to="/"
          className="text-red-400 hover:text-red-300 px-4 py-2 block"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

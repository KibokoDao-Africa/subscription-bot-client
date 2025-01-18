// import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Radio, Package } from "lucide-react";
const navItems = [
  {
    icon: Radio,
    label: "Channels",
    path: "/channels",
  },
  {
    icon: Package,
    label: "Subscriptions",
    path: "/subscriptions",
  },
];
export const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-64 bg-[#17212b] text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">TG Sub Bot</h1>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm ${isActive ? "bg-[#2b5278]" : "text-gray-300 hover:bg-[#232e3c]"}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

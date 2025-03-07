import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>YAKAP Admin</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active-page" : "")}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/patients" className={({ isActive }) => (isActive ? "active-page" : "")}>
              Patient Profiles
            </NavLink>
          </li>
          <li>
            <NavLink to="/charts" className={({ isActive }) => (isActive ? "active-page" : "")}>
              Monitoring Charts
            </NavLink>
          </li>
          {/* Additional links can be added here */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
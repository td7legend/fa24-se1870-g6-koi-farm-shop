import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <h2>Staff Dashboard</h2>
      </div>
      <nav className="sidebar__nav">
        <ul>
          <li>
            <Link to="/staff-dashboard/order-management">Order Management</Link>
          </li>
          <li>
            <Link to="/staff-dashboard/fish-management">Fish Management</Link>
          </li>
          <li>
            <Link to="/staff-dashboard/fishtype-management">
              Fish Type Management
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;

import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Collapse from "bootstrap/js/dist/collapse";

const links = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/analytics", label: "Analytics" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const location = useLocation();

  useEffect(() => {
    const menu = document.getElementById("mainNav");

    if (menu?.classList.contains("show")) {
      Collapse.getOrCreateInstance(menu).hide();
    }
  }, [location.pathname]);

  return (
    <nav className="navbar navbar-expand-lg site-nav sticky-top">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-mark">
            <i className="bi bi-link-45deg" aria-hidden="true" />
          </span>
          ShortIt
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item ms-lg-2">
              <NavLink to="/" className="btn btn-accent">
                Shorten a link
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

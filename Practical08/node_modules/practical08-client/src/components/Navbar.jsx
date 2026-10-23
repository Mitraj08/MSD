import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/users", label: "Users" },
  { to: "/products", label: "Products" },
  { to: "/tester", label: "API Tester" },
  { to: "/logs", label: "Request Logs" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">Express<span>+</span>React</div>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

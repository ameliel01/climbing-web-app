import { NavLink } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
import './Navbar.css'; // le fichier CSS qu'on va créer

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">Climbing_App_Logo</div>

      {/* Menu */}
      <div className="nav-links">
        <NavLink
          to="/home"
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Accueil
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Message
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Mon Profil
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Rechercher
        </NavLink>
      </div>
    </nav>
  );
}

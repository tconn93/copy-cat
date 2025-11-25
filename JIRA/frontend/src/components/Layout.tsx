import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/projects">JIRA Clone</Link>
        </div>
        <div className="navbar-menu">
          <Link to="/projects" className="navbar-item">Projects</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/users" className="navbar-item">Users</Link>
          )}
        </div>
        <div className="navbar-end">
          {user && (
            <>
              <span className="navbar-user">{user.name}</span>
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

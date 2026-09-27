import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineLightningBolt } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <HiOutlineLightningBolt className="navbar-icon" />
        <span className="navbar-title">Second Brain</span>
      </div>
      {user && (
        <div className="navbar-user">
          <div className="navbar-avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <span className="navbar-name">{user.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Logout">
            <HiOutlineLogout size={18} />
          </button>
        </div>
      )}
    </nav>
  );
}

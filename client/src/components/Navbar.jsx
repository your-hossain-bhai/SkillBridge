import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SkillBridge
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition">Home</Link>
            {user && <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 transition">Dashboard</Link>}
            <Link to="/jobs" className="text-gray-700 hover:text-purple-600 transition">Jobs</Link>
            <Link to="/resources" className="text-gray-700 hover:text-purple-600 transition">Resources</Link>
            {user && <Link to="/profile" className="text-gray-700 hover:text-purple-600 transition">Profile</Link>}
            <Link to="/ai-lab" className="text-gray-700 hover:text-purple-600 transition">AI Lab</Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-purple-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-purple-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


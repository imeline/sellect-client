import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartIcon, HeartIcon, UserIcon, TicketIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext.jsx"; // 수정된 AuthContext 사용
import SearchBar from "./SearchBar.jsx";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Navbar() {
  const { isLoggedIn, role, logout, cartItemCount } = useAuth(); // cartItemCount 가져오기
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home', { replace: true });
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">SELLECT</span>
          </Link>

          {/* Search Bar */}
          {(role === "GUEST" || role === "USER") && (
            <SearchBar apiBaseUrl={VITE_API_BASE_URL} />
          )}

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {(role === "GUEST" || role === "USER") && (
              <Link to="/cart" className="relative hover:text-indigo-600 transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            {(role === "GUEST" || role === "USER") && (
              <Link to="/coupon" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                <TicketIcon className="h-6 w-6" />
                <span className="hidden md:inline">쿠폰 발급하기</span>
              </Link>
            )}
            {isLoggedIn ? (
              <>
                {role === "USER" && (
                  <Link to="/user/profile" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden md:inline">프로필</span>
                  </Link>
                )}
                {role === "SELLER" && (
                  <Link to="/seller" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden md:inline">셀러 홈</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                >
                  <span className="hidden md:inline">로그아웃</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                <UserIcon className="h-6 w-6" />
                <span className="hidden md:inline">로그인</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
import { Link } from "react-router-dom";
import { ShoppingCartIcon, HeartIcon, UserIcon } from "@heroicons/react/24/outline";
import useAuthStore from "../store/authStore";
import SearchBar from "./SearchBar.jsx";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // 환경 변수 불러오기

export default function Navbar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  return (
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">SELLECT</span>
            </Link>

            {/* Search Bar */}
            <SearchBar apiBaseUrl={VITE_API_BASE_URL} />

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link to="/cart" className="relative hover:text-indigo-600 transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                2
              </span>
              </Link>
              <Link to="/favorites" className="hover:text-indigo-600 transition-colors">
                <HeartIcon className="h-6 w-6" />
              </Link>
              {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                      <UserIcon className="h-6 w-6" />
                      <span className="hidden md:inline">프로필</span>
                    </Link>
                    <button onClick={logout} className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
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

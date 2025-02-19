import { Link } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">SELLECT</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-12">
            <div className="relative">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

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
            <Link to="/login" className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
              <UserIcon className="h-6 w-6" />
              <span className="hidden md:inline">로그인</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
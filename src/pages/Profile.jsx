import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const location = useLocation();
  const { isLoggedIn, role, user, logout } = useAuth();

  // 유저 정보 기본값 설정
  const displayName = user || 'Guest';
  const displayEmail = isLoggedIn || '로그인 후 이용 가능';
  const profileImage = user?.profileImage || 'https://via.placeholder.com/150';
  const tier = user?.tier || 'Bronze';

  return (
      <div className="min-h-screen bg-gray-100 flex">
        {/* 왼쪽 사이드바 */}
        <div className="w-64 bg-white shadow-md p-6 flex-shrink-0">
          <div className="flex flex-col items-center mb-8">
            <img
                src={profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-600">{displayEmail}</p>
            {isLoggedIn && (
                <span className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
              {tier} 회원
            </span>
            )}
          </div>

          <nav className="space-y-2">
            {isLoggedIn && role === 'USER' ? (
                <>
                  <Link
                      to="orders"
                      className={`block py-2 px-4 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                          location.pathname === '/user/profile/orders' ? 'bg-indigo-100 text-indigo-600' : ''
                      }`}
                  >
                    주문 내역
                  </Link>
                  <Link
                      to="payment-history" // 결제 내역 경로
                      className={`block py-2 px-4 rounded-md text-gray-700 font-semibold hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 border-l-4 ${
                          location.pathname === '/user/profile/payment-history'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-500'
                              : 'border-transparent'
                      }`}
                  >
                    결제 내역
                  </Link>
                  <Link
                      to="coupons"
                      className={`block py-2 px-4 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                          location.pathname === '/user/profile/coupons' ? 'bg-indigo-100 text-indigo-600' : ''
                      }`}
                  >
                    쿠폰 발급 내역
                  </Link>
                  <Link
                      to="settings"
                      className={`block py-2 px-4 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                          location.pathname === '/user/profile/settings' ? 'bg-indigo-100 text-indigo-600' : ''
                      }`}
                  >
                    계정 설정
                  </Link>
                  <button
                      onClick={logout}
                      className="block w-full py-2 px-4 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                  >
                    로그아웃
                  </button>
                </>
            ) : (
                <p className="text-gray-500 text-sm">로그인 후 이용 가능합니다.</p>
            )}
          </nav>
        </div>

        {/* 가운데 콘텐츠 */}
        <div className="flex-1 p-8">
          {isLoggedIn && role === 'USER' ? (
              <Outlet />
          ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
                <p className="text-gray-600">프로필 기능을 사용하려면 로그인하세요.</p>
                <Link
                    to="/login"
                    className="mt-6 inline-flex items-center px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  로그인 하러 가기
                </Link>
              </div>
          )}
        </div>
      </div>
  );
};

export default Profile;
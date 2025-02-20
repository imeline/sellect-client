import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation(); // 현재 경로 확인용

  // 가정된 유저 데이터 (API로 대체 가능)
  const user = {
    nickname: 'SellectUser',
    email: 'user@example.com',
    profileImage: 'https://via.placeholder.com/150',
    tier: 'Gold', // 이커머스 회원 등급 예시
  };

  return (
      <div className="min-h-screen bg-gray-100 flex">
        {/* 왼쪽 사이드바 */}
        <div className="w-64 bg-white shadow-md p-6 flex-shrink-0">
          <div className="flex flex-col items-center mb-8">
            <img
                src={user.profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900">{user.nickname}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
            {user.tier} 회원
          </span>
          </div>

          <nav className="space-y-2">
            <Link
                to="/profile/orders"
                className={`block py-2 px-4 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                    location.pathname === '/profile/orders' ? 'bg-indigo-100 text-indigo-600' : ''
                }`}
            >
              주문 내역
            </Link>
            <Link
                to="/profile/coupons"
                className={`block py-2 px-4 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                    location.pathname === '/profile/coupons' ? 'bg-indigo-100 text-indigo-600' : ''
                }`}
            >
              쿠폰 발급 내역
            </Link>
            {/* 추가 메뉴 */}

            <Link
                to="/profile/settings"
                className={`block py-2 px-4 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                    location.pathname === '/profile/settings' ? 'bg-indigo-100 text-indigo-600' : ''
                }`}
            >
              계정 설정
            </Link>
          </nav>
        </div>

        {/* 가운데 콘텐츠 */}
        <div className="flex-1 p-8">
          <Outlet /> {/* 라우팅에 따라 컴포넌트 렌더링 */}
        </div>
      </div>
  );
};

export default Profile;
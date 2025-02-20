import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center">
        {/* 히어로 섹션 */}
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* 제목 */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="block text-gray-900">SELLECT에 오신 것을</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              환영합니다
            </span>
            </h1>
            {/* 설명 */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              원하는 상품을 검색하여 최고의 쇼핑 경험을 시작하세요.
            </p>
            {/* 버튼 */}
            <div className="mt-10">
              <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                쇼핑 시작하기
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;
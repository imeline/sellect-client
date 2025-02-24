import React, { useState, useEffect } from 'react';


const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [page] = useState(0);
  const [size] = useState(5);
  const [isUsed, setIsUsed] = useState(null); // 기본값 null (전체)
  const [loading, setLoading] = useState(false);

  // API 호출 함수
  const fetchCoupons = async (isUsedFilter = null) => {
    setLoading(true);
    try {
      const url = `${VITE_API_BASE_URL}/api/v1/coupon?page=${page}&size=${size}${
          isUsedFilter !== null ? `&isUsed=${isUsedFilter}` : ''
      }`;
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('쿠폰 조회 실패');
      const data = await response.json();
      if (data.is_success) {
        setCoupons(data.result || []);
      } else {
        throw new Error(data.message || '쿠폰 조회 실패');
      }
    } catch (error) {
      console.error('쿠폰 가져오기 실패:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(isUsed);
  }, [isUsed]);

  // 필터 버튼 핸들러
  const handleFilterChange = (filter) => {
    setIsUsed(filter);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          {/* 제목 */}
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
            쿠폰 발급 내역
          </h2>

          {/* 필터 버튼 */}
          <div className="flex justify-center space-x-4">
            <button
                onClick={() => handleFilterChange(null)}
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                    isUsed === null
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
                }`}
            >
              전체
            </button>
            <button
                onClick={() => handleFilterChange(false)}
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                    isUsed === false
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
                }`}
            >
              미사용
            </button>
            <button
                onClick={() => handleFilterChange(true)}
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                    isUsed === true
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
                }`}
            >
              사용됨
            </button>
          </div>

          {/* 쿠폰 목록 */}
          {loading ? (
              <p className="text-center text-gray-600">로딩 중...</p>
          ) : coupons.length > 0 ? (
              <div className="space-y-6">
                {coupons.map((coupon) => (
                    <div
                        key={coupon.coupon_info.coupon_id}
                        className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center transition-all duration-300 hover:shadow-md"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {coupon.coupon_info.discount_cost}원 할인 쿠폰
                        </h3>
                        <p className="text-sm text-gray-600">
                          판매자: {coupon.coupon_info.seller_info.seller_nickname}
                        </p>
                        <p className="text-sm text-gray-500">
                          만료: {coupon.coupon_info.expiration_date}
                        </p>
                      </div>
                      <span
                          className={`px-4 py-1 rounded-full text-sm font-medium ${
                              coupon.is_used
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                          }`}
                      >
                  {coupon.is_used ? '사용됨' : '미사용'}
                </span>
                    </div>
                ))}
              </div>
          ) : (
              <div className="text-center space-y-6">
                <p className="text-lg text-gray-600">
                  현재 발급된 쿠폰이 없습니다.
                </p>
                <button
                    onClick={() => fetchCoupons(isUsed)}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  새로고침
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default Coupons;
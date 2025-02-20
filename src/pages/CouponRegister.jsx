// CouponRegisterPage.jsx
import React, { useState, useEffect } from 'react';

const CouponRegisterPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async (currentPage = 0) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/coupon/actives?page=${currentPage}&size=${size}`, {
        credentials: 'include', // 쿠키 인증 필요 시
      });
      if (!response.ok) throw new Error('쿠폰 조회 실패');
      const data = await response.json();

      if (data.is_success) {
        setCoupons(data.result.content); // content 배열 설정
        setTotalPages(data.result.total_pages); // 전체 페이지 수 설정
      } else {
        throw new Error(data.message || '쿠폰 조회 실패');
      }
    } catch (error) {
      console.error(error);
      alert('쿠폰 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(page);
  }, [page]);

  const handleRegisterCoupon = async (couponId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/coupon/${couponId}/register`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('쿠폰 발급 실패');
      const data = await response.json();
      if (data.is_success) {
        fetchCoupons(page); // 목록 갱신
        alert('쿠폰이 발급되었습니다!');
      } else {
        throw new Error(data.message || '쿠폰 발급 실패');
      }
    } catch (error) {
      console.error(error);
      alert('쿠폰 발급에 실패했습니다.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full space-y-8 bg-white p-6 rounded-xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              쿠폰 발급
            </h2>
            <p className="mt-2 text-sm text-gray-500">지금 바로 혜택을 받아보세요!</p>
          </div>

          {loading ? (
              <div className="text-center text-gray-600">로딩 중...</div>
          ) : (
              <div className="space-y-4">
                {coupons.map((coupon) => (
                    <div
                        key={coupon.coupon_info.seller_info.seller_id + coupon.coupon_info.expiration_date} // 고유 키 생성
                        className="group relative bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {coupon.coupon_info.discount_cost}원 할인 쿠폰
                        </h3>
                        <p className="text-sm text-gray-600">
                          판매자: <span className="font-medium text-indigo-600">{coupon.coupon_info.seller_info.seller_nickname}</span>
                        </p>
                        <p className="text-sm text-gray-500">만료: {coupon.coupon_info.expiration_date}</p>
                      </div>
                      <button
                          onClick={() => handleRegisterCoupon(coupon.coupon_info.seller_info.seller_id)} // seller_id를 couponId로 사용 가정
                          disabled={coupon.is_registered}
                          className={`relative py-2 px-5 rounded-md text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 ${
                              coupon.is_registered
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md'
                          }`}
                      >
                  <span className="relative z-10">
                    {coupon.is_registered ? '발급됨' : '발급하기'}
                  </span>
                      </button>
                    </div>
                ))}
              </div>
          )}

          {totalPages > 0 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  이전
                </button>
                <span className="text-sm font-medium text-gray-900 bg-indigo-100 px-3 py-1 rounded-full">
              {page + 1} / {totalPages}
            </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1}
                    className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  다음
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default CouponRegisterPage;
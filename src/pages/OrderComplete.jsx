import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount } = location.state || {};

  if (!orderId) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100/50 via-white/50 to-purple-100/50 pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="mb-6">
              <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              결제가 완료되었습니다
            </h1>

            <div className="space-y-4 mb-8">
              <p className="text-gray-600">
                주문번호: <span className="font-medium">{orderId}</span>
              </p>
              <p className="text-gray-600">
                결제금액: <span className="font-medium">{totalAmount?.toLocaleString()}원</span>
              </p>
            </div>

            <div className="space-y-4">
              <button
                  onClick={() => navigate('/orders')}
                  className="w-full py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                주문 내역 보기
              </button>

              <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default OrderComplete;
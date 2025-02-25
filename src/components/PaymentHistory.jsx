import React, { useState, useEffect } from 'react';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PaymentHistory = () => {
  console.log('VITE_API_BASE_URL:', VITE_API_BASE_URL);
  const [payments, setPayments] = useState([]); // 초기값 빈 배열
  const [page] = useState(0);
  const [size] = useState(5);
  const [loading, setLoading] = useState(false);

  // API 호출 함수
  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
          `${VITE_API_BASE_URL}/api/v1/payment/history?page=${page}&size=${size}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );
      if (!response.ok) {
        throw new Error('결제 내역 조회 실패');
      }
      const data = await response.json();
      console.log('Payment History Response:', data);
      const paymentData = data?.result || data || [];
      setPayments(paymentData); // 데이터가 있든 없든 그대로 설정
    } catch (err) {
      console.error('결제 내역 가져오기 실패:', err);
      setPayments([]); // 오류 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">결제 내역</h2>

        {loading ? (
            <p className="text-gray-600 text-center">로딩 중...</p>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">결제 ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">금액</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">주문 ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">결제 PID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">상태</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">결제일</th>
                </tr>
                </thead>
                <tbody>
                {payments.map((payment) => (
                    <tr
                        key={payment?.id || Math.random()}
                        className="border-t border-gray-200 hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 text-gray-700">{payment?.id || '-'}</td>
                      <td className="py-3 px-4 text-gray-700">{payment?.price ? `${payment.price} 원` : '-'}</td>
                      <td className="py-3 px-4 text-gray-700">{payment?.orderId || '-'}</td>
                      <td className="py-3 px-4 text-gray-700">{payment?.pid || '-'}</td>
                      <td className="py-3 px-4">
                    <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            payment?.status === 'DONE' || payment?.status === 'APPROVE'
                                ? 'bg-green-100 text-green-800'
                                : payment?.status === 'FAIL'
                                    ? 'bg-red-100 text-red-800'
                                    : payment?.status === 'CANCEL'
                                        ? 'bg-orange-100 text-orange-800'
                                        : payment?.status === 'READY'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {payment?.status || '알 수 없음'}
                    </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{payment?.createdAt || '-'}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
};

export default PaymentHistory;
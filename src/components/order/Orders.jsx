import React from 'react';

const Orders = () => {
  return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">주문 내역</h2>
        <p className="text-gray-600">최근 주문 내역이 여기에 표시됩니다.</p>
        {/* 주문 목록 API 연동 가능 */}
      </div>
  );
};

export default Orders;
import React from "react";

function PaymentSummary({ totalPrice, discount, finalPrice }) {
  return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">결제 금액 정보</h3>
        <div className="p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl shadow-inner border border-gray-200">
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>상품 금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span>쿠폰 할인</span>
            <span className="text-red-600">-{discount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-2">
            <span>총 결제 금액</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {finalPrice.toLocaleString()}원
          </span>
          </div>
        </div>
      </div>
  );
}

export default PaymentSummary;
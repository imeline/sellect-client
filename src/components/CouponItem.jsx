import React from "react";
import { FaTicketAlt } from "react-icons/fa"; // react-icons 라이브러리 사용 (설치 필요: npm install react-icons)

function CouponInfo({ coupon, applyCoupon }) {
  return (
      <div
          className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 cursor-pointer flex items-center justify-between"
          onClick={() => applyCoupon(coupon)} // 클릭 시 쿠폰 적용
      >
        {/* 왼쪽: 쿠폰 아이콘과 할인 금액 */}
        <div className="flex items-center space-x-3">
          <FaTicketAlt className="text-indigo-600 text-xl" />
          <div>
          <span className="text-xl font-bold text-indigo-600">
            {coupon.discount_cost.toLocaleString()}원
          </span>
            <p className="text-sm text-gray-500">할인 쿠폰</p>
          </div>
        </div>

        {/* 오른쪽: 만료일 */}
        <div className="text-right">
          <p className="text-xs text-gray-400">
            만료일: {coupon.expiration_date} {/* expiryDate → expiration_date */}
          </p>
        </div>
      </div>
  );
}

export default CouponInfo;
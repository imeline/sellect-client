function CouponInfo({ coupon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-xs border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-900">
          -{coupon.discount.toLocaleString()}원
        </span>
      </div>
      <div className="text-right mt-1 text-xs text-gray-400">
        만료일: {coupon.expiryDate}
      </div>
    </div>
  );
}

export default CouponInfo;

// src/components/OrderForm.js
import { useState } from "react";
import OrderItem from "../components/CartOrderItem";
import CouponItem from "../components/CouponItem";
import PaymentSummary from "../components/PaymentSummary";

function OrderForm() {
  const [coupon, setCoupon] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false);

  const items = [
    { id: 1, brand: "Nike", name: "Air Max 97", price: 199000, quantity: 2 },
    { id: 2, brand: "Adidas", name: "Superstar", price: 129000, quantity: 1 },
  ];

  const coupons = [
    { id: 1, name: "5% 할인 쿠폰", discount: 5000, expiryDate: "2025-02-28" },
    { id: 2, name: "10% 할인 쿠폰", discount: 10000, expiryDate: "2025-03-15" },
  ];

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = coupon ? coupon.discount : 0;
  const finalPrice = totalPrice - discount;

  const applyCoupon = (selectedCoupon) => {
    setCoupon(selectedCoupon);
    setShowCoupons(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">주문서</h2>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900">주문 상품</h3>
          <div className="mt-2 space-y-4">
            {items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <button
            className="w-full px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            onClick={() => setShowCoupons(true)}
          >
            쿠폰 사용
          </button>
        </div>
        {showCoupons && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-semibold mb-4">사용 가능한 쿠폰</h3>
              {coupons.map((coupon) => (
                <CouponItem
                  key={coupon.id}
                  coupon={coupon}
                  applyCoupon={applyCoupon}
                />
              ))}
              <button
                className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
                onClick={() => setShowCoupons(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
        <PaymentSummary
          totalPrice={totalPrice}
          discount={discount}
          finalPrice={finalPrice}
        />{" "}
        {/* PaymentSummary 추가 */}
        <div className="mt-6">
          <button className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition">
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;

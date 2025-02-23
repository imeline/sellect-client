import { useState } from "react";
import CartOrderItem from "../../components/CartOrderItem.jsx";
import CouponItem from "../../components/CouponItem.jsx";
import PaymentSummary from "../../components/order/PaymentSummary.jsx";

function OrderForm() {
  const [coupon, setCoupon] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false);

  const items = [
    {
      id: 1,
      brand: "Nike",
      product_name: "Air Max 97",
      product_price: 199000,
      quantity: 2,
      imageUrl: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      brand: "Adidas",
      product_name: "Superstar",
      product_price: 129000,
      quantity: 1,
      imageUrl: "https://via.placeholder.com/300",
    },
  ];

  const coupons = [
    { id: 1, name: "5% 할인 쿠폰", discount: 5000, expiryDate: "2025-02-28" },
    { id: 2, name: "10% 할인 쿠폰", discount: 10000, expiryDate: "2025-03-15" },
  ];

  const totalPrice = items.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );
  const discount = coupon ? coupon.discount : 0;
  const finalPrice = totalPrice - discount;

  const applyCoupon = (selectedCoupon) => {
    setCoupon(selectedCoupon);
    setShowCoupons(false);
  };

  return (
    <div className="pt-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {" "}
        {/* max-w-7xl -> max-w-3xl */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">주문서</h1>{" "}
        {/* text-3xl -> text-2xl */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t border-gray-200">
          {" "}
          {/* p-8 -> p-6 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            주문 상품
          </h3>{" "}
          {/* text-xl -> text-lg */}
          <div className="flex flex-col gap-4">
            {" "}
            {/* gap-6 -> gap-4 */}
            {items.map((item) => (
              <CartOrderItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            {" "}
            {/* mt-8 -> mt-6, 버튼 오른쪽 정렬 */}
            <button
              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
              onClick={() => setShowCoupons(true)}
            >
              쿠폰 사용
            </button>
          </div>
          {showCoupons && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              {" "}
              {/* absolute -> fixed, 투명도 조정 */}
              <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                {" "}
                {/* w-96 -> w-80, p-6 -> p-5 */}
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  사용 가능한 쿠폰
                </h3>
                {coupons.map((coupon) => (
                  <CouponItem
                    key={coupon.id}
                    coupon={coupon}
                    applyCoupon={applyCoupon}
                  />
                ))}
                <button
                  className="w-full mt-3 px-3 py-1.5 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800 transition"
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
          />
          <div className="mt-6">
            {" "}
            {/* text-center 제거, 버튼 너비 조정 */}
            <button className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-md text-base hover:bg-indigo-700 transition">
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;

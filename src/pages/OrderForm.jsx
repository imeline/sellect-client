import { useState } from "react";
import OrderItemsList from "../components/order/OrderItemsList"; // Import OrderItemsList
import CouponItem from "../components/CouponItem";
import PaymentSummary from "../components/order/PaymentSummary";

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
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">주문서</h1>
        <div className="bg-white p-8 rounded-lg shadow-md border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            주문 상품
          </h3>
          <OrderItemsList items={items} /> {/* OrderItemsList 사용 */}
          <div className="mt-8">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md text-base hover:bg-gray-300"
              onClick={() => setShowCoupons(true)}
            >
              쿠폰 사용
            </button>
          </div>
          {showCoupons && (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
          />
          <div className="mt-6 text-center">
            <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md text-lg hover:bg-indigo-700 transition">
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;

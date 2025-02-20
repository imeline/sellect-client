import { useState } from "react";
import CartOrderItem from "../components/CartOrderItem"; // OrderItem -> CartOrderItem로 변경
import CouponItem from "../components/CouponItem";
import PaymentSummary from "../components/PaymentSummary";

function OrderForm() {
  const [coupon, setCoupon] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false);

  const items = [
    {
      id: 1,
      brand: "Nike",
      product_name: "Air Max 97", // name -> product_name
      product_price: 199000, // price -> product_price
      quantity: 2,
      imageUrl: "https://via.placeholder.com/300", // imageUrl 추가
    },
    {
      id: 2,
      brand: "Adidas",
      product_name: "Superstar", // name -> product_name
      product_price: 129000, // price -> product_price
      quantity: 1,
      imageUrl: "https://via.placeholder.com/300", // imageUrl 추가
    },
  ];

  const coupons = [
    { id: 1, name: "5% 할인 쿠폰", discount: 5000, expiryDate: "2025-02-28" },
    { id: 2, name: "10% 할인 쿠폰", discount: 10000, expiryDate: "2025-03-15" },
  ];

  const totalPrice = items.reduce(
    (acc, item) => acc + item.product_price * item.quantity, // price -> product_price
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
              <CartOrderItem key={item.id} item={item} /> // OrderItem -> CartOrderItem로 변경
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
        />
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

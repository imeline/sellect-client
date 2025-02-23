import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderHeader from "../components/order/OrderHeader";
import CartOrderItem from "../components/CartOrderItem";
import {
  fetchOrderDetail,
  getAvailableCoupons,
  preparePayment,
} from "../services/OrderService";

function OrderForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError("주문 ID가 없습니다.");
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const result = await fetchOrderDetail(orderId);
      const transformedData = {
        order_id: orderId,
        created_at: new Date().toISOString(), // API에서 제공되면 수정
        order_items: result.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_price: item.product_price,
          brand: item.brand_name,
          quantity: item.quantity,
          imageUrl: item.image_url,
        })),
      };
      setOrderData(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    if (!orderData) return;
    try {
      const productIds = orderData.order_items.map((item) => item.product_id);
      const response = await getAvailableCoupons(productIds);
      setCoupons(response); // getAvailableCoupons가 result만 반환하도록 수정됨
    } catch (err) {
      console.error("쿠폰 조회 실패:", err);
    }
  };

  const applyCouponAndPreparePayment = async () => {
    if (!orderData) return;

    try {
      const totalAmount = calculateTotal();
      const totalQuantity = orderData.order_items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // 1. 쿠폰 적용 요청 (선택된 쿠폰이 있을 경우만)
      if (selectedCoupon) {
        await axios.post(
          `${API_BASE_URL}/order/${orderId}/applied-coupon/${selectedCoupon.coupon_id}`
        );
      }

      // 2. 결제 준비 요청
      const paymentData = {
        order_id: orderId,
        item_name: orderData.order_items[0].product_name,
        quantity: totalQuantity,
        total_amount: totalAmount,
      };

      const response = await preparePayment(paymentData);
      console.log("Payment prepared successfully:", response);
      // 결제 성공 후 리다이렉션 등 추가 처리 필요 시 여기에 구현
    } catch (err) {
      console.error("결제 처리 실패:", err);
      setError("결제 처리 중 오류가 발생했습니다.");
    }
  };

  const calculateTotal = () => {
    if (!orderData) return 0;
    const subtotal = orderData.order_items.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );
    return selectedCoupon ? subtotal - selectedCoupon.discount_cost : subtotal;
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!orderData) return null;

  return (
    <div className="pt-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">주문 내역</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="pb-0">
              <OrderHeader order={orderData} showDetailLink={true} />
            </div>
            <div className="border-b border-gray-200 mt-0 mb-4"></div>
            <div className="flex flex-col gap-4">
              {orderData.order_items.map((item) => (
                <CartOrderItem key={item.product_id} item={item} />
              ))}
            </div>

            {/* Coupon Section */}
            <div className="mt-6">
              <button
                onClick={fetchCoupons}
                className="text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded px-4 py-2"
              >
                쿠폰 사용
              </button>
              {coupons.length > 0 && (
                <div className="mt-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.coupon_id}
                      className={`p-2 cursor-pointer ${
                        selectedCoupon?.coupon_id === coupon.coupon_id
                          ? "bg-blue-100"
                          : ""
                      }`}
                      onClick={() => setSelectedCoupon(coupon)}
                    >
                      {coupon.discount_cost.toLocaleString()}원 할인 (만료:{" "}
                      {coupon.expiration_date})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Amount */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>총 결제 금액</span>
                <span>{calculateTotal().toLocaleString()}원</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={applyCouponAndPreparePayment}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;

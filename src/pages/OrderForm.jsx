import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import OrderHeader from "../components/order/OrderHeader";
import OrderItem from "../components/order/OrderItem";
import { fetchOrderDetail, getAvailableCoupons, preparePayment } from "../services/OrderService";

function OrderForm() {
  const { orderId: paramOrderId } = useParams(); // ✅ URL 파라미터에서 orderId 가져오기
  const location = useLocation(); // ✅ URL `state`에서 데이터 가져오기
  const navigate = useNavigate();

  // ✅ `useLocation`의 `state` 또는 `useParams`에서 `orderId` 가져오기
  const orderId = location.state?.orderId || Number(paramOrderId) || null;

  const [orderData, setOrderData] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("📌 현재 orderId:", orderId);
    if (!orderId) {
      setError("❌ 주문 ID가 없습니다.");
      setTimeout(() => navigate("/cart"), 2000);
      return;
    }
    fetchOrderDetails();
  }, [orderId]);

  // ✅ 주문 상세 정보 가져오기
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const result = await fetchOrderDetail(orderId);
      console.log("📌 주문 데이터:", result);

      if (Array.isArray(result)) {
        setOrderData(result);
      } else {
        setError("❌ 주문 데이터 형식이 올바르지 않습니다.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 사용 가능한 쿠폰 가져오기
  const fetchCoupons = async () => {
    if (!orderData.length) return;
    try {
      const productIds = orderData.map((item) => item.product_id);
      const response = await getAvailableCoupons(productIds);
      setCoupons(response);
    } catch (err) {
      console.error("쿠폰 조회 실패:", err);
    }
  };

  // ✅ 결제 요청
  const applyCouponAndPreparePayment = async () => {
    if (!orderData.length) return;

    try {
      const totalAmount = calculateTotal();
      const totalQuantity = orderData.reduce((sum, item) => sum + item.quantity, 0);

      if (selectedCoupon) {
        await axios.post(
            `${API_BASE_URL}/order/${orderId}/applied-coupon/${selectedCoupon.coupon_id}`
        );
      }

      const paymentData = {
        order_id: orderId,
        item_name: orderData[0].product_name,
        quantity: totalQuantity,
        total_amount: totalAmount,
      };

      const response = await preparePayment(paymentData);
      console.log("✅ 결제 준비 완료:", response);
    } catch (err) {
      console.error("❌ 결제 처리 실패:", err);
      setError("결제 처리 중 오류가 발생했습니다.");
    }
  };

  // ✅ 총 금액 계산
  const calculateTotal = () => {
    if (!orderData.length) return 0;
    const subtotal = orderData.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
    return selectedCoupon ? subtotal - selectedCoupon.discount_cost : subtotal;
  };

  if (loading) return <div>⌛ 로딩 중...</div>;
  if (error) return <div>❌ 에러: {error}</div>;
  if (!orderData.length) return <div>❌ 주문 데이터를 찾을 수 없습니다.</div>;

  return (
      <div className="pt-12 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 주문 페이지</h2>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <OrderHeader order={{ order_id: orderId }} showDetailLink={true} />
            <div className="border-b border-gray-200 mt-4 mb-4"></div>
            <div className="flex flex-col gap-4">
              {orderData.map((item) => (
                  <OrderItem key={item.product_id} item={item} />
              ))}
            </div>

            {/* 쿠폰 사용 */}
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
                                selectedCoupon?.coupon_id === coupon.coupon_id ? "bg-blue-100" : ""
                            }`}
                            onClick={() => setSelectedCoupon(coupon)}
                        >
                          {coupon.discount_cost.toLocaleString()}원 할인 (만료: {coupon.expiration_date})
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* 총 금액 */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>총 결제 금액</span>
                <span>{calculateTotal().toLocaleString()}원</span>
              </div>
            </div>

            {/* 결제 버튼 */}
            <button
                onClick={applyCouponAndPreparePayment}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
  );
}

export default OrderForm;

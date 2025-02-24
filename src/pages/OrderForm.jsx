import React, {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom"; // ✅ `useLocation` 추가
import OrderHeader from "../components/order/OrderHeader";
import OrderItem from "../components/order/OrderItem";
import {
  fetchOrderDetail,
  getAvailableCoupons,
  preparePayment,
} from "../services/OrderService";

function OrderForm() {
  const location = useLocation(); // ✅ URL `state`에서 데이터 가져오기
  const navigate = useNavigate();

  const orderId = location.state.orderId;

  const [orderData, setOrderData] = useState(null);
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

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const result = await fetchOrderDetail(orderId);
      console.log("📌 주문 데이터:", result);
      setOrderData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>⌛ 로딩 중...</div>;
  }
  if (error) {
    return <div>❌ 에러: {error}</div>;
  }
  if (!orderData) {
    return null;
  }

  return (
      <div className="pt-12 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 주문 내역</h2>
          <div
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <OrderHeader order={orderData} showDetailLink={true}/>
            <div className="border-b border-gray-200 mt-4 mb-4"></div>
            <div className="flex flex-col gap-4">
              {orderData.order_items.map((item) => (
                  <OrderItem key={item.product_id} item={item}/>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default OrderForm;

import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import OrderHeader from "../../components/order/OrderHeader.jsx";
import PaymentSummary from "../../components/order/PaymentSummary.jsx";
import OrderItem from "../../components/order/OrderItem.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ 환경 변수 사용

function OrderDetail() {
  const {orderId} = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
            `${API_BASE_URL}/api/v1/orders/${orderId}`, {
              withCredentials: true, // ✅ 쿠키 포함하여 인증 요청
            });

        if (response.data.is_success && response.data.result) {
          setOrder({
            ...response.data.result,
            order_items: response.data.result.order_items || [], // ✅ `order_items`이 없으면 빈 배열 설정
          });
        } else {
          throw new Error(response.data.message || "❌ 주문 정보를 가져오는 데 실패했습니다.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "❌ 주문 정보를 불러오는 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return <div className="text-center py-12">📦 주문 정보를 불러오는
      중...</div>;
  }
  if (error) {
    console.log("OrderDetail - error:", error);
    return <div
        className="text-center py-12 text-red-500">❌ {error}</div>;
  }
  if (!order) {
    return <div className="text-center py-12">❌ 주문 정보를 찾을 수
      없습니다.</div>;
  }

  const totalPrice = order.total_price;
  const discount = order.discount_cost;
  const finalPrice = totalPrice - discount;

  return (
      <div className="pt-12 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">📦 주문 상세</h1>
          <div
              className="bg-white p-6 rounded-lg shadow-md border-t border-gray-200">
            <OrderHeader order={order} orderNumber={order.order_number}/>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🛍 주문
                상품</h3>
              <div className="flex flex-col gap-4">
                {order.order_items?.map((item) => ( // ✅ `?.` 연산자 사용하여 안전하게 접근
                    <OrderItem key={item.product_id} item={item}/>
                ))}
              </div>
            </div>
            <PaymentSummary totalPrice={totalPrice} discount={discount}
                            finalPrice={finalPrice}/>
          </div>
        </div>
      </div>
  );
}

export default OrderDetail;

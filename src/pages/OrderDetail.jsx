import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import OrderHeader from "../components/order/OrderHeader.jsx";
import PaymentSummary from "../components/order/PaymentSummary.jsx";
import OrderItem from "../components/order/OrderItem.jsx";

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/orders/${orderId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            `주문 상세 정보 불러오기 실패! 상태 코드: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.is_success && data.result) {
          setOrder(data.result);
        } else {
          throw new Error(
            data.message || "주문 정보를 가져오는 데 실패했습니다."
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) return <div className="text-center py-12">로딩 중...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!order)
    return (
      <div className="text-center py-12">주문 정보를 찾을 수 없습니다.</div>
    );

  const totalPrice = order.total_price;
  const discount = order.discount_cost;
  const finalPrice = totalPrice - discount;

  return (
    <div className="pt-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">주문 상세</h1>
        <div className="bg-white p-6 rounded-lg shadow-md border-t border-gray-200">
          <OrderHeader order={order} orderNumber={order.order_number} />
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              주문 상품
            </h3>
            <div className="flex flex-col gap-4">
              {order.order_items.map((item) => (
                <OrderItem key={item.product_id} item={item} />
              ))}
            </div>
          </div>
          <PaymentSummary
            totalPrice={totalPrice}
            discount={discount}
            finalPrice={finalPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;

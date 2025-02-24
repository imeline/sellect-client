import { useEffect, useState } from "react";
import OrderHeader from "../components/order/OrderHeader.jsx";
import OrderItem from "../components/order/OrderItem.jsx";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/orders", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`주문 리스트 HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.is_success && Array.isArray(data.result)) {
          setOrders(data.result);
        } else {
          throw new Error(
            data.message || "주문 리스트 데이터를 불러오는 데 실패했습니다."
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error}</div>;

  return (
    <div className="pt-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">주문 내역</h2>
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              <div className="pb-0">
                <OrderHeader order={order} showDetailLink={true} />
              </div>
              <div className="border-b border-gray-200 mt-0 mb-4"></div>
              <div className="flex flex-col gap-4">
                {order.order_items.map((item) => (
                  <OrderItem key={item.product_id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderList;

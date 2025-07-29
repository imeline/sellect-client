import { useEffect, useState } from "react";
import OrderHeader from "../../components/order/OrderHeader.jsx";
import OrderItem from "../../components/order/OrderItem.jsx";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${VITE_API_BASE_URL}/api/v1/orders`, {
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
          setOrders([]);
        }
      } catch (err) {
        console.error("주문 리스트 가져오기 실패:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
      <div className="pt-12 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
            주문 내역
          </h2>

          {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
                <span className="ml-4 text-lg text-gray-600">로딩 중...</span>
              </div>
          ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-indigo-50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                        주문 정보
                      </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr
                                key={order.order_id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="p-6">
                                <OrderHeader order={order} showDetailLink={true} />
                                <div className="flex flex-col gap-4 mt-4">
                                  {order.order_items.map((item) => (
                                      <OrderItem key={item.product_id} item={item} />
                                  ))}
                                </div>
                              </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                          <td className="py-12 px-6 text-center text-gray-500">
                            <div className="flex flex-col items-center gap-4">
                              <svg
                                  className="w-16 h-16 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h18v18H3V3zm4 4h10v10H7V7z"
                                ></path>
                              </svg>
                              <p className="text-lg font-medium">
                                아직 주문 내역이 없습니다.
                              </p>
                              <p className="text-sm text-gray-400">
                                주문을 시작해보세요!
                              </p>
                            </div>
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

export default OrderList;
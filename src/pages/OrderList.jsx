import { Link } from "react-router-dom";
import CartOrderItem from "../components/CartOrderItem";

function OrderList() {
  const orders = [
    {
      order_id: 1,
      created_at: "2025-02-18T13:09:34.011366",
      order_items: [
        {
          product_id: 1,
          product_name: "Product 1",
          product_price: 29000,
          brand: "Brand A",
          quantity: 1,
          imageUrl: "https://via.placeholder.com/300",
        },
        {
          product_id: 2,
          product_name: "Product 2",
          product_price: 39000,
          brand: "Brand B",
          quantity: 2,
          imageUrl: "https://via.placeholder.com/300",
        },
      ],
    },
    {
      order_id: 2,
      created_at: "2025-02-19T13:27:28.330287",
      order_items: [
        {
          product_id: 3,
          product_name: "Product 3",
          product_price: 49000,
          brand: "Brand C",
          quantity: 1,
          imageUrl: "https://via.placeholder.com/300",
        },
      ],
    },
  ];

  function OrderDate({ order }) {
    const orderDate = new Date(order.created_at);
    const formattedDate = `${orderDate.getFullYear()}. ${
      orderDate.getMonth() + 1
    }. ${orderDate.getDate()}`;

    return (
      <div className="flex justify-between items-center pb-2">
        <div>
          <p className="text-lg font-bold text-gray-900">
            {formattedDate} 주문
          </p>
        </div>
        <div>
          <Link
            to={`/order/${order.order_id}`}
            className="text-sm text-blue-600 hover:text-blue-800 rounded px-4 py-2 border border-blue-600 hover:border-blue-800"
          >
            주문 상세 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">주문 내역</h2>{" "}
        {/* mb-8 -> mb-4로 변경 */}
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.order_id} className="border-t border-gray-200 pt-4">
              <OrderDate order={order} />
              <div className="border-b border-gray-200 mb-2"></div>{" "}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {order.order_items.map((item) => (
                  <CartOrderItem key={item.product_id} item={item} />
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

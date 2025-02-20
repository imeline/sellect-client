import OrderHeader from "../components/OrderHeader";
import OrderItemsList from "../components/OrderItemsList";

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

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">주문 내역</h2>
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-lg shadow-md border border-gray-200 pt-4 p-6"
            >
              {/* 주문 날짜 아래 여백 완전히 제거 */}
              <div className="pb-0">
                <OrderHeader order={order} showDetailLink={true} />
              </div>
              {/* border 아래 위쪽 여백 제거, 아래쪽 여백 유지 */}
              <div className="border-b border-gray-200 mt-0 mb-4"></div>
              <OrderItemsList items={order.order_items} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderList;

import OrderHeader from "../../components/order/OrderHeader.jsx";
import OrderItemsList from "../../components/order/OrderItemsList.jsx";
import CartOrderItem from "../../components/cart/CartOrderItem.jsx";

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
    <div className="pt-12 bg-gray-50 min-h-screen">
      {" "}
      {/* pt-16 -> pt-12 */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {" "}
        {/* max-w-7xl -> max-w-3xl, py-12 -> py-8 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          주문 내역
        </h2>{" "}
        {/* mb-6 -> mb-4 */}
        <div className="space-y-6">
          {" "}
          {/* space-y-8 -> space-y-6 */}
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
                {" "}
                {/* OrderItemsList 대신 직접 스타일 적용 */}
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

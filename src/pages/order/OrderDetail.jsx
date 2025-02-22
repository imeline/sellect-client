import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import OrderHeader from "../../components/order/OrderHeader.jsx";
import OrderItemsList from "../../components/order/OrderItemsList.jsx";
import PaymentSummary from "../../components/order/PaymentSummary.jsx";
import CartOrderItem from "../../components/cart/CartOrderItem.jsx";

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tempOrder = {
      order_number: "8100097225976",
      discount_cost: 0,
      total_price: 15980,
      order_items: [
        {
          product_id: 1,
          product_name: "무항생제 신선한 대란, 30구, 1개",
          product_price: 7990,
          product_url: "https://via.placeholder.com/300",
          brand_name: "브랜드",
          quantity: 1,
        },
        {
          product_id: 2,
          product_name: "무항생제 신선한 대란, 20구, 1개",
          product_price: 7990,
          product_url: "https://via.placeholder.com/300",
          brand_name: "브랜드",
          quantity: 1,
        },
      ],
      created_at: "2025-02-18T13:09:34.011366",
    };
    setOrder(tempOrder);
  }, []);

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

  const orderItemsWithImage = order.order_items.map((item) => ({
    ...item,
    imageUrl: item.product_url || "https://via.placeholder.com/300",
    brand: item.brand_name,
  }));

  return (
    <div className="pt-12 bg-gray-50 min-h-screen">
      {" "}
      {/* pt-16 -> pt-12 */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {" "}
        {/* max-w-7xl -> max-w-3xl, py-12 -> py-8 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          주문 상세
        </h1>{" "}
        {/* mb-4 유지 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t border-gray-200">
          {" "}
          {/* p-6, pt 제거 */}
          <OrderHeader order={order} orderNumber={order.order_number} />
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              주문 상품
            </h3>{" "}
            {/* mb-2 -> mb-3 */}
            <div className="flex flex-col gap-4">
              {" "}
              {/* OrderItemsList 대신 직접 스타일 적용 */}
              {orderItemsWithImage.map((item) => (
                <CartOrderItem key={item.product_id} item={item} />
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

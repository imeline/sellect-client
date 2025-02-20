import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import OrderHeader from "../components/order/OrderHeader";
import OrderItemsList from "../components/order/OrderItemsList";
import PaymentSummary from "../components/order/PaymentSummary";

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
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">주문 상세</h1>
        <div className="bg-white p-6 rounded-lg shadow-md border-t border-gray-200 pt-6">
          {" "}
          {/* 위쪽 여백 2배로: pt-4 -> pt-8 */}
          <OrderHeader order={order} orderNumber={order.order_number} />
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              주문 상품
            </h3>
            <OrderItemsList items={orderItemsWithImage} />
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

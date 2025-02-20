import { Link } from "react-router-dom";

function OrderHeader({ order, showDetailLink = false, orderNumber }) {
  const orderDate = new Date(order.created_at);
  const formattedDate = `${orderDate.getFullYear()}. ${
    orderDate.getMonth() + 1
  }. ${orderDate.getDate()}`;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4">
      <p className="text-lg font-bold text-gray-900">{formattedDate} 주문</p>
      {showDetailLink ? (
        <Link
          to={`/order/${order.order_id}`}
          className="text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded px-4 py-2 mt-2 sm:mt-0"
        >
          주문 상세 보기
        </Link>
      ) : (
        orderNumber && (
          <p className="text-sm text-gray-500 mt-1 sm:mt-0">
            주문번호 {orderNumber}
          </p>
        )
      )}
    </div>
  );
}

export default OrderHeader;

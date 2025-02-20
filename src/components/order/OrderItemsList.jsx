import CartOrderItem from "../CartOrderItem";

function OrderItemsList({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {items.map((item) => (
        <CartOrderItem key={item.product_id} item={item} />
      ))}
    </div>
  );
}

export default OrderItemsList;

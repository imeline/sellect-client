function OrderItem({ item }) {
  return (
      <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 border">
        <div className="flex items-center flex-1">
          <img
              src={item.image_url}
              alt={item.product_name}
              className="w-16 h-16 object-cover rounded-md mr-6"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.brand_name}</p>
            <p className="text-sm text-gray-700">{item.product_name}</p>
            <p className="text-sm text-gray-400">{item.quantity}개</p>
          </div>
        </div>
        <div className="text-right">
        <span className="text-sm text-gray-900 font-semibold">
          {(item.product_price * item.quantity).toLocaleString()}원
        </span>
        </div>
      </div>
  );
}

export default OrderItem;

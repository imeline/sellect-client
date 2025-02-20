function CartOrderItem({ item }) {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div className="flex items-center flex-1">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md mr-6" // 이미지 크기 및 스타일 설정
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{item.brand}</p>
          <p className="text-sm text-gray-700">{item.name}</p>
          <p className="text-sm text-gray-400">{item.quantity}개</p>{" "}
          {/* Quantity moved above the price */}
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm text-gray-900">
          {(item.price * item.quantity).toLocaleString()}원
        </span>
      </div>
    </div>
  );
}

export default CartOrderItem;

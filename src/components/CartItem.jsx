import { TrashIcon } from "@heroicons/react/24/outline"; // ✅ 삭제 아이콘 추가

function CartItem({ item, changeQuantity, removeItem }) {
  console.log("CartItem props - item:", item); // 디버깅용: item 객체 확인

  const isQuantityOne = item.quantity === 1; // ✅ 수량이 1인지 체크

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

            {/* 수량 조절 버튼 */}
            <div className="flex items-center gap-2 mt-2">
              <button
                  onClick={() => !isQuantityOne && changeQuantity(item.cart_item_id, -1)} // ✅ -1 전달
                  className={`px-3 py-1 rounded-md transition ${
                      isQuantityOne ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  disabled={isQuantityOne} // ✅ 1일 때 버튼 비활성화
              >
                -
              </button>
              <span className="text-sm text-gray-900 font-semibold">{item.quantity} 개</span>
              <button
                  onClick={() => changeQuantity(item.cart_item_id, 1)} // ✅ +1 전달
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 가격 정보 & 삭제 버튼 */}
        <div className="flex flex-col items-end">
        <span className="text-sm text-gray-900 font-semibold mb-2">
          {(item.product_price * item.quantity).toLocaleString()}원
        </span>
          {/* 🗑 삭제 버튼 */}
          <button
              onClick={() => removeItem(item.cart_item_id)} // ✅ 삭제 요청
              className="text-red-500 hover:text-red-700 transition"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
  );
}

export default CartItem;

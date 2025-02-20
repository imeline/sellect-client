import {useNavigate} from "react-router-dom";

export default function ProductItem({ product }) {
  const navigate = useNavigate();

  const addToCart = () => {
    // 장바구니 추가 로직
  };

  const goToProductDetail = () => {
    navigate(`${product.product_id}`);
  };

  const truncateProductName = (name, maxLength) => {
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + "...";
    }
    return name;
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg text-center cursor-pointer"
      onClick={goToProductDetail}
    >
      <div className="relative w-full aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain rounded-md"
        />
      </div>
      <h2 className="mt-2 text-lg font-semibold text-gray-900 truncate">
        {truncateProductName(product.name, 20)}
      </h2>
      <p className="text-gray-500">${product.price.toLocaleString()}</p>
      <div className="flex justify-center mt-2 text-yellow-500">
        {"★".repeat(Math.floor(product.rating || 0))}
        {"☆".repeat(5 - Math.floor(product.rating || 0))}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart();
        }}
        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
      >
        장바구니 추가
      </button>
    </div>
  );
}
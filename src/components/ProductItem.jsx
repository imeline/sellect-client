import { useState } from "react";

export default function ProductItem({ product }) {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const addToCart = () => {
    // 장바구니 추가 로직
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
      <img
        src={uploadedImage || product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="mt-2 text-lg font-semibold text-gray-900">{product.name}</h2>
      <p className="text-gray-500">₩{product.price.toLocaleString()}</p>
      <p className="text-gray-600 text-sm mt-2">{product.description}</p>
      <div className="flex justify-center mt-2 text-yellow-500">
        {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
      </div>
      <button
        onClick={addToCart}
        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
      >
        장바구니 추가
      </button>
    </div>
  );
}
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  // 샘플 데이터 (API 대신 사용)
  const sampleProducts = [
    {
      id: 1,
      name: "프리미엄 가죽 지갑",
      price: 45000,
      stock: 20,
      image: "https://via.placeholder.com/300?text=Wallet",
    },
    {
      id: 2,
      name: "무선 블루투스 이어폰",
      price: 79000,
      stock: 15,
      image: "https://via.placeholder.com/300?text=Earphones",
    },
    {
      id: 3,
      name: "친환경 대나무 칫솔 세트",
      price: 12000,
      stock: 50,
      image: "https://via.placeholder.com/300?text=Toothbrush",
    },
    {
      id: 4,
      name: "스테인리스 텀블러",
      price: 25000,
      stock: 30,
      image: "https://via.placeholder.com/300?text=Tumbler",
    },
    {
      id: 5,
      name: "유기농 면 티셔츠",
      price: 29000,
      stock: 10,
      image: "https://via.placeholder.com/300?text=T-shirt",
    },
  ];

  // 아래는 API 연동 예시 (현재는 주석 처리)
  /*
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/seller/products", {
          withCredentials: true,
        });
        setProducts(response.data.result || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching seller products:", err);
        setError("상품 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };
    fetchSellerProducts();
  }, []);
  */

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            판매자 <span className="text-indigo-600">대시보드</span>
          </h1>
          <p className="mt-2 text-lg text-gray-500">등록된 상품을 한눈에 확인하세요.</p>
        </div>

        {/* Products Section */}
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">등록 상품 목록</h2>
            <Link
              to="/products/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              새 상품 등록
            </Link>
          </div>

          {/* 샘플 데이터로 상품 목록 렌더링 */}
          {sampleProducts.length === 0 ? (
            <div className="text-center text-gray-500">등록된 상품이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                >
                  <div className="w-full h-48 bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">가격: ₩{product.price.toLocaleString()}</p>
                    <p className="mt-1 text-sm text-gray-500">재고: {product.stock}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        to={`/seller/products/${product.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        상세 보기
                      </Link>
                      <Link
                        to={`/seller/products/${product.id}/edit`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        수정
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API 사용 시 로딩/에러 처리 (현재 주석 처리) */}
          {/*
          {loading ? (
            <div className="text-center text-gray-500">상품 목록을 불러오는 중입니다...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500">등록된 상품이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                // 동일한 카드 렌더링
              ))}
            </div>
          )}
          */}
        </div>
      </div>
    </div>
  );
}
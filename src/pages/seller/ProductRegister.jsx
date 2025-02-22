import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductImageUploader from "../../components/product/ProductImageUploader.jsx";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductRegister() {
  const navigate = useNavigate();

  // 카테고리 및 브랜드 데이터를 저장할 상태
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    largeCategoryId: "",
    mediumCategoryId: "",
    categoryId: "",
    brandId: "",
    price: "",
    name: "",
    description: "",
    stock: "",
    images: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let response = await axios.get(`${VITE_API_BASE_URL}/api/v1/categories`);
        setCategories(response.data.result);

        response = await axios.get(`${VITE_API_BASE_URL}/api/v1/brands`);
        setBrands(response.data.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 재고 필드에 음수 값 방지
    if (name === "stock") {
      const parsedValue = parseInt(value, 10);
      if (value === "" || (parsedValue >= 0 && !isNaN(parsedValue))) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "largeCategoryId" && { mediumCategoryId: "", categoryId: "" }), // 대분류 변경 시 중/소분류 초기화
      ...(name === "mediumCategoryId" && { categoryId: "" }), // 중분류 변경 시 소분류 초기화
    }));
  };

  // 이미지 변경 핸들러
  const handleImagesChange = (images) => {
    setFormData(prev => ({
      ...prev,
      images: images,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.categoryId) newErrors.categoryId = "소분류 카테고리를 선택해주세요.";
    if (!formData.brandId) newErrors.brandId = "브랜드를 선택해주세요.";
    if (!formData.price) newErrors.price = "가격은 필수 입력값입니다.";
    else if (!/^[0-9]+$/.test(formData.price)) newErrors.price = "가격은 정수만 입력 가능합니다.";
    else if (parseInt(formData.price) <= 0) newErrors.price = "가격은 1원 이상이어야 합니다.";
    if (!formData.name) newErrors.name = "상품명은 필수 입력값입니다.";
    else if (formData.name.length < 10) newErrors.name = "상품명은 최소 10글자 이상이어야 합니다.";
    if (!formData.stock) newErrors.stock = "재고(stock)는 필수 입력값입니다.";
    else if (parseInt(formData.stock) < 1) newErrors.stock = "재고(stock)는 1 이상이어야 합니다.";
    if (formData.images.length === 0)
      newErrors.images = "이미지를 최소 1개 이상 업로드해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // FormData 객체 구성
    const formDataToSend = new FormData();

    // ProductRegisterRequest 객체 구성
    const registerRequest = {
      category_id: formData.categoryId,
      brand_id: formData.brandId,
      price: formData.price,
      name: formData.name,
      description: formData.description,
      stock: formData.stock,
      image_contexts: formData.images.map((image, index) => ({
        target: uuidv4(), // 고유 ID 생성
        prev: index === 0 ? null : formData.images[index - 1].target,
        next: index === formData.images.length - 1 ? null : uuidv4(),
        is_representative: index === 0, // 첫 번째 이미지를 대표 이미지로 설정
      })),
    };

    formDataToSend.append("register_request",
      new Blob([JSON.stringify(registerRequest)], { type: "application/json" }));

    // 이미지 파일 추가
    formData.images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/api/v1/product`,
        formDataToSend, {
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate("/seller/dashboard");
      } else {
        console.error("상품 등록 실패");
      }
    } catch (error) {
      console.error("상품 등록 중 오류:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-50 py-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="text-indigo-600">SELLECT Seller</span> 상품 등록
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
              새로운 상품을 등록하여 판매를 시작하세요.
            </p>
          </div>

          {/* Main Content - Hero Section 아래 좌우 분할 */}
          <div className="flex mt-12">
            {/* Left: 상품 정보 입력 (상대적 위치) */}
            <div className="w-1/2 pr-6">
              <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">상품 정보 입력</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 카테고리 선택 */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="largeCategoryId" className="block text-sm font-medium text-gray-700">
                        대분류
                      </label>
                      <select
                        name="largeCategoryId"
                        id="largeCategoryId"
                        value={formData.largeCategoryId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                      >
                        <option value="">선택</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="mediumCategoryId" className="block text-sm font-medium text-gray-700">
                        중분류
                      </label>
                      <select
                        name="mediumCategoryId"
                        id="mediumCategoryId"
                        value={formData.mediumCategoryId}
                        onChange={handleChange}
                        disabled={!formData.largeCategoryId}
                        className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                      >
                        <option value="">선택</option>
                        {formData.largeCategoryId &&
                          categories
                            .find((cat) => cat.id === Number(formData.largeCategoryId))
                            ?.children.map((child) => (
                            <option key={child.id} value={child.id}>
                              {child.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                        소분류
                      </label>
                      <select
                        name="categoryId"
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        disabled={!formData.mediumCategoryId}
                        className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                      >
                        <option value="">선택</option>
                        {formData.mediumCategoryId &&
                          categories
                            .find((cat) => cat.id === Number(formData.largeCategoryId))
                            ?.children.find((child) => child.id === Number(formData.mediumCategoryId))
                            ?.children.map((subChild) => (
                            <option key={subChild.id} value={subChild.id}>
                              {subChild.name}
                            </option>
                          ))}
                      </select>
                      {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                    </div>
                  </div>

                  {/* 브랜드 선택 */}
                  <div>
                    <label htmlFor="brandId" className="block text-sm font-medium text-gray-700">
                      브랜드
                    </label>
                    <select
                      name="brandId"
                      id="brandId"
                      value={formData.brandId}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    >
                      <option value="">선택</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    {errors.brandId && <p className="mt-1 text-sm text-red-600">{errors.brandId}</p>}
                  </div>

                  {/* 가격 */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      가격 (원)
                    </label>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  {/* 상품명 */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      상품명
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* 설명 */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      상품 설명
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                  </div>

                  {/* 재고 */}
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                      재고
                    </label>
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0" // 음수 입력 방지
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                  </div>

                  {/* 제출 버튼 */}
                  <div className="flex justify-end gap-4">
                    <Link
                      to="/seller/products"
                      className="inline-flex items-center px-6 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition duration-150 ease-in-out"
                    >
                      취소
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition duration-150 ease-in-out"
                    >
                      상품 등록
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: 이미지 업로드 (스크롤 가능) */}
            <div className="w-1/2 pl-6">
              <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 h-[calc(100vh-20rem)] overflow-y-auto">
                <ProductImageUploader onImagesChange={handleImagesChange} />
                {errors.images && (
                  <p className="mt-2 text-sm text-red-600">{errors.images}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductRegister;
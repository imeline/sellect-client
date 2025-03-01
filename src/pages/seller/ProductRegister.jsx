import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductImageUploader from "../../components/product/ProductImageUploader.jsx";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useApiService from "../../services/ApiService";
import { useAuth } from "../../context/AuthContext";
import * as tus from "tus-js-client";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductRegister() {
  const navigate = useNavigate();
  const { get, post } = useApiService();
  const { accessToken } = useAuth();

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
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        let response = await get("/api/v1/categories");
        setCategories(response.data.result);

        response = await get("/api/v1/brands");
        setBrands(response.data.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoriesAndBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

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
      ...(name === "largeCategoryId" && { mediumCategoryId: "", categoryId: "" }),
      ...(name === "mediumCategoryId" && { categoryId: "" }),
    }));
  };

  const handleImagesChange = (newImages) => {
    console.log("handleImagesChange:", newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
    const newPreviewImages = newImages.map((file, index) => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
      file,
      sequence: index + 1,
    }));
    setPreviewImages(newPreviewImages);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newPreviewImages = [...previewImages];
    const [reorderedImage] = newPreviewImages.splice(result.source.index, 1);
    newPreviewImages.splice(result.destination.index, 0, reorderedImage);

    newPreviewImages.forEach((img, index) => {
      img.sequence = index + 1;
    });

    setPreviewImages(newPreviewImages);
    setFormData((prev) => ({
      ...prev,
      images: newPreviewImages.map((img) => img.file),
    }));
  };

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
    if (!formData.stock) newErrors.stock = "재고는 필수 입력값입니다.";
    else if (parseInt(formData.stock) < 1) newErrors.stock = "재고는 1 이상이어야 합니다.";
    if (formData.images.length === 0) newErrors.images = "이미지를 최소 1개 이상 업로드해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUploading(true);

    // 1. 이미지 파일 이름 수정 및 업로드 준비
    const uploadPromises = previewImages.map((image) => {
      return new Promise((resolve, reject) => {
        const fileExtension = image.file.name.split(".").pop();
        const uuid = uuidv4();
        const newFileName = `${uuid}.${fileExtension}`;

        // 새로운 File 객체 생성 (파일 이름 변경)
        const renamedFile = new File([image.file], newFileName, { type: image.file.type });

        const upload = new tus.Upload(renamedFile, {
          endpoint: `${VITE_API_BASE_URL}/api/v1/images/upload`,
          chunkSize: 5 * 1024 * 1024,
          retryDelays: [0, 1000, 3000, 5000],
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          metadata: {
            filename: newFileName, // 서버에 전달할 파일 이름
            filetype: image.file.type,
          },
          onSuccess: () => {
            resolve({ ...image, uploadUrl: upload.url, file: renamedFile, uuid });
          },
          onError: (error) => {
            reject(error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            console.log(`${newFileName}: ${percentage}%`);
          },
        });

        upload.start();
      });
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);

      // 2. 상품 등록 요청 준비
      const formDataToSend = new FormData();

      const registerRequest = {
        category_id: formData.categoryId,
        brand_id: formData.brandId,
        price: formData.price,
        name: formData.name,
        description: formData.description,
        stock: formData.stock,
        image_contexts: uploadedImages.map((image) => ({
          sequence: image.sequence,
          is_representative: image.sequence === 1,
          filename: image.file.name
        })),
      };

      formDataToSend.append(
        "register_request",
        new Blob([JSON.stringify(registerRequest)], { type: "application/json" })
      );

      // 3. 상품 등록 요청 전송
      const response = await post("/api/v1/product", formDataToSend);
      if (response.data.is_success) {
        navigate("/seller/dashboard");
      } else {
        console.error("상품 등록 실패");
      }
    } catch (error) {
      console.error("상품 등록 중 오류:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
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

          <div className="flex mt-12">
            <div className="w-1/2 pr-6">
              <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">상품 정보 입력</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                            <option key={child.id} value={child.id}>{child.name}</option>
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
                            <option key={subChild.id} value={subChild.id}>{subChild.name}</option>
                          ))}
                      </select>
                      {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                    </div>
                  </div>

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
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                    {errors.brandId && <p className="mt-1 text-sm text-red-600">{errors.brandId}</p>}
                  </div>

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
                      min="0"
                      className="mt-1 block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                  </div>

                  <div className="flex justify-end gap-4">
                    <Link
                      to="/seller/products"
                      className="inline-flex items-center px-6 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition duration-150 ease-in-out"
                    >
                      취소
                    </Link>
                    <button
                      type="submit"
                      disabled={uploading}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white shadow-sm transition duration-150 ease-in-out ${
                        uploading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {uploading ? "등록 중..." : "상품 등록"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-1/2 pl-6">
              <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 h-[calc(100vh-10rem)] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">상품 이미지 등록</h2>
                <ProductImageUploader onImagesChange={handleImagesChange} />
                {previewImages.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">이미지 순서 조정</h3>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="previewImages" direction="horizontal">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex flex-wrap gap-4 mb-4"
                          >
                            {previewImages.map((image, index) => (
                              <Draggable key={image.id} draggableId={image.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="relative w-24 h-24"
                                  >
                                    <img
                                      src={image.url}
                                      alt={`이미지 ${image.sequence}`}
                                      className="w-full h-full object-contain rounded-md shadow-sm"
                                    />
                                    <span className="absolute top-1 left-1 bg-gray-800 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                      {image.sequence}
                                    </span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}
                {previewImages.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">전체 이미지 미리보기</h3>
                    <div className="space-y-4">
                      {previewImages.map((image) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.url}
                            alt={`이미지 ${image.sequence}`}
                            className="w-full h-auto object-contain rounded-md shadow-sm"
                          />
                          <span className="absolute top-2 left-2 bg-gray-800 text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center">
                            {image.sequence}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductRegister;
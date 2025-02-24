import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductImageUploader from "../../components/product/ProductImageUploader.jsx";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductEdit() {
  const navigate = useNavigate();
  const { productId } = useParams();

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
    existingImages: [],
  });

  const [categoryNames, setCategoryNames] = useState({
    large: "",
    medium: "",
    small: "",
  });
  const [brandName, setBrandName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`${VITE_API_BASE_URL}/api/v1/seller/products/${productId}`, {
          withCredentials: true,
        });
        const product = productResponse.data.result;

        setFormData({
          largeCategoryId: product.category_id ? String(product.category_id) : "",
          mediumCategoryId: "",
          categoryId: product.category_id ? String(product.category_id) : "",
          brandId: product.brand_id ? String(product.brand_id) : "",
          price: String(product.price || ""),
          name: product.name || "",
          description: product.description || "",
          stock: String(product.stock || ""),
          images: [],
          existingImages: product.images || [],
        });

        setCategoryNames({
          large: product.large_category_name || "",
          medium: product.medium_category_name || "",
          small: product.small_category_name || "",
        });
        setBrandName(product.brand_name || "");

        // sequence 기준으로 정렬된 previewImages 설정
        setPreviewImages(
          product.images
            ? product.images
              .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)) // sequence로 정렬
              .map((img) => ({
                id: uuidv4(),
                product_image_id: img.product_image_id,
                url: img.image_url,
                sequence: img.sequence || 0, // sequence 필드 추가
                isExisting: true,
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ fetch: "데이터를 불러오는데 실패했습니다." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

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
    }));
  };

  const handleImagesChange = (newImages) => {
    console.log("handleImagesChange: ", newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
    const newPreviewImages = newImages.map((file) => ({
      id: uuidv4(),
      product_image_id: null,
      url: URL.createObjectURL(file),
      file: file,
      isExisting: false,
      uuid: uuidv4(),
      sequence: previewImages.length + 1, // 새 이미지의 초기 sequence는 마지막 순서 + 1
    }));
    setPreviewImages([...previewImages.filter((img) => img.isExisting), ...newPreviewImages]);
  };

  const handleRemoveImage = (imageId) => {
    const removedImage = previewImages.find((img) => img.id === imageId);
    if (removedImage && removedImage.isExisting) {
      setDeletedImageIds((prev) => [...prev, removedImage.product_image_id]);
    }
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img.image_url !== removedImage?.url),
      images: prev.images.filter((img) => !removedImage?.file || img !== removedImage.file),
    }));
    setPreviewImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newPreviewImages = [...previewImages];
    const [reorderedImage] = newPreviewImages.splice(result.source.index, 1);
    newPreviewImages.splice(result.destination.index, 0, reorderedImage);

    // sequence 재설정
    newPreviewImages.forEach((img, index) => {
      img.sequence = index + 1;
    });

    setPreviewImages(newPreviewImages);

    const newExistingImages = newPreviewImages
      .filter((img) => img.isExisting)
      .map((img) => ({ image_url: img.url, product_image_id: img.product_image_id, sequence: img.sequence }));
    const newImages = newPreviewImages
      .filter((img) => !img.isExisting)
      .map((img) => img.file);
    setFormData((prev) => ({
      ...prev,
      existingImages: newExistingImages,
      images: newImages,
    }));
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.price) newErrors.price = "가격은 필수 입력값입니다.";
    else if (!/^[0-9]+$/.test(formData.price)) newErrors.price = "가격은 정수만 입력 가능합니다.";
    else if (parseInt(formData.price) <= 0) newErrors.price = "가격은 1원 이상이어야 합니다.";
    if (!formData.name) newErrors.name = "상품명은 필수 입력값입니다.";
    else if (formData.name.length < 10) newErrors.name = "상품명은 최소 10글자 이상이어야 합니다.";
    if (!formData.stock) newErrors.stock = "재고는 필수 입력값입니다.";
    else if (parseInt(formData.stock) < 1) newErrors.stock = "재고는 1 이상이어야 합니다.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updateRequest = {
      productId: productId,
      category_id: formData.categoryId,
      brand_id: formData.brandId,
      price: formData.price,
      name: formData.name,
      description: formData.description,
      stock: formData.stock,
    };

    try {
      const response = await axios.patch(`${VITE_API_BASE_URL}/api/v1/products/${productId}`, updateRequest, {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/seller/dashboard");
      }
      alert("상품 정보가 수정되었습니다.");
    } catch (error) {
      console.error("상품 정보 수정 중 오류:", error);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (previewImages.length === 0) {
      newErrors.images = "이미지를 최소 1개 이상 업로드해주세요.";
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();

    const productImageIdsToDelete = deletedImageIds;

    const productImagesToUpdate = previewImages.map((image, index) => ({
      product_image_id: image.isExisting ? image.product_image_id : null,
      sequence: image.sequence, // API 요청에 sequence 반영
      uuid: image.isExisting ? null : image.uuid,
      is_representative: index === 0,
      is_new_image: !image.isExisting,
    }));

    const updateImageRequest = {
      product_id: Number(productId),
      product_image_ids_to_delete: productImageIdsToDelete,
      product_images_to_update: productImagesToUpdate,
    };

    formDataToSend.append(
      "modify_request",
      new Blob([JSON.stringify(updateImageRequest)], { type: "application/json" })
    );

    formData.images.forEach((file) => {
      const fileExtension = file.name.split(".").pop();
      const matchingPreview = previewImages.find((img) => !img.isExisting && img.file === file);
      const uuid = matchingPreview ? matchingPreview.uuid : uuidv4();
      formDataToSend.append("images", new File([file], `${uuid}.${fileExtension}`, { type: file.type }));
    });

    console.log("이미지 수정 요청:", updateImageRequest);

    try {
      const response = await axios.put(`${VITE_API_BASE_URL}/api/v1/products/images`, formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.is_success) {
        navigate("/seller/dashboard");
        alert("이미지가 성공적으로 수정되었습니다.");
      } else {
        alert("이미지 수정에 실패했습니다: ", response.data.message);
      }
    } catch (error) {
      console.error("이미지 수정 중 오류:", error);
      alert("이미지 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-indigo-50 py-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="text-indigo-600">SELLECT Seller</span> 상품 수정
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
              기존 상품 정보를 수정하세요.
            </p>
          </div>

          <div className="flex mt-12">
            {/* Left: 상품 정보 수정 */}
            <div className="w-1/2 pr-6">
              <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">상품 정보 수정</h2>
                <form onSubmit={handleInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="largeCategory" className="block text-sm font-medium text-gray-700">
                        대분류
                      </label>
                      <div className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 py-2 px-3 text-sm text-gray-900">
                        {categoryNames.large || "미지정"}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="mediumCategory" className="block text-sm font-medium text-gray-700">
                        중분류
                      </label>
                      <div className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 py-2 px-3 text-sm text-gray-900">
                        {categoryNames.medium || "미지정"}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        소분류
                      </label>
                      <div className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 py-2 px-3 text-sm text-gray-900">
                        {categoryNames.small || "미지정"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                      브랜드
                    </label>
                    <div className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-100 py-2 px-3 text-sm text-gray-900">
                      {brandName || "미지정"}
                    </div>
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
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition duration-150 ease-in-out"
                    >
                      정보 수정
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: 이미지 수정 */}
            <div className="w-1/2 pl-6">
              <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 h-[calc(100vh-10rem)] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">상품 이미지 수정</h2>
                <form onSubmit={handleImageSubmit}>
                  {/* 작은 이미지로 순서 변경 */}
                  {previewImages.length > 0 && (
                    <div className="mb-6">
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
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(image.id)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-700 transition duration-150 ease-in-out"
                                      >
                                        ×
                                      </button>
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

                  <ProductImageUploader onImagesChange={handleImagesChange} />

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">전체 이미지 미리보기</h3>
                  {previewImages.length > 0 ? (
                    <div className="space-y-4 mb-6">
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
                  ) : (
                    <p className="text-gray-500 text-sm mb-6">이미지가 없습니다.</p>
                  )}

                  {errors.images && (
                    <p className="mt-2 text-sm text-red-600">{errors.images}</p>
                  )}
                  <div className="flex justify-end gap-4 mt-6">
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
                      이미지 수정
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductEdit;
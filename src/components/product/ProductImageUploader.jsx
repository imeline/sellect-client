import { useState, useCallback } from "react";

function ProductImageUploader({ onImagesChange }) {
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((files) => {
    // file (이미지 파일)
    // -> 1. image context (target, prev, next)
    // -> 2. file (원본 파일)
    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => {
      const updatedImages = [...prev, ...newImages];
      onImagesChange(updatedImages.map((img) => img.file));
      return updatedImages;
    });
  }, [onImagesChange]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFiles(files);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) handleFiles(files);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const updatedImages = prev.filter((_, i) => i !== index);
      onImagesChange(updatedImages.map((img) => img.file));
      return updatedImages;
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">상품 이미지</label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition duration-150 ease-in-out ${
          dragOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white"
        }`}
      >
        <p className="text-gray-500 mb-4">
          이미지를 여기로 드래그하거나 아래 버튼을 클릭하세요.
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-sm transition duration-150 ease-in-out"
        >
          파일 선택
        </label>
        {/* 업로드된 파일 이름 표시 */}
        {images.length > 0 && (
          <ul className="mt-4 text-sm text-gray-700 space-y-2">
            {images.map((image, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{image.file.name}</span>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition duration-150 ease-in-out text-xs font-medium"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="mt-6 space-y-6">
          {images.map((image, index) => (
            <div key={index} className="flex items-start gap-4">
              <img
                src={image.url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-auto object-contain rounded-lg border border-gray-200"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageUploader;
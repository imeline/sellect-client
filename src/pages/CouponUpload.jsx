import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CouponUploader() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quantity: '',
    discount: '',
    expirationDate: '',
  });

  const [errors, setErrors] = useState({});

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.quantity) {
      newErrors.quantity = '쿠폰 수량은 필수 입력값입니다.';
    } else if (!/^[0-9]+$/.test(
        formData.quantity)) {
      newErrors.quantity = '수량은 정수만 입력 가능합니다.';
    } else if (parseInt(formData.quantity)
        <= 0) {
      newErrors.quantity = '수량은 1개 이상이어야 합니다.';
    }

    if (!formData.discount) {
      newErrors.discount = '할인 금액은 필수 입력값입니다.';
    } else if (!/^[0-9]+$/.test(
        formData.discount)) {
      newErrors.discount = '할인 금액은 정수만 입력 가능합니다.';
    } else if (parseInt(formData.discount)
        <= 0) {
      newErrors.discount = '할인 금액은 1원 이상이어야 합니다.';
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = '만료 날짜는 필수 입력값입니다.';
    } else {
      const expiryDate = new Date(formData.expirationDate);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expirationDate = '만료 날짜는 오늘 이후여야 합니다.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSend = {
      quantity: parseInt(formData.quantity),
      discount: parseInt(formData.discount),
      expiration_date: formData.expirationDate,
    };

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/coupon/issue`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('쿠폰이 성공적으로 등록되었습니다!');
        navigate('/seller');
      } else {
        const errorData = await response.json();
        console.error('쿠폰 등록 실패:', errorData);
        setErrors({api: errorData.message || '쿠폰 등록에 실패했습니다.'});
      }
    } catch (error) {
      console.error('쿠폰 등록 중 오류:', error);
      setErrors({api: '서버 오류로 쿠폰 등록에 실패했습니다.'});
    }
  };

  return (
      <div
          className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            SELLECT Seller 쿠폰 등록
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-600">
            고객에게 특별한 혜택을 제공해보세요!
          </p>
        </div>

        {/* Main Content */}
        <div
            className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">쿠폰
            정보 입력</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 수량 */}
            <div>
              <label htmlFor="quantity"
                     className="block text-sm font-medium text-gray-700">
                발급 수량
              </label>
              <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0" // 음수 방지
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="발급할 쿠폰 수량"
              />
              {errors.quantity && <p
                  className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
            </div>

            {/* 할인 금액 */}
            <div>
              <label htmlFor="discount"
                     className="block text-sm font-medium text-gray-700">
                할인 금액 (원)
              </label>
              <input
                  type="number"
                  name="discount"
                  id="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0" // 음수 방지
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="할인 금액"
              />
              {errors.discount && <p
                  className="mt-1 text-sm text-red-600">{errors.discount}</p>}
            </div>

            {/* 만료 날짜 */}
            <div>
              <label htmlFor="expirationDate"
                     className="block text-sm font-medium text-gray-700">
                만료 날짜
              </label>
              <input
                  type="date"
                  name="expirationDate"
                  id="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              />
              {errors.expirationDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expirationDate}</p>
              )}
            </div>

            {/* API 에러 메시지 */}
            {errors.api && (
                <p className="text-sm text-red-600 text-center">{errors.api}</p>
            )}

            {/* 제출 버튼 */}
            <div className="flex justify-end gap-4">
              <Link
                  to="/seller"
                  className="inline-flex items-center px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm"
              >
                취소
              </Link>
              <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-full hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                쿠폰 등록
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default CouponUploader;
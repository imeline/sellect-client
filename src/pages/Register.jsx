import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState('user'); // 'user' 또는 'seller'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = '사용자 이름은 필수입니다.';
    if (!formData.email) newErrors.email = '이메일은 필수입니다.';
    if (!formData.password) newErrors.password = '비밀번호는 필수입니다.';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const endpoint = role === 'user'
        ? `${VITE_API_BASE_URL}/api/v1/auth/signup`
        : `${VITE_API_BASE_URL}/api/v1/auth/seller/signup`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        console.log(`${role === 'user' ? '사용자' : '판매자'} 회원가입 성공`);
        navigate('/login');
      } else {
        const errorData = await response.json();
        setErrors({ server: errorData.message || '회원가입에 실패했습니다.' });
      }
    } catch (error) {
      console.error('회원가입 중 오류:', error);
      setErrors({ server: '서버 오류가 발생했습니다.' });
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          {/* 헤더 */}
          <div className="text-center">
            <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              회원가입
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              계정 유형을 선택하고 시작하세요!
            </p>
          </div>

          {/* 역할 선택 토글 */}
          <div className="flex justify-center space-x-4">
            <button
                onClick={() => setRole('user')}
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                    role === 'user'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
                }`}
            >
              사용자
            </button>
            <button
                onClick={() => setRole('seller')}
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                    role === 'seller'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-purple-100 hover:text-purple-600'
                }`}
            >
              판매자
            </button>
          </div>

          {/* 폼 */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">사용자 이름</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="사용자 이름"
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="email-address" className="sr-only">이메일</label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="이메일 주소"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">비밀번호</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirm-password" className="sr-only">비밀번호 확인</label>
                <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* 서버 에러 메시지 */}
            {errors.server && (
                <p className="text-red-500 text-sm text-center">{errors.server}</p>
            )}

            {/* 제출 버튼 */}
            <div>
              <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                회원가입
              </button>
            </div>

            {/* 로그인 링크 */}
            <p className="text-center text-sm text-gray-600">
              이미 계정이 있나요?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                로그인
              </Link>
            </p>
          </form>
        </div>
      </div>
  );
};

export default Register;
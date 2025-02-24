import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LeaveAccount = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log('LeaveAccount - useAuth:', { isLoggedIn, logout });

  const handleLeave = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setError('로그인 상태가 아닙니다.');
      return;
    }

    if (confirmText !== '회원탈퇴') {
      setError('확인을 위해 "회원탈퇴"를 정확히 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/users/leave`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = '회원탈퇴에 실패했습니다.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonErr) {
          console.error('응답 파싱 오류:', jsonErr);
        }
        throw new Error(errorMessage);
      }

      console.log('회원탈퇴 성공');
      alert('회원탈퇴가 완료되었습니다.');
      logout();
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('회원탈퇴 중 오류:', err);
      setError(err.message || '서버 오류로 회원탈퇴에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="space-y-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center">회원탈퇴</h2>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-sm mb-4 text-center">
            계정과 모든 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <p className="text-red-600 text-sm mb-4 text-center">
            <strong>"회원탈퇴"</strong>를 입력해 주세요.
          </p>

          <form onSubmit={handleLeave} className="space-y-4">
            <div>
              <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="회원탈퇴 입력"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              />
            </div>

            {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <Link
                  to="/user/profile"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                취소
              </Link>
              <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-full hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? '처리 중...' : '회원탈퇴'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LeaveAccount;
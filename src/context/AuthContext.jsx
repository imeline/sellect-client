// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  user: null,
  role: 'GUEST',
  cartItemCount: 0, // 장바구니 개수 추가
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        role: action.payload.role,
        cartItemCount: action.payload.cartItemCount || 0, // 로그인 시 초기 개수 설정
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        role: 'GUEST',
        cartItemCount: 0, // 로그아웃 시 개수 초기화
      };
    case 'UPDATE_CART_COUNT':
      return {
        ...state,
        cartItemCount: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState, () => {
    // 초기 상태를 localStorage에서 복구
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : initialState;
  });

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state));
  }, [state]);

  // 로그인 시 사용자 정보와 장바구니 개수 가져오기
  const login = async (user, role) => {
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/carts/count`, {
        withCredentials: true,
      });
      const cartItemCount = response.data.result || 0;
      dispatch({ type: 'LOGIN', payload: { user, role, cartItemCount } });
    } catch (error) {
      console.error("Error fetching cart count during login:", error);
      dispatch({ type: 'LOGIN', payload: { user, role, cartItemCount: 0 } });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // 장바구니 개수 업데이트 함수
  const updateCartCount = (count) => {
    dispatch({ type: 'UPDATE_CART_COUNT', payload: count });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateCartCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
}
// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from "axios";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  accessToken: null,
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
        accessToken: action.payload.accessToken,
        user: action.payload.user,
        role: action.payload.role,
        cartItemCount: action.payload.cartItemCount || 0, // 로그인 시 초기 개수 설정
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
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
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('auth', JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [state]);

  const login = async (accessToken, user, role) => {
    if (!accessToken) {
      console.warn("No accessToken provided to login");
    }
    let cartItemCount = 0;
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/carts/count`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      cartItemCount = response.data.result || 0;
    } catch (error) {
      console.error("Cart API error:", error.response?.status, error.message);
    }
    dispatch({ type: 'LOGIN', payload: { accessToken, user, role, cartItemCount } });
  };

  const logout = () => {
    console.log("Logging out");
    dispatch({ type: 'LOGOUT' });
  };

  const updateCartCount = async () => {
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/carts/count`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${state.accessToken}` },
      });
      const cartItemCount = response.data.result || 0;
      dispatch({ type: 'UPDATE_CART_COUNT', payload: cartItemCount });
    } catch (error) {
      console.error("Error updating cart count:", error);
    }
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
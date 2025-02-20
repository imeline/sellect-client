// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  user: null,
  role: 'GUEST',
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        role: action.payload.role,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        role: 'GUEST',
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

  const login = (user, role) => {
    dispatch({ type: 'LOGIN', payload: { user, role } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
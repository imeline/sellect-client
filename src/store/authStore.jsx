import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


const useAuthStore = create(immer((set) => ({
  isLoggedIn: false,
  user: null,
  accessToken: null,

  // 로그인 액션
  login: (user, token) => set((state) => {
    state.isLoggedIn = true;
    state.user = user;
    state.accessToken = token;
  }),

  // 로그아웃 액션
  logout: () => set((state) => {
    state.isLoggedIn = false;
    state.user = null;
    state.accessToken = null;
  }),
})));

export default useAuthStore;
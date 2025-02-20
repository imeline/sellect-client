import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';


const useAuthStore = create(immer((set) => ({
  isLoggedIn: false,
  user: null,
  role: 'GUEST',

  // 로그인 액션
  login: (user, role) => set((state) => {
    state.isLoggedIn = true;
    state.user = user;
    state.role = role;
  }),

  // 로그아웃 액션
  logout: () => set((state) => {
    state.isLoggedIn = false;
    state.user = null;
    state.role = 'GUEST';
  }),
})));

export default useAuthStore;
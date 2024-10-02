// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/authSlice.js';
import languageReducer from './Language/languageSlice.js';

// Khởi tạo persistedAuthState từ localStorage
const persistedAuthState = {
  auth: {
    token: localStorage.getItem('token') || null,
    isAuthenticated: localStorage.getItem('token') ? true : false,
    userRole: localStorage.getItem('userRole') || null,
    username: localStorage.getItem('username') || null,
  },
  language: {
    language: localStorage.getItem('language') || 'vi', // Khởi tạo ngôn ngữ từ localStorage
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
  },
  preloadedState: persistedAuthState,
});

export default store;
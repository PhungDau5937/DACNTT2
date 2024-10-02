import { createSlice } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isAuthenticated: false,
    userRole: null,
    username: null
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Decode token to get userRole
      const decodedToken = jwtDecode(action.payload.token);
      state.userRole = decodedToken.user.role;
      state.username = decodedToken.user.username; 

      // Store token and userRole in localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userRole', decodedToken.user.role);
      localStorage.setItem('username', decodedToken.user.id);
      // localStorage.setItem('language', decodedToken.user.language);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userRole = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
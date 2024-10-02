// languageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: localStorage.getItem('language') || 'vi',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === 'vi' ? 'en' : 'vi';
      localStorage.setItem('language', state.language);
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', state.language);
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
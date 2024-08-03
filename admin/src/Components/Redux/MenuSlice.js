import { createSlice } from "@reduxjs/toolkit";

const MenuSlice = createSlice({
  name: "menu",
  initialState: {
    value: { display: false }
  },
  reducers: {
    openMenu: (state) => {
      state.value.display = true;
    },
    closeMenu: (state) => {
      state.value.display = false;
    }
  }
});

export default MenuSlice.reducer;
export const { openMenu, closeMenu } = MenuSlice.actions;

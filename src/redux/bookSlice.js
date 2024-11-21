import { createSlice } from "@reduxjs/toolkit";

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
  },
  reducers: {
    addBook: (state, action) => {
      state.books.push(action.payload);
    },
    updateBook: (state, action) => {
      state.books = state.books.map((b) =>
        b.id === action.payload.id
          ? {
              ...b,
              ...action.payload,
            }
          : b
      );
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
    },
    rentalBook: (state, action) => {
      state.books = state.books.map((b) =>
        b.id === action.payload
          ? {
              ...b,
              rented: !b.rented,
            }
          : b
      );
    },
  },
});

export const { addBook, updateBook, deleteBook, rentalBook } =
  bookSlice.actions;
export default bookSlice.reducer;

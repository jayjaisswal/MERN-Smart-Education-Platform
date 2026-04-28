import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const getInitialWishlist = () => {
  try {
    const wishlist = localStorage.getItem("wishlist");
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error("Error reading wishlist from localStorage:", error);
    return [];
  }
};

const getInitialWishlistItems = () => {
  try {
    const items = localStorage.getItem("wishlistItems");
    return items ? JSON.parse(items) : 0;
  } catch (error) {
    console.error("Error reading wishlistItems from localStorage:", error);
    return 0;
  }
};

const initialState = {
  wishlist: getInitialWishlist(),
  totalItems: getInitialWishlistItems(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    loadWishlist: (state) => {
      // Explicitly load/hydrate wishlist from localStorage
      const wishlist = getInitialWishlist();
      const items = getInitialWishlistItems();
      state.wishlist = wishlist;
      state.totalItems = items;
    },
    addToWishlist: (state, action) => {
      const course = action.payload;
      const index = state.wishlist.findIndex((item) => item._id === course._id);

      if (index >= 0) {
        // If the course is already in the wishlist, do not add it again
        toast.error("Course already in wishlist");
        return;
      }
      // If the course is not in the wishlist, add it
      state.wishlist.push(course);
      state.totalItems++;
      // Update to localStorage with error handling
      try {
        localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
        localStorage.setItem("wishlistItems", JSON.stringify(state.totalItems));
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
      }
      // show toast
      toast.success("Course added to wishlist");
    },
    removeFromWishlist: (state, action) => {
      const courseId = action.payload;
      const index = state.wishlist.findIndex((item) => item._id === courseId);

      if (index >= 0) {
        // If the course is found in the wishlist, remove it
        state.totalItems--;
        state.wishlist.splice(index, 1);
        // Update to localStorage with error handling
        try {
          localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
          localStorage.setItem(
            "wishlistItems",
            JSON.stringify(state.totalItems),
          );
        } catch (error) {
          console.error("Error saving wishlist to localStorage:", error);
        }
        // show toast
        toast.success("Course removed from wishlist");
      }
    },
    resetWishlist: (state) => {
      state.wishlist = [];
      state.totalItems = 0;
      localStorage.removeItem("wishlist");
      localStorage.removeItem("wishlistItems");
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  resetWishlist,
  loadWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;

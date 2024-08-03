const initialState = {
  wishlistItems: JSON.parse(localStorage.getItem("wishlistItems")) || [],
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      const updatedWishlist = [...state.wishlistItems, action.payload];
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
      return {
        ...state,
        wishlistItems: updatedWishlist,
      };

    case "REMOVE_FROM_WISHLIST":
      const filteredWishlist = state.wishlistItems.filter(
        (item) => item.subProductId !== action.payload
      );
      localStorage.setItem("wishlistItems", JSON.stringify(filteredWishlist));
      return {
        ...state,
        wishlistItems: filteredWishlist,
      };

    default:
      return state;
  }
};

export default wishlistReducer;

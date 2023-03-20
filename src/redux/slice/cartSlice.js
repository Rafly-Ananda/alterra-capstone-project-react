import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
    },
    reducers: {
        addToCart: (state, action) => {
            const itemAddCartQuantity = action.payload.quantityAdded;
            const itemInCart = state.cart.find((item) => item.product_id === action.payload.productAdded);
            if (itemInCart) {
                itemInCart.quantity = itemInCart.quantity + itemAddCartQuantity;
            } else {
                state.cart.push({ product_id: action.payload.productAdded, quantity: itemAddCartQuantity });
            }
        },
        editItemCart: (state, action) => {
            const productEdited = action.payload.productEdited;
            const quantityEdited = action.payload.quantityEdited;
        
            // Find the item in the cart that matches the edited product ID
            const item = state.cart.find(item => item.product_id === productEdited);
            if (item) {
                // Update the quantity property of the found item
                item.quantity = quantityEdited;
            }
        },
        deleteItemCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.product_id !== action.payload.productDeleted);
        },
        clearCart: (state) => {
            state.cart = [];
        }
    }
});
export const {addToCart,editItemCart,deleteItemCart,clearCart} = cartSlice.actions;

export default cartSlice.reducer;
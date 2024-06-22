import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    cartItems: [],
    totalQuantity: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            if (!state.cartItems) {
                state.cartItems = [];
            }

            const itemIndex = state.cartItems.findIndex(
                (item) => item._id === action.payload._id
            );
            if (itemIndex >= 0) {
                state.cartItems[itemIndex].cartQuantity += 1;
                toast.info(` ${state.cartItems[itemIndex].title} ürününün adedi artırıldı`, {
                    position: 'bottom-left'
                });
            } else {
                const tempProduct = { ...action.payload, cartQuantity: 1 };
                state.cartItems.push(tempProduct);
                toast.success(` ${action.payload.title} sepete eklendi`, {
                    position: 'bottom-left'
                });
            }

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action) {
            const nextCartItems = state.cartItems.filter(
                (cartItem) => cartItem._id !== action.payload._id
            );
            state.cartItems = nextCartItems;
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            toast.error(` ${action.payload.title} sepetten çıkarıldı`, {
                position: 'bottom-left'
            });
        },
        decreaseCart(state, action) {
            const itemIndex = state.cartItems.findIndex(
                (item) => item._id === action.payload._id
            );

            if (state.cartItems[itemIndex].cartQuantity > 1) {
                state.cartItems[itemIndex].cartQuantity -= 1;
                toast.info(` ${action.payload.title} ürününün adedi azaltıldı`, {
                    position: 'bottom-left'
                });
            } else if (state.cartItems[itemIndex].cartQuantity === 1) {
                const nextCartItems = state.cartItems.filter(
                    (cartItem) => cartItem._id !== action.payload._id
                );
                state.cartItems = nextCartItems;
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
                toast.error(` ${action.payload.title} sepetten çıkarıldı`, {
                    position: 'bottom-left'
                });
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        getTotals(state, action) {
            if (!state.cartItems) {
                return;
            }

            let { total, quantity } = state.cartItems.reduce(
                (cartTotal, cartItem) => {
                    const { price, cartQuantity } = cartItem;
                    const itemTotal = price * cartQuantity;

                    cartTotal.total += itemTotal;
                    cartTotal.quantity += cartQuantity;

                    return cartTotal;
                },
                {
                    total: 0,
                    quantity: 0,
                }
            );
            total = parseFloat(total.toFixed(2));
            state.totalQuantity = quantity;
            state.totalPrice = total;
        },
        clearCart(state) {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            localStorage.removeItem('cartItems');
        },
    }
});

export const { addToCart, removeFromCart, decreaseCart, getTotals, clearCart } = cartSlice.actions;

export default cartSlice;

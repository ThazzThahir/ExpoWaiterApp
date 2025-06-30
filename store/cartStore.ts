import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart, CartItem, MenuItem, Modifier } from '@/types/menu';

interface CartState {
    cart: Cart;
    addToCart: (menuItem: MenuItem, quantity: number, modifiers: Modifier[], specialInstructions?: string) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    setTableInfo: (tableId: string, tableNumber: number, guestName: string, guestCount: number) => void;
    getItemCount: () => number;
}

const initialCart: Cart = {
    items: [],
    totalAmount: 0,
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: {
                items: [],
                totalAmount: 0,
                tableId: undefined,
                tableNumber: undefined,
                guestName: undefined,
                guestCount: undefined,
            },

            addToCart: (menuItem, quantity, modifiers, specialInstructions) => {
                set((state) => {
                    // Calculate total price for this item including modifiers
                    const modifierTotal = modifiers.reduce((sum, mod) => sum + mod.price, 0);
                    const itemTotal = (menuItem.price + modifierTotal) * quantity;

                    // Create a unique ID for this cart item
                    const cartItemId = `${menuItem.id}-${Date.now()}`;

                    const newItem: CartItem = {
                        id: cartItemId,
                        menuItem,
                        quantity,
                        modifiers,
                        specialInstructions,
                        totalPrice: itemTotal,
                    };

                    const updatedItems = [...state.cart.items, newItem];
                    const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

                    return {
                        cart: {
                            ...state.cart,
                            items: updatedItems,
                            totalAmount: newTotalAmount,
                        }
                    };
                });
            },

            removeFromCart: (cartItemId) => {
                set((state) => {
                    const updatedItems = state.cart.items.filter(item => item.id !== cartItemId);
                    const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

                    return {
                        cart: {
                            ...state.cart,
                            items: updatedItems,
                            totalAmount: newTotalAmount,
                        }
                    };
                });
            },

            updateQuantity: (cartItemId, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        // If quantity is 0 or negative, remove the item
                        return get().removeFromCart(cartItemId), state;
                    }

                    const updatedItems = state.cart.items.map(item => {
                        if (item.id === cartItemId) {
                            // Calculate the new total price based on the new quantity
                            const modifierTotal = item.modifiers.reduce((sum, mod) => sum + mod.price, 0);
                            const itemPrice = item.menuItem.price + modifierTotal;

                            return {
                                ...item,
                                quantity,
                                totalPrice: itemPrice * quantity,
                            };
                        }
                        return item;
                    });

                    const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

                    return {
                        cart: {
                            ...state.cart,
                            items: updatedItems,
                            totalAmount: newTotalAmount,
                        }
                    };
                });
            },

            clearCart: () => {
                set({
                    cart: initialCart,
                });
            },

            setTableInfo: (tableId, tableNumber, guestName, guestCount) => {
                set((state) => ({
                    cart: {
                        ...state.cart,
                        tableId,
                        tableNumber,
                        guestName,
                        guestCount,
                    }
                }));
            },

            getItemCount: () => {
                return get().cart.items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
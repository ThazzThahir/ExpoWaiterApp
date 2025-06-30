export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
    available: boolean;
}

export interface Category {
    id: string;
    name: string;
    order: number;
}

export interface Modifier {
    id: string;
    name: string;
    price: number;
    required: boolean;
    groupId: string;
}

export interface ModifierGroup {
    id: string;
    name: string;
    required: boolean;
    multiSelect: boolean;
    modifiers: Modifier[];
}

export interface CartItem {
    id: string;
    menuItem: MenuItem;
    quantity: number;
    modifiers: Modifier[];
    specialInstructions?: string;
    totalPrice: number;
}

export interface Cart {
    items: CartItem[];
    tableId?: string;
    tableNumber?: number;
    guestName?: string;
    guestCount?: number;
    totalAmount: number;
}
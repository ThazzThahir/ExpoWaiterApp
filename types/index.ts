export type TableStatus = 'vacant' | 'reserved' | 'occupied';

export interface Table {
    id: string;
    number: number;
    status: TableStatus;
    guestCount: number;
    occupiedSince?: string; // ISO date string
    reservedFor?: string; // ISO date string
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
}

export type OrderStatus = 'preparing' | 'serving' | 'completed';

export interface Order {
    id: string;
    tableId: string;
    tableNumber: number;
    guestCount: number;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    total: number;
}

export interface User {
    id: string;
    username: string;
    name: string;
    role: 'admin' | 'staff';
}

// Extended user interface for authentication purposes
export interface AuthUser extends User {
    password: string;
}
import { create } from 'zustand';
import { Order, OrderStatus } from '@/types';

interface OrderState {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    getOrdersByStatus: (status: OrderStatus) => Order[];
    getActiveOrders: () => Order[];
    getCompletedOrders: () => Order[];
    updateOrderStatus: (id: string, status: OrderStatus) => void;
    getOrderById: (id: string) => Order | undefined;
    getOrdersByTableId: (tableId: string) => Order[];
    createOrder: (items: any[], tableId: string, tableNumber: number, guestName: string, guestCount: number, total: number) => void;
}

// Generate random mock orders
const generateMockOrders = (): Order[] => {
    const menuItems = [
        { name: 'Margherita Pizza', price: 12.99 },
        { name: 'Pepperoni Pizza', price: 14.99 },
        { name: 'Caesar Salad', price: 8.99 },
        { name: 'Spaghetti Carbonara', price: 15.99 },
        { name: 'Grilled Salmon', price: 19.99 },
        { name: 'Chicken Alfredo', price: 16.99 },
        { name: 'Cheeseburger', price: 11.99 },
        { name: 'French Fries', price: 4.99 },
        { name: 'Tiramisu', price: 7.99 },
        { name: 'Cheesecake', price: 6.99 },
    ];

    const statuses: OrderStatus[] = ['preparing', 'serving', 'completed'];

    return Array.from({ length: 20 }, (_, i) => {
        const id = `ORD-${1000 + i}`;
        const tableId = Math.floor(Math.random() * 16 + 1).toString();
        const tableNumber = parseInt(tableId);
        const guestCount = Math.floor(Math.random() * 6) + 1;

        // Generate 1-5 random items for this order
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const items = Array.from({ length: itemCount }, (_, j) => {
            const menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;

            return {
                id: `ITEM-${i}-${j}`,
                name: menuItem.name,
                price: menuItem.price,
                quantity,
                notes: Math.random() > 0.7 ? 'Special request' : undefined,
            };
        });

        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Randomly assign status
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Create timestamps
        const createdAt = new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString();
        const updatedAt = new Date(new Date(createdAt).getTime() + Math.floor(Math.random() * 60 * 60 * 1000)).toISOString();

        // Generate a random guest name
        const guestNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ivan', 'Julia'];
        const guestName = guestNames[Math.floor(Math.random() * guestNames.length)];

        return {
            id,
            tableId,
            tableNumber,
            guestName,
            guestCount,
            items,
            status,
            createdAt,
            updatedAt,
            total,
        };
    });
};

const MOCK_ORDERS = generateMockOrders();

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,

    fetchOrders: async () => {
        set({ isLoading: true, error: null });

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            set({ orders: MOCK_ORDERS, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch orders', isLoading: false });
        }
    },

    getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status);
    },

    getActiveOrders: () => {
        return get().orders.filter(order => order.status !== 'completed');
    },

    getCompletedOrders: () => {
        return get().orders.filter(order => order.status === 'completed');
    },

    updateOrderStatus: (id, status) => {
        set((state) => {
            const updatedOrders = state.orders.map(order => {
                if (order.id === id) {
                    return {
                        ...order,
                        status,
                        updatedAt: new Date().toISOString()
                    };
                }
                return order;
            });

            return { orders: updatedOrders };
        });
    },

    getOrderById: (id) => {
        return get().orders.find(order => order.id === id);
    },

    getOrdersByTableId: (tableId) => {
        return get().orders.filter(order => order.tableId === tableId);
    },

    createOrder: (items, tableId, tableNumber, guestName, guestCount, total) => {
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            tableId,
            tableNumber,
            guestName,
            guestCount,
            items: items.map(item => ({
                id: item.id,
                name: item.menuItem.name,
                quantity: item.quantity,
                price: item.totalPrice,
                notes: item.specialInstructions
            })),
            status: 'preparing',
            total,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        set(state => ({
            orders: [newOrder, ...state.orders]
        }));

        return newOrder;
    },
}));
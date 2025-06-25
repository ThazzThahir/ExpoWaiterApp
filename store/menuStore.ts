import { create } from 'zustand';
import { Category, MenuItem, ModifierGroup } from '@/types/menu';

interface MenuState {
    menuItems: MenuItem[];
    categories: Category[];
    modifierGroups: ModifierGroup[];
    isLoading: boolean;
    error: string | null;
    fetchMenu: () => Promise<void>;
    getMenuItemsByCategory: (categoryId: string) => MenuItem[];
    getMenuItemById: (id: string) => MenuItem | undefined;
    searchMenuItems: (query: string) => MenuItem[];
    getModifierGroupsForItem: (itemId: string) => ModifierGroup[];
}

// Mock data for categories
const MOCK_CATEGORIES: Category[] = [
    { id: 'cat1', name: 'Appetizers', order: 1 },
    { id: 'cat2', name: 'Main Courses', order: 2 },
    { id: 'cat3', name: 'Pasta', order: 3 },
    { id: 'cat4', name: 'Pizza', order: 4 },
    { id: 'cat5', name: 'Salads', order: 5 },
    { id: 'cat6', name: 'Desserts', order: 6 },
    { id: 'cat7', name: 'Beverages', order: 7 },
];

// Mock data for menu items
const MOCK_MENU_ITEMS: MenuItem[] = [
    {
        id: 'item1',
        name: 'Bruschetta',
        description: 'Toasted bread topped with tomatoes, garlic, and fresh basil',
        price: 8.99,
        categoryId: 'cat1',
        imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f',
        available: true,
    },
    {
        id: 'item2',
        name: 'Calamari',
        description: 'Crispy fried squid served with marinara sauce',
        price: 12.99,
        categoryId: 'cat1',
        imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
        available: true,
    },
    {
        id: 'item3',
        name: 'Mozzarella Sticks',
        description: 'Breaded mozzarella sticks with marinara sauce',
        price: 9.99,
        categoryId: 'cat1',
        imageUrl: 'https://images.unsplash.com/photo-1548340748-6d98e4415073',
        available: true,
    },
    {
        id: 'item4',
        name: 'Grilled Salmon',
        description: 'Fresh salmon fillet grilled to perfection with lemon butter sauce',
        price: 24.99,
        categoryId: 'cat2',
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
        available: true,
    },
    {
        id: 'item5',
        name: 'Filet Mignon',
        description: '8oz premium beef tenderloin with red wine reduction',
        price: 32.99,
        categoryId: 'cat2',
        imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462',
        available: true,
    },
    {
        id: 'item6',
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast topped with marinara and mozzarella',
        price: 18.99,
        categoryId: 'cat2',
        imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8',
        available: true,
    },
    {
        id: 'item7',
        name: 'Spaghetti Carbonara',
        description: 'Classic pasta with pancetta, egg, and parmesan cheese',
        price: 16.99,
        categoryId: 'cat3',
        imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
        available: true,
    },
    {
        id: 'item8',
        name: 'Fettuccine Alfredo',
        description: 'Fettuccine pasta in a rich, creamy parmesan sauce',
        price: 15.99,
        categoryId: 'cat3',
        imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c',
        available: true,
    },
    {
        id: 'item9',
        name: 'Penne Arrabbiata',
        description: 'Penne pasta in spicy tomato sauce with garlic and chili',
        price: 14.99,
        categoryId: 'cat3',
        imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
        available: true,
    },
    {
        id: 'item10',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 14.99,
        categoryId: 'cat4',
        imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
        available: true,
    },
    {
        id: 'item11',
        name: 'Pepperoni Pizza',
        description: 'Pizza topped with tomato sauce, mozzarella, and pepperoni',
        price: 16.99,
        categoryId: 'cat4',
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
        available: true,
    },
    {
        id: 'item12',
        name: 'Vegetarian Pizza',
        description: 'Pizza with bell peppers, mushrooms, onions, and olives',
        price: 15.99,
        categoryId: 'cat4',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        available: true,
    },
    {
        id: 'item13',
        name: 'Caesar Salad',
        description: 'Romaine lettuce with Caesar dressing, croutons, and parmesan',
        price: 10.99,
        categoryId: 'cat5',
        imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        available: true,
    },
    {
        id: 'item14',
        name: 'Greek Salad',
        description: 'Mixed greens with feta, olives, tomatoes, and cucumber',
        price: 11.99,
        categoryId: 'cat5',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
        available: true,
    },
    {
        id: 'item15',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 8.99,
        categoryId: 'cat6',
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
        available: true,
    },
    {
        id: 'item16',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
        price: 9.99,
        categoryId: 'cat6',
        imageUrl: 'https://images.unsplash.com/photo-1617305855058-336d24456869',
        available: true,
    },
    {
        id: 'item17',
        name: 'Espresso',
        description: 'Strong Italian coffee',
        price: 3.99,
        categoryId: 'cat7',
        imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04',
        available: true,
    },
    {
        id: 'item18',
        name: 'Red Wine',
        description: 'House red wine, glass',
        price: 7.99,
        categoryId: 'cat7',
        imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d',
        available: true,
    },
];

// Mock data for modifier groups
const MOCK_MODIFIER_GROUPS: ModifierGroup[] = [
    {
        id: 'mg1',
        name: 'Pizza Size',
        required: true,
        multiSelect: false,
        modifiers: [
            { id: 'mod1', name: 'Small (10")', price: 0, required: false, groupId: 'mg1' },
            { id: 'mod2', name: 'Medium (12")', price: 2, required: false, groupId: 'mg1' },
            { id: 'mod3', name: 'Large (14")', price: 4, required: false, groupId: 'mg1' },
        ],
    },
    {
        id: 'mg2',
        name: 'Pizza Toppings',
        required: false,
        multiSelect: true,
        modifiers: [
            { id: 'mod4', name: 'Extra Cheese', price: 1.5, required: false, groupId: 'mg2' },
            { id: 'mod5', name: 'Mushrooms', price: 1, required: false, groupId: 'mg2' },
            { id: 'mod6', name: 'Pepperoni', price: 1.5, required: false, groupId: 'mg2' },
            { id: 'mod7', name: 'Sausage', price: 1.5, required: false, groupId: 'mg2' },
            { id: 'mod8', name: 'Onions', price: 1, required: false, groupId: 'mg2' },
            { id: 'mod9', name: 'Bell Peppers', price: 1, required: false, groupId: 'mg2' },
        ],
    },
    {
        id: 'mg3',
        name: 'Pasta Options',
        required: true,
        multiSelect: false,
        modifiers: [
            { id: 'mod10', name: 'Regular', price: 0, required: false, groupId: 'mg3' },
            { id: 'mod11', name: 'Gluten-Free', price: 2, required: false, groupId: 'mg3' },
            { id: 'mod12', name: 'Whole Wheat', price: 1, required: false, groupId: 'mg3' },
        ],
    },
    {
        id: 'mg4',
        name: 'Salad Dressing',
        required: true,
        multiSelect: false,
        modifiers: [
            { id: 'mod13', name: 'Ranch', price: 0, required: false, groupId: 'mg4' },
            { id: 'mod14', name: 'Italian', price: 0, required: false, groupId: 'mg4' },
            { id: 'mod15', name: 'Balsamic', price: 0, required: false, groupId: 'mg4' },
            { id: 'mod16', name: 'Blue Cheese', price: 0, required: false, groupId: 'mg4' },
            { id: 'mod17', name: 'No Dressing', price: 0, required: false, groupId: 'mg4' },
        ],
    },
];

// Map of item IDs to modifier group IDs
const ITEM_MODIFIER_MAP: Record<string, string[]> = {
    'item10': ['mg1', 'mg2'], // Margherita Pizza
    'item11': ['mg1', 'mg2'], // Pepperoni Pizza
    'item12': ['mg1', 'mg2'], // Vegetarian Pizza
    'item7': ['mg3'], // Spaghetti Carbonara
    'item8': ['mg3'], // Fettuccine Alfredo
    'item9': ['mg3'], // Penne Arrabbiata
    'item13': ['mg4'], // Caesar Salad
    'item14': ['mg4'], // Greek Salad
};

export const useMenuStore = create<MenuState>((set, get) => ({
    menuItems: [],
    categories: [],
    modifierGroups: [],
    isLoading: false,
    error: null,

    fetchMenu: async () => {
        set({ isLoading: true, error: null });

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            set({
                menuItems: MOCK_MENU_ITEMS,
                categories: MOCK_CATEGORIES,
                modifierGroups: MOCK_MODIFIER_GROUPS,
                isLoading: false
            });
        } catch (error) {
            set({ error: 'Failed to fetch menu', isLoading: false });
        }
    },

    getMenuItemsByCategory: (categoryId) => {
        return get().menuItems.filter(item => item.categoryId === categoryId);
    },

    getMenuItemById: (id) => {
        return get().menuItems.find(item => item.id === id);
    },

    searchMenuItems: (query) => {
        const searchTerm = query.toLowerCase();
        return get().menuItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
    },

    getModifierGroupsForItem: (itemId) => {
        const modifierGroupIds = ITEM_MODIFIER_MAP[itemId] || [];
        return get().modifierGroups.filter(group => modifierGroupIds.includes(group.id));
    },
}));
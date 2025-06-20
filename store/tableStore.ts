import { create } from 'zustand';
import { Table, TableStatus } from '@/types';

interface TableState {
    tables: Table[];
    isLoading: boolean;
    error: string | null;
    fetchTables: () => Promise<void>;
    updateTableStatus: (id: string, status: TableStatus, guestCount?: number) => void;
    filterTables: (status?: TableStatus) => Table[];
    getTableById: (id: string) => Table | undefined;
}

// Mock data
const MOCK_TABLES: Table[] = Array.from({ length: 16 }, (_, i) => {
    const id = (i + 1).toString();
    const number = i + 1;

    // Randomly assign statuses for demo purposes
    const statuses: TableStatus[] = ['vacant', 'reserved', 'occupied'];
    const randomIndex = Math.floor(Math.random() * 3);
    const status = statuses[randomIndex];

    const guestCount = status === 'vacant' ? 0 : Math.floor(Math.random() * 6) + 1;

    const table: Table = {
        id,
        number,
        status,
        guestCount,
    };

    if (status === 'occupied') {
        // Set occupied time to a random time in the past (up to 3 hours ago)
        const occupiedSince = new Date(Date.now() - Math.floor(Math.random() * 3 * 60 * 60 * 1000));
        table.occupiedSince = occupiedSince.toISOString();
    }

    if (status === 'reserved') {
        // Set reservation time to a random time in the future (up to 3 hours from now)
        const reservedFor = new Date(Date.now() + Math.floor(Math.random() * 3 * 60 * 60 * 1000));
        table.reservedFor = reservedFor.toISOString();
    }

    return table;
});

export const useTableStore = create<TableState>((set, get) => ({
    tables: [],
    isLoading: false,
    error: null,

    fetchTables: async () => {
        set({ isLoading: true, error: null });

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            set({ tables: MOCK_TABLES, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch tables', isLoading: false });
        }
    },

    updateTableStatus: (id, status, guestCount = 0) => {
        set((state) => {
            const updatedTables = state.tables.map(table => {
                if (table.id === id) {
                    const updatedTable: Table = {
                        ...table,
                        status,
                        guestCount: status === 'vacant' ? 0 : guestCount || table.guestCount
                    };

                    if (status === 'occupied') {
                        updatedTable.occupiedSince = new Date().toISOString();
                        updatedTable.reservedFor = undefined;
                    } else if (status === 'reserved') {
                        // Default reservation for 1 hour from now
                        updatedTable.reservedFor = new Date(Date.now() + 60 * 60 * 1000).toISOString();
                        updatedTable.occupiedSince = undefined;
                    } else {
                        updatedTable.occupiedSince = undefined;
                        updatedTable.reservedFor = undefined;
                    }

                    return updatedTable;
                }
                return table;
            });

            return { tables: updatedTables };
        });
    },

    filterTables: (status) => {
        const { tables } = get();
        if (!status) return tables;
        return tables.filter(table => table.status === status);
    },

    getTableById: (id) => {
        return get().tables.find(table => table.id === id);
    },
}));
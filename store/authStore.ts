import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthUser } from "@/types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    users: AuthUser[];
    login: (username: string, password: string) => Promise<void>;
    register: (
        username: string,
        password: string,
        name: string,
    ) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

// Initial mock users
const INITIAL_USERS: AuthUser[] = [
    {
        id: "1",
        username: "admin",
        password: "12345",
        name: "Admin User",
        role: "admin" as const,
    },
    {
        id: "2",
        username: "staff",
        password: "password",
        name: "Staff User",
        role: "staff" as const,
    },
];

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            users: INITIAL_USERS,

            login: async (username: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    // Simulate API call delay
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Find user with matching credentials
                    const user = get().users.find(
                        (u) =>
                            u.username === username && u.password === password,
                    );

                    if (user) {
                        // Remove password before storing in state
                        const { password: _, ...userWithoutPassword } = user;
                        set({
                            user: userWithoutPassword,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    } else {
                        set({
                            error: "Invalid username or password",
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    set({
                        error: "An error occurred during login",
                        isLoading: false,
                    });
                }
            },

            register: async (
                username: string,
                password: string,
                name: string,
            ) => {
                set({ isLoading: true, error: null });

                try {
                    // Simulate API call delay
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Check if username already exists
                    const existingUser = get().users.find(
                        (u) => u.username === username,
                    );

                    if (existingUser) {
                        set({
                            error: "Username already exists",
                            isLoading: false,
                        });
                        return false;
                    }

                    // Create new user
                    const newUser: AuthUser = {
                        id: `${get().users.length + 1}`,
                        username,
                        password,
                        name,
                        role: "staff" as const, // New users default to staff role
                    };

                    // Add user to the list
                    set((state) => ({
                        users: [...state.users, newUser],
                        isLoading: false,
                    }));

                    return true;
                } catch (error) {
                    set({
                        error: "An error occurred during registration",
                        isLoading: false,
                    });
                    return false;
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                users: state.users,
            }),
        },
    ),
);

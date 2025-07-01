import { Tabs, useSegments } from "expo-router";
import { Home, Menu, ShoppingBag, Settings } from "lucide-react-native";
import { useAppTheme } from "../../../components/common/AppThemeProvider";

export default function TabsLayout() {
    const { colors } = useAppTheme();
    const segments = useSegments();
    // Hide header and tab bar for all main screens
    const lastSegment = segments[segments.length - 1];
    const hideNav = [undefined, '(tabs)', 'index', 'menu', 'orders', 'settings'].includes(lastSegment);

    return (
        <Tabs
            screenOptions={{
                headerShown: !hideNav,
                tabBarStyle: hideNav
                    ? { display: "none" }
                    : {
                        backgroundColor: colors.card,
                        borderTopColor: colors.border,
                    },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTintColor: colors.text,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="menu"
                options={{
                    title: "Menu",
                    tabBarIcon: ({ color, size }) => <Menu size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: "Orders",
                    tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
                }}
            />

        </Tabs>
    );
}
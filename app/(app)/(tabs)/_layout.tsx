import { Tabs } from "expo-router";
import { Home, Menu, ShoppingBag, Settings } from "lucide-react-native";
import { useAppTheme } from "../../../components/common/AppThemeProvider";

export default function TabsLayout() {
    const { colors } = useAppTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                },
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
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
    User,
    Bell,
    Moon,
    HelpCircle,
    Info,
    LogOut,
    ChevronRight,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [darkMode, setDarkMode] = React.useState(false);
    const [notifications, setNotifications] = React.useState(true);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: () => {
                        logout();
                        router.replace("/(auth)/login");
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const renderSettingItem = (
        icon: React.ReactNode,
        title: string,
        rightElement?: React.ReactNode,
        onPress?: () => void
    ) => {
        return (
            <TouchableOpacity
                style={styles.settingItem}
                onPress={onPress}
                disabled={!onPress}
            >
                <View style={styles.settingIconContainer}>
                    {icon}
                </View>
                <Text style={styles.settingTitle}>{title}</Text>
                <View style={styles.settingRight}>
                    {rightElement || <ChevronRight size={20} color={colors.textLight} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profileIconContainer}>
                    <User size={32} color="#fff" />
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{user?.name || "User"}</Text>
                    <Text style={styles.profileRole}>{user?.role || "Staff"}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                {renderSettingItem(
                    <Bell size={22} color={colors.primary} />,
                    "Notifications",
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: colors.border, true: colors.primaryLight }}
                        thumbColor={notifications ? colors.primary : "#f4f3f4"}
                    />
                )}

                {renderSettingItem(
                    <Moon size={22} color={colors.primary} />,
                    "Dark Mode",
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: colors.border, true: colors.primaryLight }}
                        thumbColor={darkMode ? colors.primary : "#f4f3f4"}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>

                {renderSettingItem(
                    <HelpCircle size={22} color={colors.primary} />,
                    "Help & Support",
                    undefined,
                    () => console.log("Help & Support pressed")
                )}

                {renderSettingItem(
                    <Info size={22} color={colors.primary} />,
                    "About",
                    undefined,
                    () => console.log("About pressed")
                )}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#e74c3c" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.card,
        marginBottom: 16,
    },
    profileIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 14,
        color: colors.textLight,
    },
    section: {
        backgroundColor: colors.card,
        marginBottom: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textLight,
        marginLeft: 16,
        marginBottom: 8,
        marginTop: 8,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    settingIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTitle: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
        paddingVertical: 16,
        marginBottom: 16,
    },
    logoutText: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        color: colors.textLight,
        fontSize: 12,
        marginBottom: 20,
    },
});
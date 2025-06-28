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
    HelpCircle,
    Info,
    LogOut,
    ChevronRight,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme } from '@/components/common/AppThemeProvider';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { colors } = useAppTheme();
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

    const dynamicStyles = {
        header: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.card,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold' as const,
            color: colors.text,
        },
        profileSection: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            padding: 16,
            backgroundColor: colors.card,
            marginBottom: 16,
        },
        profileIconContainer: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            marginRight: 16,
        },
        profileName: {
            fontSize: 18,
            fontWeight: 'bold' as const,
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
            fontWeight: '500' as const,
            color: colors.textLight,
            marginLeft: 16,
            marginBottom: 8,
            marginTop: 8,
        },
        settingItem: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        settingIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.border,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            marginRight: 12,
        },
        settingTitle: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
        },
        settingRight: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
        },
        logoutButton: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            backgroundColor: colors.card,
            paddingVertical: 16,
            marginBottom: 16,
        },
        logoutText: {
            color: '#e74c3c',
            fontSize: 16,
            fontWeight: '500' as const,
            marginLeft: 8,
        },
        versionText: {
            textAlign: 'center' as const,
            color: colors.textLight,
            fontSize: 12,
            marginBottom: 20,
        },
    };

    const renderSettingItem = (
        icon: React.ReactNode,
        title: string,
        rightElement?: React.ReactNode,
        onPress?: () => void
    ) => {
        return (
            <TouchableOpacity
                style={dynamicStyles.settingItem}
                onPress={onPress}
                disabled={!onPress}
            >
                <View style={dynamicStyles.settingIconContainer}>
                    {icon}
                </View>
                <Text style={dynamicStyles.settingTitle}>{title}</Text>
                <View style={dynamicStyles.settingRight}>
                    {rightElement || <ChevronRight size={20} color={colors.textLight} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.title}>Settings</Text>
            </View>

            <View style={dynamicStyles.profileSection}>
                <View style={dynamicStyles.profileIconContainer}>
                    <User size={32} color="#fff" />
                </View>
                <View style={styles.profileInfo}>
                    <Text style={dynamicStyles.profileName}>{user?.name || "User"}</Text>
                    <Text style={dynamicStyles.profileRole}>{user?.role || "Staff"}</Text>
                </View>
            </View>

            <View style={dynamicStyles.section}>
                <Text style={dynamicStyles.sectionTitle}>Preferences</Text>

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
            </View>

            <View style={dynamicStyles.section}>
                <Text style={dynamicStyles.sectionTitle}>Support</Text>

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

            <TouchableOpacity style={dynamicStyles.logoutButton} onPress={handleLogout}>
                <LogOut size={20} color="#e74c3c" />
                <Text style={dynamicStyles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={dynamicStyles.versionText}>Version 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileInfo: {
        flex: 1,
    },
});
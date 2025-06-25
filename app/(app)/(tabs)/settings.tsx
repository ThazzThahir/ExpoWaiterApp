
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Image,
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
    Edit,
    Camera,
    Settings as SettingsIcon,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/constants/colors';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { mode: themeMode, toggleTheme } = useThemeStore();
    const colors = getColors(themeMode === 'dark');
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

    const handleEditProfile = () => {
        Alert.alert("Edit Profile", "Profile editing feature coming soon!");
    };

    const handleChangePhoto = () => {
        Alert.alert("Change Photo", "Photo upload feature coming soon!");
    };

    const renderSettingItem = (
        icon: React.ReactNode,
        title: string,
        rightElement?: React.ReactNode,
        onPress?: () => void
    ) => {
        return (
            <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: colors.card }]}
                onPress={onPress}
                disabled={!onPress}
                activeOpacity={0.7}
            >
                <View style={[styles.settingIconContainer, { backgroundColor: colors.border }]}>
                    {icon}
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
                <View style={styles.settingRight}>
                    {rightElement || <ChevronRight size={20} color={colors.textLight} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
                </View>

                {/* Enhanced Profile Section */}
                <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
                    <LinearGradient
                        colors={[colors.primary, colors.primaryDark]}
                        style={styles.profileGradient}
                    >
                        <View style={styles.profileContent}>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
                                    style={styles.profileImage}
                                />
                                <TouchableOpacity
                                    style={styles.cameraButton}
                                    onPress={handleChangePhoto}
                                >
                                    <Camera size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{user?.name || "User"}</Text>
                                <Text style={styles.profileRole}>{user?.role?.toUpperCase() || "STAFF"}</Text>
                                <Text style={styles.profileEmail}>user@restaurant.com</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditProfile}
                            >
                                <Edit size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                {/* Stats Section */}
                <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.primary }]}>47</Text>
                        <Text style={[styles.statLabel, { color: colors.textLight }]}>Orders Served</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.secondary }]}>12</Text>
                        <Text style={[styles.statLabel, { color: colors.textLight }]}>Tables Managed</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.vacant }]}>98%</Text>
                        <Text style={[styles.statLabel, { color: colors.textLight }]}>Efficiency</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Preferences</Text>

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
                            value={themeMode === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primaryLight }}
                            thumbColor={themeMode === 'dark' ? colors.primary : "#f4f3f4"}
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Support</Text>

                    {renderSettingItem(
                        <HelpCircle size={22} color={colors.primary} />,
                        "Help & Support",
                        undefined,
                        () => Alert.alert("Help", "Help center coming soon!")
                    )}

                    {renderSettingItem(
                        <Info size={22} color={colors.primary} />,
                        "About",
                        undefined,
                        () => Alert.alert("About", "TableServe v1.0.0\nRestaurant Management System")
                    )}
                </View>

                <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card }]} onPress={handleLogout}>
                    <LogOut size={20} color="#e74c3c" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={[styles.versionText, { color: colors.textLight }]}>Version 1.0.0</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileSection: {
        marginBottom: 16,
        overflow: 'hidden',
    },
    profileGradient: {
        padding: 20,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'relative',
        marginRight: 16,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#fff',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    editButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsSection: {
        flexDirection: 'row',
        paddingVertical: 20,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
    },
    section: {
        marginBottom: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '500',
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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTitle: {
        flex: 1,
        fontSize: 16,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 12,
        marginBottom: 20,
    },
});

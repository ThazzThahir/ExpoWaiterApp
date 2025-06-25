
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
    Sun,
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
    const { colors, isDark, toggleTheme } = useAppTheme();
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

    const styles = createStyles(colors);

    const SettingItem = ({ 
        icon, 
        title, 
        subtitle, 
        onPress, 
        rightComponent,
        isLast = false 
    }: {
        icon: React.ReactNode;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        rightComponent?: React.ReactNode;
        isLast?: boolean;
    }) => (
        <TouchableOpacity 
            style={[styles.settingItem, isLast && styles.lastItem]} 
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    {icon}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.settingRight}>
                {rightComponent || <ChevronRight size={20} color={colors.textLight} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.section}>
                    <View style={styles.profileCard}>
                        <View style={styles.profileInfo}>
                            <View style={styles.avatar}>
                                <User size={32} color={colors.primary} />
                            </View>
                            <View style={styles.profileText}>
                                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                                <Text style={styles.profileRole}>{user?.role || 'staff'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.settingsCard}>
                        <SettingItem
                            icon={<Bell size={20} color={colors.textLight} />}
                            title="Notifications"
                            subtitle="Receive order updates"
                            rightComponent={
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{ false: colors.border, true: colors.primary }}
                                    thumbColor={notifications ? '#fff' : colors.textLight}
                                />
                            }
                        />
                        <SettingItem
                            icon={isDark ? <Sun size={20} color={colors.textLight} /> : <Moon size={20} color={colors.textLight} />}
                            title="Dark Mode"
                            subtitle={`Currently ${isDark ? 'enabled' : 'disabled'}`}
                            onPress={toggleTheme}
                            rightComponent={
                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: colors.border, true: colors.primary }}
                                    thumbColor={isDark ? '#fff' : colors.textLight}
                                />
                            }
                            isLast
                        />
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.settingsCard}>
                        <SettingItem
                            icon={<HelpCircle size={20} color={colors.textLight} />}
                            title="Help Center"
                            subtitle="Get help and support"
                            onPress={() => {}}
                        />
                        <SettingItem
                            icon={<Info size={20} color={colors.textLight} />}
                            title="About"
                            subtitle="Version 1.0.0"
                            onPress={() => {}}
                            isLast
                        />
                    </View>
                </View>

                {/* Logout Section */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <LogOut size={20} color={colors.error} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
        marginLeft: 4,
    },
    profileCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileText: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    profileRole: {
        fontSize: 14,
        color: colors.textLight,
        textTransform: 'capitalize',
    },
    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    editButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    settingsCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 14,
        color: colors.textLight,
    },
    settingRight: {
        marginLeft: 8,
    },
    logoutButton: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.error,
        marginLeft: 8,
    },
});

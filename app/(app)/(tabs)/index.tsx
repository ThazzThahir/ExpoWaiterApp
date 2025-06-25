import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Users, Clock, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TableCard } from '@/components/tables/TableCard';
import { useTableStore } from '@/store/tableStore';
import { useOrderStore } from '@/store/orderStore';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import { Table } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 2 columns with proper spacing

export default function HomeScreen() {
    const router = useRouter();
    const { tables, isLoading, fetchTables } = useTableStore();
    const { orders, getActiveOrders } = useOrderStore();
    const { mode: themeMode } = useThemeStore();
    const colors = getColors(themeMode === 'dark');

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchTables();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchTables();
        setRefreshing(false);
    };

    const handleTablePress = (tableId: string) => {
        console.log(`Table ${tableId} pressed`);
        // Future: Navigate to table details
    };

    // Calculate stats
    const vacantTables = tables.filter(table => table.status === 'vacant').length;
    const occupiedTables = tables.filter(table => table.status === 'occupied').length;
    const reservedTables = tables.filter(table => table.status === 'reserved').length;
    const activeOrders = getActiveOrders().length;

    const renderTableCard = ({ item }: { item: Table }) => (
        <View style={styles.tableCardContainer}>
            <TableCard table={item} onPress={handleTablePress} />
        </View>
    );

    const renderStatsCard = (title: string, value: number, icon: React.ReactNode, gradientColors: string[]) => (
        <View style={styles.statCard}>
            <LinearGradient colors={gradientColors} style={styles.statGradient}>
                <View style={styles.statContent}>
                    <View style={styles.statIcon}>
                        {icon}
                    </View>
                    <View style={styles.statInfo}>
                        <Text style={styles.statValue}>{value}</Text>
                        <Text style={styles.statTitle}>{title}</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome Back!</Text>
                    <Text style={[styles.subtitleText, { color: colors.textLight }]}>
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                    <Plus size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                {renderStatsCard('Vacant', vacantTables, <Users size={20} color="#fff" />, ['#2ecc71', '#27ae60'])}
                {renderStatsCard('Occupied', occupiedTables, <Clock size={20} color="#fff" />, ['#e74c3c', '#c0392b'])}
                {renderStatsCard('Reserved', reservedTables, <Users size={20} color="#fff" />, ['#f39c12', '#e67e22'])}
                {renderStatsCard('Orders', activeOrders, <TrendingUp size={20} color="#fff" />, ['#3498db', '#2980b9'])}
            </View>

            {/* Tables Section */}
            <View style={styles.tablesSection}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Tables Overview</Text>
                    <TouchableOpacity>
                        <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                    </TouchableOpacity>
                </View>

                {isLoading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={tables}
                        renderItem={renderTableCard}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.tablesList}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                colors={[colors.primary]}
                                tintColor={colors.primary}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 14,
    },
    addButton: {
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statGradient: {
        padding: 16,
        minHeight: 80,
    },
    statContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statIcon: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statInfo: {
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    statTitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    tablesSection: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tablesList: {
        paddingBottom: 20,
    },
    tableCardContainer: {
        width: CARD_WIDTH,
        marginHorizontal: 6,
        marginVertical: 6,
    },
});
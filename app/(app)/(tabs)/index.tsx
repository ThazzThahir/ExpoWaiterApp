import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Filter } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { TableCard } from '@/components/tables/TableCard';
import { useTableStore } from '@/store/tableStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';
import { TableStatus } from '@/types';

export default function TablesScreen() {
    const router = useRouter();
    const { tables, isLoading, fetchTables, filterTables, updateTableStatus } = useTableStore();
    const { setTableInfo } = useCartStore();
    const { user } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<TableStatus | null>(null);

    useEffect(() => {
        fetchTables();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchTables();
        setRefreshing(false);
    };

    const handleTablePress = (tableId: string) => {
        const table = tables.find(t => t.id === tableId);
        if (!table) return;

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Show options based on table status
        const options = [];

        if (table.status === 'vacant') {
            options.push({
                text: 'Create Order',
                onPress: () => {
                    setTableInfo(tableId, table.number);
                    router.push('/(app)/(tabs)/menu');
                }
            });
            options.push({
                text: 'Cancel',
                style: 'cancel' as const
            });
        } else if (table.status === 'occupied') {
            options.push({
                text: 'Free Table',
                onPress: () => {
                    updateTableStatus(tableId, 'vacant');
                    Alert.alert('Success', `Table ${table.number} has been freed.`);
                }
            });
            options.push({
                text: 'Create Order',
                onPress: () => {
                    setTableInfo(tableId, table.number);
                    router.push('/(app)/(tabs)/menu');
                }
            });
            options.push({
                text: 'Cancel',
                style: 'cancel' as const
            });
        }

        Alert.alert(
            `Table ${table.number}`,
            `Status: ${table.status.charAt(0).toUpperCase() + table.status.slice(1)}`,
            options
        );
    };

    const handleFilterPress = (status: TableStatus | null) => {
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }
        setActiveFilter(status === activeFilter ? null : status);
    };

    const filteredTables = activeFilter ? filterTables(activeFilter) : tables;

    const renderFilterButton = (status: TableStatus | null, label: string) => {
        const isActive = status === activeFilter;

        return (
            <TouchableOpacity
                style={[
                    styles.filterButton,
                    isActive && { backgroundColor: status ? getStatusColor(status) : colors.primary }
                ]}
                onPress={() => handleFilterPress(status)}
            >
                <Text style={[
                    styles.filterButtonText,
                    isActive && { color: '#fff' }
                ]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    const getStatusColor = (status: TableStatus) => {
        switch (status) {
            case 'vacant':
                return colors.vacant;
            case 'occupied':
                return colors.occupied;
            default:
                return colors.vacant;
        }
    };

    return (
        <View style={styles.container}>
            {/* Restaurant Name at the top */}
            <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>UR’s Dine & Serve</Text>
            </View>
            <View style={styles.headerRow}>
                <View style={styles.filterContainer}>
                    <Filter size={18} color={colors.textLight} style={styles.filterIcon} />
                    <View style={styles.filterButtons}>
                        {renderFilterButton(null, 'All')}
                        {renderFilterButton('vacant', 'Vacant')}
                        {renderFilterButton('occupied', 'Occupied')}
                    </View>
                </View>
                <View style={styles.waiterNameContainer}>
                    <Text style={styles.waiterNameLabel}>
                        Waiter Name: <Text style={styles.waiterName}>{user?.username || '-'}</Text>
                    </Text>
                </View>
            </View>

            {isLoading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredTables}
                    renderItem={({ item }) => (
                        <TableCard table={item} onPress={handleTablePress} />
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.tableGrid}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {activeFilter
                                    ? `No ${activeFilter} tables found`
                                    : 'No tables found'}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    restaurantHeader: {
        paddingTop: 10,
        // paddingBottom: 8,
        backgroundColor: colors.card,
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: colors.border,
    },
    restaurantName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primaryDark,
        letterSpacing: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8, // reduced from 16
        paddingVertical: 4,   // reduced from 10
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    waiterNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,  
        marginTop : 6,      // add margin to bring closer to filter
        flexShrink: 0,
    },
    waiterNameLabel: {
        fontSize: 14,         // reduced from 14
        color: colors.textLight,
    },
    waiterName: {
        fontWeight: 'bold',
        color: colors.primaryDark,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.card,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop : 6,
        flexShrink: 1,
    },
    filterIcon: {
        marginRight: 4, // reduced from 8
    },
    filterButtons: {
        flexDirection: 'row',
        flex: 1,
    },
    filterButton: {
        paddingHorizontal: 8, // reduced from 12
        paddingVertical: 4,   // reduced from 6
        borderRadius: 12,     // reduced from 16
        backgroundColor: colors.border,
        marginRight: 4,       // reduced from 8
    },
    filterButtonText: {
        fontSize: 11,         // reduced from 12
        fontWeight: '500',
        color: colors.text,
    },
    tableGrid: {
        padding: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textLight,
        fontSize: 16,
    },
});
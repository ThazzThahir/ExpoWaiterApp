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
import { Filter, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { TableCard } from '@/components/tables/TableCard';
import { useTableStore } from '@/store/tableStore';
import { useCartStore } from '@/store/cartStore';
import { colors } from '@/constants/colors';
import { TableStatus } from '@/types';

export default function TablesScreen() {
    const router = useRouter();
    const { tables, isLoading, fetchTables, filterTables, updateTableStatus } = useTableStore();
    const { setTableInfo } = useCartStore();
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
                text: 'Reserve Table',
                onPress: () => {
                    updateTableStatus(tableId, 'reserved', 2);
                    Alert.alert('Success', `Table ${table.number} has been reserved.`);
                }
            });
            options.push({
                text: 'Occupy Table',
                onPress: () => {
                    updateTableStatus(tableId, 'occupied', 2);
                    Alert.alert('Success', `Table ${table.number} has been occupied.`);
                }
            });
        } else if (table.status === 'reserved') {
            options.push({
                text: 'Cancel Reservation',
                onPress: () => {
                    updateTableStatus(tableId, 'vacant');
                    Alert.alert('Success', `Reservation for Table ${table.number} has been cancelled.`);
                }
            });
            options.push({
                text: 'Occupy Table',
                onPress: () => {
                    updateTableStatus(tableId, 'occupied', table.guestCount);
                    Alert.alert('Success', `Table ${table.number} has been occupied.`);
                }
            });
        } else if (table.status === 'occupied') {
            options.push({
                text: 'Free Table',
                onPress: () => {
                    updateTableStatus(tableId, 'vacant');
                    Alert.alert('Success', `Table ${table.number} has been freed.`);
                }
            });
        }

        // Add option to create order for this table
        options.push({
            text: 'Create Order',
            onPress: () => {
                // Set table info in cart store
                setTableInfo(tableId, table.number);
                // Navigate to menu
                router.push('/(app)/(tabs)/menu');
            }
        });

        // Add cancel option
        options.push({
            text: 'Cancel',
            style: 'cancel' as const
        });

        // Show action sheet
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
            case 'reserved':
                return colors.reserved;
            case 'occupied':
                return colors.occupied;
            default:
                return colors.vacant;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tables</Text>
                <View style={styles.filterContainer}>
                    <Filter size={18} color={colors.textLight} style={styles.filterIcon} />
                    <View style={styles.filterButtons}>
                        {renderFilterButton(null, 'All')}
                        {renderFilterButton('vacant', 'Vacant')}
                        {renderFilterButton('reserved', 'Reserved')}
                        {renderFilterButton('occupied', 'Occupied')}
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

            <TouchableOpacity style={styles.fab}>
                <Plus size={24} color="#fff" />
            </TouchableOpacity>
        </View>
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
        marginBottom: 12,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterIcon: {
        marginRight: 8,
    },
    filterButtons: {
        flexDirection: 'row',
        flex: 1,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: colors.border,
        marginRight: 8,
    },
    filterButtonText: {
        fontSize: 12,
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
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
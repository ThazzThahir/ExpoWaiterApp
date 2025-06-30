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
    Modal,
    TextInput,
    Button,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, Settings } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { TableCard } from '@/components/tables/TableCard';
import { useTableStore } from '@/store/tableStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { colors } from '@/constants/colors';
import { Table, Order, TableStatus } from '@/types';

export default function TablesScreen() {
    const router = useRouter();
    const { tables, isLoading, fetchTables, filterTables, updateTableStatus } = useTableStore();
    const { setTableInfo } = useCartStore();
    const { user } = useAuthStore();
    const { getOrdersByTableId } = useOrderStore();
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<TableStatus | null>(null);

    // Modal state for order creation
    const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
    const [modalTable, setModalTable] = useState<Table | null>(null);
    const [guestName, setGuestName] = useState('');
    const [guestCount, setGuestCount] = useState('1');

    // Modal state for occupied table details
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const [orderTable, setOrderTable] = useState<Table | null>(null);

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

        // For both vacant and occupied tables, show create order modal
        setModalTable(table);
        setGuestName('');
        setGuestCount('1');
        setShowCreateOrderModal(true);
    };

    // Handle create order submit for vacant table
    const handleCreateOrderSubmit = () => {
        if (!modalTable || !guestName.trim() || !guestCount.trim()) {
            Alert.alert("Required Fields", "Please enter guest name and number of guests.");
            return;
        }

        const numGuests = parseInt(guestCount, 10);
        if (isNaN(numGuests) || numGuests < 1) {
            Alert.alert("Invalid Input", "Please enter a valid number of guests.");
            return;
        }

        setTableInfo(modalTable.id, modalTable.number, guestName, numGuests);

        // Update table status to occupied with guest count
        if (modalTable.status === 'vacant') {
            updateTableStatus(modalTable.id, 'occupied', numGuests);
        }

        setShowCreateOrderModal(false);
        router.push('/(app)/(tabs)/menu');
    };

    // Handle create additional order for occupied table
    const handleCreateAdditionalOrder = () => {
        if (!orderTable) return;
        setModalTable(orderTable);
        setGuestName('');
        setGuestCount('1');
        setShowOrderDetailsModal(false);
        setShowCreateOrderModal(true);
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
            {/* Restaurant Name and Settings Icon at the top */}
            <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>UR’s Dine & Serve</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => router.push('/(app)/(tabs)/settings')}
                >
                    <Settings size={23} color="grey" />
                </TouchableOpacity>
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
            {/* Modal for Create Order (Both Vacant and Occupied Tables) */}
            <Modal
                visible={showCreateOrderModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCreateOrderModal(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '80%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>
                            {modalTable?.status === 'vacant' ? 'Create Order' : 'Create Additional Order'}
                        </Text>
                        <Text style={{ fontSize: 16, marginBottom: 16 }}>Table {modalTable?.number}</Text>

                        <TextInput
                            placeholder="Guest Name"
                            value={guestName}
                            onChangeText={setGuestName}
                            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 12 }}
                        />
                        <TextInput
                            placeholder="Number of Guests"
                            value={guestCount}
                            onChangeText={setGuestCount}
                            keyboardType="numeric"
                            style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, marginBottom: 12 }}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button title="Cancel" onPress={() => setShowCreateOrderModal(false)} />
                            <View style={{ width: 12 }} />
                            <Button
                                title="Create Order"
                                onPress={handleCreateOrderSubmit}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal for Order Details (Occupied Table) */}
            <Modal
                visible={showOrderDetailsModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowOrderDetailsModal(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '90%', maxHeight: '80%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Table {orderTable?.number} - Orders</Text>
                        <ScrollView style={{ maxHeight: 250 }}>
                            {/* Show order details for this table */}
                            {orderTable && getOrdersByTableId(orderTable.id).length > 0 ? (
                                getOrdersByTableId(orderTable.id).map((order: Order, idx: number) => (
                                    <View key={order.id} style={{ marginBottom: 12, borderBottomWidth: 1, borderColor: colors.border, paddingBottom: 8 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Order #{order.id}</Text>
                                        <Text>Status: {order.status}</Text>
                                        {/* Add more order details as needed */}
                                    </View>
                                ))
                            ) : (
                                <Text>No orders found for this table.</Text>
                            )}
                        </ScrollView>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                            <Button title="View Orders" onPress={() => {
                                setShowOrderDetailsModal(false);
                                router.push('/(app)/(tabs)/orders');
                            }} />
                            <View style={{ width: 8 }} />
                            <Button title="Create Order" onPress={handleCreateAdditionalOrder} />
                            <View style={{ width: 8 }} />
                            <Button title="Cancel" onPress={() => setShowOrderDetailsModal(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: colors.card,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    restaurantName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primaryDark,
        letterSpacing: 1,
        marginLeft: 85,
    },
    settingsButton: {
        padding: 8,
        position: 'absolute',
        right: 12,
        top: 5,
        zIndex: 10,
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
        marginTop: 6,      // add margin to bring closer to filter
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
        marginTop: 6,
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
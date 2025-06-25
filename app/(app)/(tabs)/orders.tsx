import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { OrderCard } from '@/components/orders/OrderCard';
import { useOrderStore } from '@/store/orderStore';
import { useAppTheme } from '@/components/common/AppThemeProvider';
import { OrderStatus } from '@/types';

export default function OrdersScreen() {
    const { colors } = useAppTheme();
    const { orders, isLoading, fetchOrders, getActiveOrders, getCompletedOrders } = useOrderStore();
    const router = useRouter();

    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const handleOrderPress = (orderId: string) => {
        console.log(`Order ${orderId} pressed`);
    };

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        useOrderStore.getState().updateOrderStatus(orderId, status);
    };

    const displayedOrders = activeTab === 'active'
        ? getActiveOrders()
        : getCompletedOrders();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'active' && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'active' ? '#fff' : colors.textLight }
                    ]}>
                        Active Orders
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'completed' && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setActiveTab('completed')}
                >
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'completed' ? '#fff' : colors.textLight }
                    ]}>
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            )}

            <FlatList
                data={displayedOrders}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={handleOrderPress}
                        onStatusChange={handleStatusChange}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.ordersList}
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
                        <Text style={[styles.emptyText, { color: colors.textLight }]}>
                            No {activeTab} orders found
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
                <Plus size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ordersList: {
        padding: 16,
        paddingBottom: 80,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
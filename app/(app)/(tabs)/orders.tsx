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
import { colors } from '@/constants/colors';
import { OrderStatus } from '@/types';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function OrdersScreen() {
    const { orders, updateOrderStatus } = useOrderStore();
    const { colors } = useAppTheme();

    const router = useRouter();
    const {
        isLoading,
        fetchOrders,
        getActiveOrders,
        getCompletedOrders,
        updateOrderStatus
    } = useOrderStore();

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
        // Navigate to order detail screen
        console.log(`Order ${orderId} pressed`);
        // router.push(`/orders/${orderId}`);
    };

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        updateOrderStatus(orderId, status);
    };

    const displayedOrders = activeTab === 'active'
        ? getActiveOrders()
        : getCompletedOrders();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.text }]}>Orders</Text>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'active' && styles.activeTab
                        ]}
                        onPress={() => setActiveTab('active')}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'active' && styles.activeTabText
                        ]}>
                            Active Orders
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'completed' && styles.activeTab
                        ]}
                        onPress={() => setActiveTab('completed')}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'completed' && styles.activeTabText
                        ]}>
                            Completed Orders
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
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
                            <Text style={[styles.emptyText, {color: colors.textLight}]}>
                                No {activeTab} orders found
                            </Text>
                        </View>
                    }
                />
            )}

            {activeTab === 'active' && (
                <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
                    <Plus size={24} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 0,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabText: {
    },
    ordersList: {
        padding: 16,
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
        fontSize: 16,
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
        shadowRadius: 3.84,
    },
});
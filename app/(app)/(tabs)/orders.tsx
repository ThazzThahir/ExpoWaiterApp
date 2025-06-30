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
import { OrderCard } from '@/components/orders/OrderCard';
import { useOrderStore } from '@/store/orderStore';
import { colors } from '@/constants/colors';
import { OrderStatus } from '@/types';

export default function OrdersScreen() {
    const router = useRouter();
    const {
        orders,
        isLoading,
        fetchOrders,
        getActiveOrders,
        updateOrderStatus
    } = useOrderStore();

    const [refreshing, setRefreshing] = useState(false);

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

    const displayedOrders = getActiveOrders();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Orders</Text>
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
                            <Text style={styles.emptyText}>
                                No active orders found
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
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 0,
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
        color: colors.textLight,
        fontSize: 16,
    },
});
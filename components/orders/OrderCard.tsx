import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Users, ShoppingBag, DollarSign, Printer } from 'lucide-react-native';
import { Order } from '@/types';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/validation';
import { OrderDetailModal } from './OrderDetailModal';

interface OrderCardProps {
    order: Order;
    onPress: (orderId: string) => void;
    onStatusChange: (orderId: string, status: 'preparing' | 'serving' | 'completed') => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
    order,
    onPress,
    onStatusChange,
}) => {
    const getProgressPercentage = () => {
        switch (order.status) {
            case 'preparing':
                return '33%';
            case 'serving':
                return '66%';
            case 'completed':
                return '100%';
            default:
                return '0%';
        }
    };

    const getNextStatus = () => {
        switch (order.status) {
            case 'preparing':
                return 'serving';
            case 'serving':
                return 'completed';
            default:
                return order.status;
        }
    };

    const handleStatusChange = () => {
        if (order.status !== 'completed') {
            const nextStatus = getNextStatus();
            const updateStatus = () => {
                setOrderState({ ...orderState, status: nextStatus });
                onStatusChange(order.id, nextStatus);
            };
            if (nextStatus === 'completed') {
                // Show confirmation before completing
                Alert.alert(
                    'Confirm Completion',
                    'Are you sure you want to mark this order as Completed?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Yes, Complete Order', style: 'destructive', onPress: updateStatus },
                    ]
                );
            } else if (nextStatus === 'serving') {
                // Show confirmation before serving
                Alert.alert(
                    'Confirm Serve',
                    'Are you sure you want to mark this order as Serving?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Yes, Mark as Serving', style: 'default', onPress: updateStatus },
                    ]
                );
            } else {
                updateStatus();
            }
        }
    };

    const [modalVisible, setModalVisible] = React.useState(false);
    const [orderState, setOrderState] = React.useState(order);

    // Handler for status change
    const handleChangeStatus = (status: 'preparing' | 'serving' | 'completed') => {
        setOrderState({ ...orderState, status });
        onStatusChange(order.id, status);
    };
    // Handler for cancel order
    const handleCancelOrder = () => {
        // Optionally, call a prop or store action
    };
    // Handler for cancel item
    const handleCancelItem = (itemId: string) => {
        setOrderState({
            ...orderState,
            items: orderState.items.filter(item => item.id !== itemId)
        });
    };

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.orderId}>{order.id}</Text>
                        <Text style={styles.timestamp}>{formatDate(order.createdAt)}</Text>
                    </View>
                    <View style={styles.tableInfo}>
                        <Text style={styles.tableNumber}>T{order.tableNumber}</Text>
                        <View style={styles.guestInfo}>
                            <Users size={14} color={colors.textLight} />
                            <Text style={styles.guestCount}>{order.guestCount}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <ShoppingBag size={16} color={colors.textLight} />
                            <Text style={styles.infoText}>{order.items.length} items</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <DollarSign size={16} color={colors.textLight} />
                            <Text style={styles.infoText}>{formatCurrency(order.total)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actions}>
                    {order.status === 'completed' && (
                        <TouchableOpacity style={styles.actionButton}>
                            <Printer size={18} color={colors.primary} />
                            <Text style={styles.actionText}>Print</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
            <OrderDetailModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                order={orderState}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    timestamp: {
        fontSize: 14,
        color: colors.textLight,
        marginTop: 2,
    },
    tableInfo: {
        alignItems: 'flex-end',
    },
    tableNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    guestInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    guestCount: {
        fontSize: 14,
        color: colors.textLight,
        marginLeft: 4,
    },
    content: {
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    infoText: {
        marginLeft: 6,
        color: colors.textLight,
        fontSize: 14,
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBackground: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    statusLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    statusLabel: {
        fontSize: 12,
        color: colors.textLight,
    },
    activeStatus: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginLeft: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 14,
        color: colors.primary,
    },
    completeButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    completeText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#fff',
    },
});
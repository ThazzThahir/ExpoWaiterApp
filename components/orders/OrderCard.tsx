import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { 
    Clock, 
    Users, 
    ShoppingBag, 
    DollarSign,
    CheckCircle,
    ChefHat,
    Truck,
    Edit3,
    Printer
} from 'lucide-react-native';
import { Order } from '@/types';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/validation';

interface OrderCardProps {
    order: Order;
    onPress: (orderId: string) => void;
    onStatusChange: (orderId: string, status: 'preparing' | 'serving' | 'completed') => void;
    onModify?: (orderId: string) => void;
    onPrint?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ 
    order, 
    onPress, 
    onStatusChange,
    onModify,
    onPrint
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
            onStatusChange(order.id, getNextStatus());
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(order.id)}
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

                <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: getProgressPercentage() }
                            ]}
                        />
                    </View>
                    <View style={styles.statusLabels}>
                        <Text style={[
                            styles.statusLabel,
                            order.status === 'preparing' && styles.activeStatus
                        ]}>
                            Preparing
                        </Text>
                        <Text style={[
                            styles.statusLabel,
                            order.status === 'serving' && styles.activeStatus
                        ]}>
                            Serving
                        </Text>
                        <Text style={[
                            styles.statusLabel,
                            order.status === 'completed' && styles.activeStatus
                        ]}>
                            Completed
                        </Text>
                    </View>
                </View>
            </View>

                {/* Action Buttons */}
                {order.status !== 'completed' && (
                    <View style={styles.actionButtons}>
                        {onModify && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.modifyButton]}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onModify(order.id);
                                }}
                            >
                                <Edit3 size={14} color="#3498db" />
                                <Text style={styles.modifyButtonText}>Modify</Text>
                            </TouchableOpacity>
                        )}

                        {onPrint && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.printButton]}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onPrint(order.id);
                                }}
                            >
                                <Printer size={14} color="#27ae60" />
                                <Text style={styles.printButtonText}>Print</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
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
    statusButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    statusButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        gap: 6,
    },
    modifyButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#3498db',
    },
    printButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#27ae60',
    },
    modifyButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#3498db',
    },
    printButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#27ae60',
    },
});
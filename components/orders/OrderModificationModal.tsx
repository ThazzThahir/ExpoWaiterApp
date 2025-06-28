import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Order, OrderItem, OrderStatus } from '@/types';
import { colors } from '@/constants/colors';

interface OrderModificationModalProps {
    visible: boolean;
    onClose: () => void;
    order: Order | null;
    onChangeStatus: (status: OrderStatus) => void;
    onCancelOrder: () => void;
    onCancelItem: (itemId: string) => void;
    showStatusChangeOption?: boolean; // NEW PROP
}

export const OrderModificationModal: React.FC<OrderModificationModalProps> = ({
    visible,
    onClose,
    order,
    onChangeStatus,
    onCancelOrder,
    onCancelItem,
    showStatusChangeOption = false, // NEW PROP
}) => {
    if (!order) return null;

    const statusOptions: OrderStatus[] = ['preparing', 'serving', 'completed'];

    const handleStatusChangeWithConfirmation = (status: OrderStatus) => {
        if (status === 'completed') {
            Alert.alert(
                'Confirm Completion',
                'Are you sure you want to mark this order as Completed?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes, Complete Order', style: 'destructive', onPress: () => onChangeStatus(status) },
                ]
            );
        } else if ((status === 'serving' || status === 'preparing') && order.status === 'completed') {
            Alert.alert(
                'Move to Active Orders',
                'Are you sure you want to move this order to Active Orders?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes, Move to Active Orders', style: 'default', onPress: () => onChangeStatus(status) },
                ]
            );
        } else if (status === 'serving') {
            Alert.alert(
                'Confirm Serving',
                'Are you sure you want to mark this order as Serving?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes, Mark as Serving', style: 'default', onPress: () => onChangeStatus(status) },
                ]
            );
        } else if (status === 'preparing' && order.status !== 'preparing') {
            Alert.alert(
                'Confirm Preparing',
                'Are you sure you want to mark this order as Preparing?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes, Mark as Preparing', style: 'default', onPress: () => onChangeStatus(status) },
                ]
            );
        } else {
            onChangeStatus(status);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Modify Order</Text>
                    <ScrollView>
                        {showStatusChangeOption && (
                            <>
                                <Text style={styles.sectionTitle}>Change Status</Text>
                                <View style={styles.statusRow}>
                                    {statusOptions.map((status) => (
                                        <TouchableOpacity
                                            key={status}
                                            style={[
                                                styles.statusButton,
                                                order.status === status && styles.statusButtonActive,
                                            ]}
                                            onPress={() => handleStatusChangeWithConfirmation(status)}
                                        >
                                            <Text style={order.status === status ? styles.statusTextActive : styles.statusText}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        <Text style={styles.sectionTitle}>Order Items</Text>
                        {order.items.map((item) => (
                            <View key={item.id} style={styles.itemRow}>
                                <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
                                <TouchableOpacity
                                    style={styles.cancelItemButton}
                                    onPress={() => {
                                        Alert.alert('Cancel Item', `Remove ${item.name} from order?`, [
                                            { text: 'No', style: 'cancel' },
                                            { text: 'Yes', style: 'destructive', onPress: () => onCancelItem(item.id) },
                                        ]);
                                    }}
                                >
                                    <Text style={styles.cancelItemText}>Cancel Item</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <Text style={styles.sectionTitle}>Other Actions</Text>
                        <TouchableOpacity style={styles.cancelOrderButton} onPress={() => {
                            Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
                                { text: 'No', style: 'cancel' },
                                { text: 'Yes', style: 'destructive', onPress: onCancelOrder },
                            ]);
                        }}>
                            <Text style={styles.cancelOrderText}>Cancel Order</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '90%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: colors.text,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 6,
        color: colors.text,
    },
    statusRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    statusButton: {
        backgroundColor: colors.border,
        borderRadius: 8,
        padding: 10,
        marginRight: 8,
    },
    statusButtonActive: {
        backgroundColor: colors.primary,
    },
    statusText: {
        color: colors.text,
        fontWeight: 'bold',
    },
    statusTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingLeft: 8,
    },
    itemName: {
        fontSize: 15,
        color: colors.text,
    },
    cancelItemButton: {
        backgroundColor: colors.border,
        borderRadius: 8,
        padding: 6,
        marginLeft: 8,
    },
    cancelItemText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    cancelOrderButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    cancelOrderText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: colors.border,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

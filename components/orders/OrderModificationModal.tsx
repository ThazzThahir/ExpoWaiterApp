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

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Modify Order</Text>
                    <Text style={styles.guestInfo}>Guest: {order.guestName} ({order.guestCount})</Text>
                    <ScrollView>
                        <Text style={styles.sectionTitle}>Order Items</Text>
                        {order.items.map((item) => (
                            <View key={item.id} style={styles.itemRow}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <TouchableOpacity onPress={() => onCancelItem(item.id)}>
                                    <Text style={styles.cancelItem}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.cancelOrderButton} onPress={onCancelOrder}>
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
    guestInfo: {
        fontSize: 16,
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
    cancelItem: {
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

import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Order } from '@/types';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/validation';

interface OrderDetailModalProps {
    visible: boolean;
    onClose: () => void;
    order: Order | null;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, onClose, order }) => {
    if (!order) return null;
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Order Details</Text>
                    <ScrollView>
                        <Text style={styles.label}>Order ID: <Text style={styles.value}>{order.id}</Text></Text>
                        <Text style={styles.label}>Table: <Text style={styles.value}>T{order.tableNumber}</Text></Text>
                        <Text style={styles.label}>Guest Name: <Text style={styles.value}>{order.guestName}</Text></Text>
                        <Text style={styles.label}>Guests: <Text style={styles.value}>{order.guestCount}</Text></Text>
                        <Text style={styles.label}>Status: <Text style={styles.value}>{order.status}</Text></Text>
                        <Text style={styles.label}>Created: <Text style={styles.value}>{formatDate(order.createdAt)}</Text></Text>
                        <Text style={styles.label}>Updated: <Text style={styles.value}>{formatDate(order.updatedAt)}</Text></Text>
                        <Text style={styles.label}>Total: <Text style={styles.value}>{formatCurrency(order.total)}</Text></Text>
                        <Text style={styles.sectionTitle}>Items:</Text>
                        {order.items.map((item, idx) => (
                            <View key={item.id || idx} style={styles.itemRow}>
                                <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
                                <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                                {item.notes ? <Text style={styles.itemNotes}>Note: {item.notes}</Text> : null}
                            </View>
                        ))}
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
    label: {
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 4,
    },
    value: {
        fontWeight: 'normal',
        color: colors.textLight,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 6,
        color: colors.text,
    },
    itemRow: {
        marginBottom: 8,
        paddingLeft: 8,
    },
    itemName: {
        fontSize: 15,
        color: colors.text,
    },
    itemPrice: {
        fontSize: 14,
        color: colors.textLight,
    },
    itemNotes: {
        fontSize: 13,
        color: colors.textLight,
        fontStyle: 'italic',
    },
    closeButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

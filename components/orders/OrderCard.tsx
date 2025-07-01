import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Users, ShoppingBag, DollarSign, Printer, Edit, ReceiptText } from 'lucide-react-native';
import { Order } from '@/types';
import { colors } from '@/constants/colors';
import { formatCurrency, formatDate } from '@/utils/validation';

interface OrderCardProps {
    order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    // Local state for mock logic
    const [orderState, setOrderState] = useState(order);
    const [isModifyModalVisible, setModifyModalVisible] = useState(false);
    const [isPrintModalVisible, setPrintModalVisible] = useState(false);
    const [editGuestName, setEditGuestName] = useState(order.guestName);
    const [editGuestCount, setEditGuestCount] = useState(String(order.guestCount));
    const [editItems, setEditItems] = useState(order.items.map(item => ({ ...item })));
    const [billRequested, setBillRequested] = useState(false);

    // Handle Modify Save
    const handleSaveEdit = () => {
        setOrderState({
            ...orderState,
            guestName: editGuestName,
            guestCount: Number(editGuestCount),
            items: editItems,
            total: editItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        });
        setModifyModalVisible(false);
    };

    // Handle Request Bill
    const handleRequestBill = () => {
        setBillRequested(true);
        Alert.alert('Bill Requested', 'The bill has been requested for this order.');
    };

    // Handle Print (just open modal)
    const handlePrint = () => {
        setPrintModalVisible(true);
    };

    // Handle item quantity change
    const handleItemQtyChange = (idx: number, qty: string) => {
        const newItems = [...editItems];
        newItems[idx].quantity = Number(qty) || 1;
        setEditItems(newItems);
    };

    return (
        <View style={styles.container}>
            {/* Order Info */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.orderId}>Order #{orderState.id}</Text>
                    <Text style={styles.timestamp}>{formatDate(orderState.createdAt)}</Text>
                </View>
                <View style={styles.tableInfo}>
                    <Text style={styles.tableNumber}>T{orderState.tableNumber}</Text>
                    <View style={styles.guestInfo}>
                        <Users size={14} color={colors.textLight} />
                        <Text style={styles.guestCount}>{orderState.guestCount}</Text>
                    </View>
                    {orderState.guestName ? (
                        <Text style={styles.guestName}>{orderState.guestName}</Text>
                    ) : null}
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <ShoppingBag size={16} color={colors.textLight} />
                        <Text style={styles.infoText}>{orderState.items.length} items</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <DollarSign size={16} color={colors.textLight} />
                        <Text style={styles.infoText}>{formatCurrency(orderState.total)}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 8 }}>
                    {orderState.items.map(item => (
                        <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                            <Text style={{ color: colors.text }}>{item.name} x{item.quantity}</Text>
                            <Text style={{ color: colors.textLight }}>{formatCurrency(item.price * item.quantity)}</Text>
                        </View>
                    ))}
                </View>
            </View>
            {/* Actions */}
            <View style={styles.actions}>
                {!billRequested ? (
                    <>
                        <TouchableOpacity style={styles.actionButton} onPress={() => setModifyModalVisible(true)}>
                            <Edit size={18} color={colors.primary} />
                            <Text style={styles.actionText}>Modify</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.primary }]} onPress={handleRequestBill}>
                            <ReceiptText size={18} color={colors.primary} />
                            <Text style={styles.actionText}>Request Bill</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={[styles.actionButton, { borderColor: colors.success, backgroundColor: '#eaffea' }]}>
                            <Text style={[styles.actionText, { color: colors.success }]}>Bill Requested</Text>
                        </View>
                        <TouchableOpacity style={styles.actionButton} onPress={handlePrint}>
                            <Printer size={18} color={colors.primary} />
                            <Text style={styles.actionText}>Print</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            {/* Modify Modal */}
            <Modal visible={isModifyModalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modify Order</Text>
                        <ScrollView>
                            <Text style={styles.label}>Guest Name</Text>
                            <TextInput
                                style={styles.input}
                                value={editGuestName}
                                onChangeText={setEditGuestName}
                                placeholder="Guest Name"
                                placeholderTextColor={Platform.OS === 'ios' ? '#888' : undefined}
                            />
                            <Text style={styles.label}>Number of Guests</Text>
                            <TextInput
                                style={styles.input}
                                value={editGuestCount}
                                onChangeText={setEditGuestCount}
                                keyboardType="number-pad"
                                placeholder="Guests"
                                placeholderTextColor={Platform.OS === 'ios' ? '#888' : undefined}
                            />
                            <Text style={styles.label}>Order Items</Text>
                            {editItems.map((item, idx) => (
                                <View key={item.id} style={styles.itemEditRow}>
                                    <Text style={{ flex: 1 }}>{item.name}</Text>
                                    <TextInput
                                        style={styles.qtyInput}
                                        value={String(item.quantity)}
                                        onChangeText={qty => handleItemQtyChange(idx, qty)}
                                        keyboardType="number-pad"
                                    />
                                    <Text style={{ marginLeft: 8 }}>{formatCurrency(item.price * item.quantity)}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                            <TouchableOpacity onPress={() => setModifyModalVisible(false)} style={[styles.actionButton, { marginRight: 8 }]}>
                                <Text style={styles.actionText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveEdit} style={[styles.actionButton, { borderColor: colors.primary, backgroundColor: colors.primary }]}>
                                <Text style={[styles.actionText, { color: '#fff' }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
            {/* Print Modal */}
            <Modal visible={isPrintModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bill Preview</Text>
                        <Text style={styles.restaurantName}>Expo Waiter Restaurant</Text>
                        <Text style={styles.label}>Table: T{orderState.tableNumber}</Text>
                        <Text style={styles.label}>Guest: {orderState.guestName} ({orderState.guestCount})</Text>
                        <View style={{ marginVertical: 12 }}>
                            {orderState.items.map(item => (
                                <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Text>{item.name} x{item.quantity}</Text>
                                    <Text>{formatCurrency(item.price * item.quantity)}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.label}>Total: {formatCurrency(orderState.total)}</Text>
                        <Text style={styles.thankYou}>Thank you for dining with us!</Text>
                        <TouchableOpacity onPress={() => setPrintModalVisible(false)} style={[styles.actionButton, { marginTop: 16, alignSelf: 'center' }]}>
                            <Text style={styles.actionText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
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
    guestName: {
        fontSize: 14,
        color: colors.text,
        marginTop: 2,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '90%',
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: colors.text,
        alignSelf: 'center',
    },
    label: {
        fontWeight: 'bold',
        marginTop: 8,
        color: colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 8,
        marginTop: 4,
        marginBottom: 8,
        color: colors.text,
    },
    itemEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    qtyInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 6,
        width: 40,
        padding: 4,
        textAlign: 'center',
        marginLeft: 8,
        color: colors.text,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 8,
        color: colors.primary,
    },
    thankYou: {
        marginTop: 16,
        fontSize: 16,
        color: colors.success,
        alignSelf: 'center',
    },
});
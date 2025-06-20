import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    Animated,
    Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp, Clock, Users, Edit, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { formatCurrency } from '@/utils/validation';

export default function PreviewOrderScreen() {
    const router = useRouter();
    const { cart, clearCart } = useCartStore();
    const { orders } = useOrderStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    // Animate content in
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // Generate a new order ID
    const newOrderId = `ORD-${1000 + orders.length + 1}`;

    // Calculate pricing
    const subtotal = cart.totalAmount;
    const taxRate = 0.05; // 5%
    const tax = subtotal * taxRate;
    const serviceChargeRate = 0.10; // 10%
    const serviceCharge = subtotal * serviceChargeRate;
    const total = subtotal + tax + serviceCharge;

    const toggleNotes = (itemId: string) => {
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }
        setExpandedNotes(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleEditOrder = () => {
        router.back();
    };

    const handleConfirmOrder = () => {
        if (cart.items.length === 0) {
            Alert.alert("Empty Order", "Your order is empty. Add some items before confirming.");
            return;
        }

        if (!cart.tableId) {
            Alert.alert("Table Required", "Please select a table for this order.");
            return;
        }

        setIsSubmitting(true);

        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Simulate order submission with animation
        Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Simulate order submission delay
        setTimeout(() => {
            setIsSubmitting(false);

            // In a real app, you would create an order in the database
            Alert.alert(
                "Order Confirmed",
                "Your order has been sent to the kitchen!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            clearCart();
                            router.push("/(app)/(tabs)");
                        }
                    }
                ]
            );
        }, 1500);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Order Preview",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.headerButton}
                        >
                            <ChevronLeft size={24} color={colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.container}>
                {cart.items.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Your order is empty</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push("/(app)/(tabs)/menu")}
                        >
                            <Text style={styles.browseButtonText}>Browse Menu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <ScrollView style={styles.scrollContainer}>
                            {/* Order Summary Card */}
                            <Animated.View
                                style={[
                                    styles.summaryCard,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }]
                                    }
                                ]}
                            >
                                <View style={styles.summaryRow}>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Table</Text>
                                        <View style={styles.summaryValue}>
                                            <Text style={styles.summaryValueText}>
                                                T-{cart.tableNumber || "?"}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Guests</Text>
                                        <View style={styles.summaryValue}>
                                            <Users size={16} color={colors.textLight} style={styles.summaryIcon} />
                                            <Text style={styles.summaryValueText}>
                                                {cart.tableNumber ? "4" : "?"} Guests
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.summaryRow}>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Order ID</Text>
                                        <View style={styles.summaryValue}>
                                            <Text style={styles.summaryValueText}>
                                                #{newOrderId}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Time</Text>
                                        <View style={styles.summaryValue}>
                                            <Clock size={16} color={colors.textLight} style={styles.summaryIcon} />
                                            <Text style={styles.summaryValueText}>
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>

                            {/* Order Items */}
                            <Animated.View
                                style={[
                                    styles.sectionContainer,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }]
                                    }
                                ]}
                            >
                                <Text style={styles.sectionTitle}>Order Items</Text>

                                {cart.items.map((item, index) => (
                                    <View key={item.id} style={styles.orderItem}>
                                        <View style={styles.itemHeader}>
                                            <View style={styles.itemImageContainer}>
                                                <Image
                                                    source={{ uri: item.menuItem.imageUrl }}
                                                    style={styles.itemImage}
                                                />
                                            </View>

                                            <View style={styles.itemDetails}>
                                                <Text style={styles.itemName}>{item.menuItem.name}</Text>
                                                <Text style={styles.itemQuantity}>
                                                    {item.quantity} × {formatCurrency(item.menuItem.price)}
                                                </Text>
                                            </View>

                                            <Text style={styles.itemTotal}>
                                                {formatCurrency(item.totalPrice)}
                                            </Text>
                                        </View>

                                        {item.modifiers.length > 0 && (
                                            <View style={styles.modifiersContainer}>
                                                {item.modifiers.map((modifier) => (
                                                    <View key={modifier.id} style={styles.modifier}>
                                                        <Text style={styles.modifierText}>
                                                            • {modifier.name}
                                                            {modifier.price > 0 && ` (+${formatCurrency(modifier.price)})`}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}

                                        {item.specialInstructions && (
                                            <View style={styles.notesContainer}>
                                                <TouchableOpacity
                                                    style={styles.notesToggle}
                                                    onPress={() => toggleNotes(item.id)}
                                                >
                                                    <Text style={styles.notesToggleText}>
                                                        {expandedNotes[item.id] ? "Hide Notes" : "Show Notes"}
                                                    </Text>
                                                    {expandedNotes[item.id] ? (
                                                        <ChevronUp size={16} color={colors.primary} />
                                                    ) : (
                                                        <ChevronDown size={16} color={colors.primary} />
                                                    )}
                                                </TouchableOpacity>

                                                {expandedNotes[item.id] && (
                                                    <View style={styles.notesContent}>
                                                        <Text style={styles.notesText}>{item.specialInstructions}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </Animated.View>

                            {/* Price Breakdown */}
                            <Animated.View
                                style={[
                                    styles.priceBreakdown,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }]
                                    }
                                ]}
                            >
                                <Text style={styles.sectionTitle}>Price Breakdown</Text>

                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Subtotal</Text>
                                    <Text style={styles.priceValue}>{formatCurrency(subtotal)}</Text>
                                </View>

                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Tax (5%)</Text>
                                    <Text style={styles.priceValue}>{formatCurrency(tax)}</Text>
                                </View>

                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Service Charge (10%)</Text>
                                    <Text style={styles.priceValue}>{formatCurrency(serviceCharge)}</Text>
                                </View>

                                <View style={[styles.priceRow, styles.totalRow]}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                                </View>
                            </Animated.View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <Animated.View
                            style={[
                                styles.actionContainer,
                                {
                                    opacity: fadeAnim
                                }
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={handleEditOrder}
                                disabled={isSubmitting}
                            >
                                <Edit size={20} color={colors.primary} style={styles.buttonIcon} />
                                <Text style={styles.editButtonText}>Edit Order</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleConfirmOrder}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <CheckCircle size={20} color="#fff" style={styles.buttonIcon} />
                                        <Text style={styles.confirmButtonText}>Confirm & Send to Kitchen</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    </>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerButton: {
        padding: 8,
    },
    scrollContainer: {
        flex: 1,
        paddingBottom: 100, // Space for action buttons
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: colors.textLight,
        marginBottom: 20,
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    summaryCard: {
        backgroundColor: colors.card,
        margin: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryItem: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 4,
    },
    summaryValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryIcon: {
        marginRight: 4,
    },
    summaryValueText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    sectionContainer: {
        backgroundColor: colors.card,
        margin: 16,
        marginTop: 0,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    orderItem: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 12,
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 12,
    },
    itemImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 14,
        color: colors.textLight,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    modifiersContainer: {
        marginLeft: 62,
        marginTop: 8,
    },
    modifier: {
        marginBottom: 4,
    },
    modifierText: {
        fontSize: 14,
        color: colors.textLight,
    },
    notesContainer: {
        marginLeft: 62,
        marginTop: 8,
    },
    notesToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notesToggleText: {
        fontSize: 14,
        color: colors.primary,
        marginRight: 4,
    },
    notesContent: {
        backgroundColor: colors.background,
        padding: 8,
        borderRadius: 4,
        marginTop: 4,
    },
    notesText: {
        fontSize: 14,
        color: colors.textLight,
        fontStyle: 'italic',
    },
    priceBreakdown: {
        backgroundColor: colors.card,
        margin: 16,
        marginTop: 0,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: colors.textLight,
    },
    priceValue: {
        fontSize: 14,
        color: colors.text,
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    actionContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.card,
        padding: 16,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    editButton: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        flexDirection: 'row',
    },
    editButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmButton: {
        flex: 2,
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonIcon: {
        marginRight: 8,
    },
});
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Animated,
    Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Trash2, ChevronLeft, Plus, Minus, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { useTableStore } from '@/store/tableStore';
import { formatCurrency } from '@/utils/validation';

export default function CartScreen() {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
    const { tables, getTableById } = useTableStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [fadeAnims, setFadeAnims] = useState<{ [key: string]: Animated.Value }>({});

    // Initialize animation values for each cart item
    useEffect(() => {
        const newFadeAnims: { [key: string]: Animated.Value } = {};
        cart.items.forEach((item, index) => {
            newFadeAnims[item.id] = new Animated.Value(0);

            // Stagger the animations
            Animated.timing(newFadeAnims[item.id], {
                toValue: 1,
                duration: 300,
                delay: index * 100,
                useNativeDriver: true,
            }).start();
        });
        setFadeAnims(newFadeAnims);
    }, []);

    const handleRemoveItem = (itemId: string) => {
        // Animate item removal
        if (fadeAnims[itemId]) {
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }

            Animated.timing(fadeAnims[itemId], {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                removeFromCart(itemId);
            });
        } else {
            removeFromCart(itemId);
        }
    };

    const handleConfirmRemoveItem = (itemId: string) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from your cart?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    onPress: () => handleRemoveItem(itemId),
                    style: "destructive"
                }
            ]
        );
    };

    const handleClearCart = () => {
        if (cart.items.length === 0) return;

        Alert.alert(
            "Clear Cart",
            "Are you sure you want to clear your cart?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear",
                    onPress: () => {
                        if (Platform.OS !== 'web') {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        }
                        clearCart();
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handlePreviewOrder = () => {
        if (cart.items.length === 0) {
            Alert.alert("Empty Cart", "Your cart is empty. Add some items before proceeding.");
            return;
        }

        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        router.push("/preview-order");
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }
        updateQuantity(itemId, newQuantity);
    };

    const handleSelectTable = () => {
        router.push("/(app)/(tabs)");
    };

    // Get table information if available
    const tableInfo = cart.tableId ? getTableById(cart.tableId) : null;

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Your Cart",
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.headerButton}
                        >
                            <ChevronLeft size={24} color={colors.text} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handleClearCart}
                            style={styles.headerButton}
                            disabled={cart.items.length === 0}
                        >
                            <Trash2 size={20} color={cart.items.length === 0 ? colors.textLight : colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.container}>
                {cart.items.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Your cart is empty</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push("/(app)/(tabs)/menu")}
                        >
                            <Text style={styles.browseButtonText}>Browse Menu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <ScrollView style={styles.itemsContainer}>
                            {cart.items.map((item) => (
                                <Animated.View
                                    key={item.id}
                                    style={[
                                        styles.cartItem,
                                        { opacity: fadeAnims[item.id] || 1 }
                                    ]}
                                >
                                    <View style={styles.itemHeader}>
                                        <Text style={styles.itemName}>{item.menuItem.name}</Text>
                                        <Text style={styles.itemPrice}>{formatCurrency(item.totalPrice)}</Text>
                                    </View>

                                    <View style={styles.itemDetails}>
                                        <View style={styles.quantityContainer}>
                                            <TouchableOpacity
                                                style={styles.quantityButton}
                                                onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            >
                                                <Minus size={16} color={colors.primary} />
                                            </TouchableOpacity>

                                            <Text style={styles.quantityText}>{item.quantity}</Text>

                                            <TouchableOpacity
                                                style={styles.quantityButton}
                                                onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                <Plus size={16} color={colors.primary} />
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.removeButton}
                                            onPress={() => handleConfirmRemoveItem(item.id)}
                                        >
                                            <Trash2 size={16} color={colors.textLight} />
                                        </TouchableOpacity>
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
                                        <View style={styles.specialInstructions}>
                                            <Text style={styles.specialInstructionsText}>
                                                Note: {item.specialInstructions}
                                            </Text>
                                        </View>
                                    )}
                                </Animated.View>
                            ))}

                            <TouchableOpacity
                                style={styles.tableSelection}
                                onPress={handleSelectTable}
                            >
                                <Text style={styles.sectionTitle}>Table Information</Text>
                                {tableInfo ? (
                                    <View style={styles.tableInfoContainer}>
                                        <Text style={styles.tableInfoText}>
                                            Table {tableInfo.number}
                                        </Text>
                                        <Text style={styles.tableStatusText}>
                                            {tableInfo.status.charAt(0).toUpperCase() + tableInfo.status.slice(1)} • {tableInfo.guestCount} Guests
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.selectTableContainer}>
                                        <Text style={styles.selectTableText}>Select a table</Text>
                                        <ArrowLeft size={16} color={colors.primary} style={styles.selectTableIcon} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </ScrollView>

                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Subtotal</Text>
                                <Text style={styles.summaryValue}>{formatCurrency(cart.totalAmount)}</Text>
                            </View>

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Tax (5%)</Text>
                                <Text style={styles.summaryValue}>{formatCurrency(cart.totalAmount * 0.05)}</Text>
                            </View>

                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Service Charge (10%)</Text>
                                <Text style={styles.summaryValue}>{formatCurrency(cart.totalAmount * 0.1)}</Text>
                            </View>

                            <View style={[styles.summaryRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>
                                    {formatCurrency(cart.totalAmount * 1.15)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.checkoutButton}
                                onPress={handlePreviewOrder}
                                disabled={isProcessing || cart.items.length === 0}
                            >
                                {isProcessing ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.checkoutButtonText}>Preview Order</Text>
                                )}
                            </TouchableOpacity>
                        </View>
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
    itemsContainer: {
        flex: 1,
    },
    cartItem: {
        backgroundColor: colors.card,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        marginRight: 8,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
    },
    quantityButton: {
        padding: 6,
    },
    quantityText: {
        paddingHorizontal: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
    },
    removeButton: {
        padding: 8,
    },
    modifiersContainer: {
        marginTop: 4,
    },
    modifier: {
        marginBottom: 4,
    },
    modifierText: {
        fontSize: 14,
        color: colors.textLight,
    },
    specialInstructions: {
        marginTop: 8,
        padding: 8,
        backgroundColor: colors.background,
        borderRadius: 4,
    },
    specialInstructionsText: {
        fontSize: 14,
        color: colors.textLight,
        fontStyle: 'italic',
    },
    tableSelection: {
        backgroundColor: colors.card,
        padding: 16,
        margin: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    tableInfoContainer: {
        marginTop: 4,
    },
    tableInfoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    tableStatusText: {
        fontSize: 14,
        color: colors.textLight,
        marginTop: 4,
    },
    selectTableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    selectTableText: {
        fontSize: 14,
        color: colors.primary,
    },
    selectTableIcon: {
        transform: [{ rotate: '180deg' }],
    },
    summaryContainer: {
        backgroundColor: colors.card,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: colors.textLight,
    },
    summaryValue: {
        fontSize: 14,
        color: colors.text,
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        marginBottom: 16,
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
    checkoutButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
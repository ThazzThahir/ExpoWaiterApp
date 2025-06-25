import React, { useEffect, useState, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Animated,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, Plus, Edit } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { useMenuStore } from '@/store/menuStore';
import { useCartStore } from '@/store/cartStore';
import { QuantitySelector } from '@/components/menu/QuantitySelector';
import { ModifierSelectionSheet } from '@/components/modifiers/ModifierSelectionSheet';
import { formatCurrency } from '@/utils/validation';
import { Modifier } from '@/types/menu';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function MenuItemDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { getMenuItemById, getModifierGroupsForItem } = useMenuStore();
    const { addToCart } = useCartStore();

    const menuItem = getMenuItemById(id);
    const modifierGroups = useMemo(() => getModifierGroupsForItem(id), [id, getModifierGroupsForItem]);

    const [quantity, setQuantity] = useState(1);
    const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModifierSheet, setShowModifierSheet] = useState(false);

    // Animation values
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];

    useEffect(() => {
        // Animate content in
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();

        // Pre-select default modifiers (first option in required groups)
        const defaultModifiers: Modifier[] = [];

        modifierGroups.forEach(group => {
            if (group.required && !group.multiSelect && group.modifiers.length > 0) {
                defaultModifiers.push(group.modifiers[0]);
            }
        });

        setSelectedModifiers(defaultModifiers);
    }, [fadeAnim, slideAnim, modifierGroups]);

    const handleIncreaseQuantity = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setQuantity(prev => Math.min(prev + 1, 99));
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1 && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        setQuantity(prev => Math.max(prev - 1, 1));
    };

    const handleOpenModifiers = () => {
        setShowModifierSheet(true);
    };

    const handleSaveModifiers = (modifiers: Modifier[]) => {
        setSelectedModifiers(modifiers);
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const calculateTotalPrice = () => {
        if (!menuItem) return 0;

        const modifierTotal = selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
        return (menuItem.price + modifierTotal) * quantity;
    };

    const validateSelection = () => {
        // Check if all required modifier groups have a selection
        const requiredGroups = modifierGroups.filter(group => group.required);

        for (const group of requiredGroups) {
            const hasSelection = selectedModifiers.some(mod => mod.groupId === group.id);
            if (!hasSelection) {
                return false;
            }
        }

        return true;
    };

    const handleAddToCart = () => {
        if (!menuItem) return;

        if (!validateSelection()) {
            // Show error or alert that required selections are missing
            alert('Please make all required selections');
            return;
        }

        setIsLoading(true);

        // Provide haptic feedback on add to cart
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Add to cart with a slight delay for better UX
        setTimeout(() => {
            addToCart(menuItem, quantity, selectedModifiers, specialInstructions);
            setIsLoading(false);

            // Show success animation before navigating back
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.5,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start(() => {
                router.back();
            });
        }, 500);
    };

    if (!menuItem) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTransparent: true,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <ChevronLeft size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Image
                    source={{ uri: menuItem.imageUrl }}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                />

                <Animated.View
                    style={[
                        styles.detailsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.name}>{menuItem.name}</Text>
                        <Text style={styles.price}>{formatCurrency(menuItem.price)}</Text>
                    </View>

                    <Text style={styles.description}>{menuItem.description}</Text>

                    {modifierGroups.length > 0 && (
                        <TouchableOpacity
                            style={styles.modifiersButton}
                            onPress={handleOpenModifiers}
                        >
                            <View style={styles.modifiersButtonContent}>
                                <Edit size={20} color={colors.primary} style={styles.modifiersIcon} />
                                <View style={styles.modifiersTextContainer}>
                                    <Text style={styles.modifiersButtonText}>Customize Order</Text>
                                    <Text style={styles.modifiersSubtext}>
                                        {selectedModifiers.length > 0
                                            ? `${selectedModifiers.length} modifier${selectedModifiers.length > 1 ? 's' : ''} selected`
                                            : 'Add or remove modifiers'}
                                    </Text>
                                </View>
                            </View>
                            <ChevronLeft size={20} color={colors.textLight} style={styles.modifiersChevron} />
                        </TouchableOpacity>
                    )}

                    <View style={styles.specialInstructionsSection}>
                        <Text style={styles.sectionTitle}>Special Instructions</Text>
                        <TextInput
                            style={styles.specialInstructionsInput}
                            placeholder="Add notes (allergies, special requests, etc.)"
                            value={specialInstructions}
                            onChangeText={setSpecialInstructions}
                            multiline
                            placeholderTextColor={colors.textLight}
                        />
                    </View>

                    <View style={styles.quantitySection}>
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <QuantitySelector
                            quantity={quantity}
                            onIncrease={handleIncreaseQuantity}
                            onDecrease={handleDecreaseQuantity}
                        />
                    </View>
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Plus size={20} color="#fff" style={styles.addToCartIcon} />
                            <Text style={styles.addToCartText}>
                                Add to Cart • {formatCurrency(calculateTotalPrice())}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <ModifierSelectionSheet
                visible={showModifierSheet}
                onClose={() => setShowModifierSheet(false)}
                onSave={handleSaveModifiers}
                menuItem={menuItem}
                modifierGroups={modifierGroups}
                initialModifiers={selectedModifiers}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.4,
        backgroundColor: '#f0f0f0',
    },
    detailsContainer: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        marginRight: 16,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    description: {
        fontSize: 16,
        color: colors.textLight,
        lineHeight: 24,
        marginBottom: 24,
    },
    modifiersButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: colors.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 24,
    },
    modifiersButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modifiersIcon: {
        marginRight: 12,
    },
    modifiersTextContainer: {
        flex: 1,
    },
    modifiersButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    modifiersSubtext: {
        fontSize: 14,
        color: colors.textLight,
        marginTop: 2,
    },
    modifiersChevron: {
        transform: [{ rotate: '180deg' }],
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    specialInstructionsSection: {
        marginBottom: 24,
    },
    specialInstructionsInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        color: colors.text,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    quantitySection: {
        marginBottom: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.card,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    addToCartButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    addToCartIcon: {
        marginRight: 8,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
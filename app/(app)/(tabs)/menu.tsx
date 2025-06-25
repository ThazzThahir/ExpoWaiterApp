import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Animated,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, ShoppingCart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { useMenuStore } from '@/store/menuStore';
import { useCartStore } from '@/store/cartStore';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { CartSummary } from '@/components/menu/CartSummary';
import { MenuItem } from '@/types/menu';
import { useAppTheme } from '@/store/themeStore';

export default function MenuScreen() {
    const router = useRouter();
    const { menuItems, categories, isLoading, fetchMenu, getMenuItemsByCategory, searchMenuItems } = useMenuStore();
    const { cart, getItemCount, addToCart } = useCartStore();
    const { colors } = useAppTheme();

    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Animation for category changes
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Animation for cart summary
    const cartSlideAnim = useRef(new Animated.Value(100)).current;
    const cartOpacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchMenu().then(() => {
            // Set the first category as selected once data is loaded
            if (categories.length > 0 && !selectedCategoryId) {
                const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
                setSelectedCategoryId(sortedCategories[0].id);
            }
        });
    }, []);

    // Animate category changes
    useEffect(() => {
        if (selectedCategoryId) {
            // Fade out
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0.5,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.95,
                        duration: 150,
                        useNativeDriver: true,
                    })
                ]),
                // Fade in
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ])
            ]).start();
        }
    }, [selectedCategoryId]);

    // Animate cart summary when cart changes
    useEffect(() => {
        if (getItemCount() > 0) {
            Animated.parallel([
                Animated.timing(cartSlideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(cartOpacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(cartSlideAnim, {
                    toValue: 100,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(cartOpacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [cart.items.length]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchMenu();
        setRefreshing(false);
    };

    const handleCategorySelect = (categoryId: string) => {
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
        }
        setSelectedCategoryId(categoryId);
        setSearchQuery('');
        setIsSearching(false);
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setIsSearching(text.length > 0);
    };

    const handleItemPress = (item: MenuItem) => {
        router.push(`/menu/${item.id}`);
    };

    const handleAddToCart = (item: MenuItem) => {
        // Quick add to cart with default options
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Check if item has required modifiers
        const modifierGroups = useMenuStore.getState().getModifierGroupsForItem(item.id);
        const hasRequiredModifiers = modifierGroups.some(group => group.required);

        if (hasRequiredModifiers) {
            // If it has required modifiers, navigate to detail screen
            router.push(`/menu/${item.id}`);
        } else {
            // Otherwise, add directly to cart with default quantity of 1
            addToCart(item, 1, [], '');

            // Show animation feedback
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                })
            ]).start();
        }
    };

    const handleViewCart = () => {
        router.push('/cart');
    };

    // Filter items based on search or selected category
    const displayedItems = isSearching
        ? searchMenuItems(searchQuery)
        : getMenuItemsByCategory(selectedCategoryId);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
                    <Search size={20} color={colors.textLight} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search menu..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholderTextColor={colors.textLight}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery('');
                                setIsSearching(false);
                            }}
                            style={styles.clearButton}
                        >
                            <Text style={styles.clearButtonText}>×</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={handleViewCart}
                    activeOpacity={0.7}
                >
                    <ShoppingCart size={24} color={colors.text} />
                    {getItemCount() > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{getItemCount()}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {!isSearching && (
                <CategoryTabs
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={handleCategorySelect}
                />
            )}

            {isLoading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <Animated.View
                    style={[
                        { flex: 1 },
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <FlatList
                        data={displayedItems}
                        renderItem={({ item }) => (
                            <MenuItemCard
                                item={item}
                                onPress={handleItemPress}
                                onAddToCart={handleAddToCart}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        contentContainerStyle={styles.menuGrid}
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
                                <Text style={[styles.emptyText, { color: colors.textLight }]}>
                                    {isSearching
                                        ? `No results found for "${searchQuery}"`
                                        : 'No items in this category'}
                                </Text>
                            </View>
                        }
                    />
                </Animated.View>
            )}

            <Animated.View
                style={[
                    styles.cartSummaryContainer,
                    {
                        transform: [{ translateY: cartSlideAnim }],
                        opacity: cartOpacityAnim
                    }
                ]}
            >
                <CartSummary
                    itemCount={getItemCount()}
                    totalAmount={cart.totalAmount}
                    onPress={handleViewCart}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: colors.text,
        fontSize: 16,
    },
    clearButton: {
        padding: 4,
    },
    clearButtonText: {
        fontSize: 20,
        color: colors.textLight,
        fontWeight: 'bold',
    },
    cartButton: {
        marginLeft: 16,
        position: 'relative',
        padding: 4,
    },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.primary,
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    menuGrid: {
        padding: 8,
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
    cartSummaryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingBottom: 20,
    },
});
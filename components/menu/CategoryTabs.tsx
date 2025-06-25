import React, { useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '@/constants/colors';
import { Category } from '@/types/menu';

interface CategoryTabsProps {
    categories: Category[];
    selectedCategoryId: string;
    onSelectCategory: (categoryId: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
    categories,
    selectedCategoryId,
    onSelectCategory
}) => {
    // Sort categories by order
    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
    const scrollViewRef = useRef<ScrollView>(null);

    // Scroll to the selected category when it changes
    useEffect(() => {
        if (scrollViewRef.current && selectedCategoryId) {
            // Find the index of the selected category
            const selectedIndex = sortedCategories.findIndex(cat => cat.id === selectedCategoryId);
            if (selectedIndex !== -1) {
                // Calculate approximate scroll position (this is an estimation)
                const scrollX = selectedIndex * 100; // Assuming average tab width of 100

                // Scroll with animation
                scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
            }
        }
    }, [selectedCategoryId]);

    const renderTab = (category: Category) => {
        const isSelected = selectedCategoryId === category.id;

        // On web, we don't use BlurView as it's not fully supported
        if (Platform.OS === 'web') {
            return (
                <TouchableOpacity
                    key={category.id}
                    style={[
                        styles.tab,
                        isSelected && styles.selectedTab
                    ]}
                    onPress={() => onSelectCategory(category.id)}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.tabText,
                            isSelected && styles.selectedTabText
                        ]}
                    >
                        {category.name}
                    </Text>
                </TouchableOpacity>
            );
        }

        // On native platforms, use BlurView for inactive tabs
        return (
            <TouchableOpacity
                key={category.id}
                style={[
                    styles.tab,
                    isSelected && styles.selectedTab
                ]}
                onPress={() => onSelectCategory(category.id)}
                activeOpacity={0.7}
            >
                {!isSelected ? (
                    <BlurView intensity={10} style={styles.blurContainer}>
                        <Text style={styles.tabText}>{category.name}</Text>
                    </BlurView>
                ) : (
                    <Text style={styles.selectedTabText}>{category.name}</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToAlignment="center"
            >
                {sortedCategories.map(renderTab)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    scrollContent: {
        paddingHorizontal: 8,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTab: {
        backgroundColor: colors.primary,
    },
    blurContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    selectedTabText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

import React, { useRef, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
    const scrollViewRef = useRef<ScrollView>(null);
    const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (scrollViewRef.current && selectedCategoryId && tabLayouts[selectedCategoryId]) {
            const layout = tabLayouts[selectedCategoryId];
            const screenWidth = Dimensions.get('window').width;
            const scrollX = Math.max(0, layout.x - screenWidth / 2 + layout.width / 2);
            
            scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
            
            // Animate indicator
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: layout.x,
                    useNativeDriver: false,
                    tension: 150,
                    friction: 8,
                }),
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 0.95,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    })
                ])
            ]).start();
        }
    }, [selectedCategoryId, tabLayouts]);

    const handleLayout = (categoryId: string, event: any) => {
        const { x, width } = event.nativeEvent.layout;
        setTabLayouts(prev => ({
            ...prev,
            [categoryId]: { x: x + 16, width } // Adding padding offset
        }));
    };

    const renderTab = (category: Category, index: number) => {
        const isSelected = selectedCategoryId === category.id;

        return (
            <TouchableOpacity
                key={category.id}
                style={[
                    styles.tab,
                    isSelected && styles.selectedTab
                ]}
                onPress={() => onSelectCategory(category.id)}
                activeOpacity={0.7}
                onLayout={(event) => handleLayout(category.id, event)}
            >
                <Animated.View style={{ transform: [{ scale: isSelected ? scaleAnim : 1 }] }}>
                    <Text
                        style={[
                            styles.tabText,
                            isSelected && styles.selectedTabText
                        ]}
                    >
                        {category.name}
                    </Text>
                </Animated.View>
                {isSelected && (
                    <View style={styles.selectedIndicator} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.gradient}
            >
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    decelerationRate="fast"
                    snapToAlignment="center"
                    bounces={false}
                >
                    {sortedCategories.map(renderTab)}
                </ScrollView>
                
                {/* Animated indicator line */}
                {selectedCategoryId && tabLayouts[selectedCategoryId] && (
                    <Animated.View
                        style={[
                            styles.animatedIndicator,
                            {
                                left: slideAnim,
                                width: tabLayouts[selectedCategoryId]?.width || 0,
                            }
                        ]}
                    />
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    gradient: {
        paddingVertical: 4,
    },
    scrollContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 4,
        borderRadius: 25,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: 'transparent',
    },
    selectedTab: {
        backgroundColor: colors.primary,
        elevation: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    selectedTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    selectedIndicator: {
        position: 'absolute',
        bottom: -2,
        left: '50%',
        transform: [{ translateX: -2 }],
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
    },
    animatedIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        backgroundColor: colors.primary,
        borderRadius: 1.5,
    },
});

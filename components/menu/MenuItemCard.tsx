import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Animated,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MenuItem } from '@/types/menu';
import { formatCurrency } from '@/utils/validation';

interface MenuItemCardProps {
    item: MenuItem;
    onPress: (item: MenuItem) => void;
    onAddToCart: (item: MenuItem) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 3; // 3 columns with padding

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
    item,
    onPress,
    onAddToCart
}) => {
    // Animation for button press
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={styles.container}
                onPress={() => onPress(item)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
            >
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                />

                <View style={styles.content}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.footer}>
                        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                onAddToCart(item);
                            }}
                        >
                            <Plus size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: colors.card,
        borderRadius: 12,
        overflow: 'hidden',
        margin: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: CARD_WIDTH * 0.8,
        backgroundColor: '#f0f0f0',
    },
    content: {
        padding: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
    },
    addButton: {
        backgroundColor: colors.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
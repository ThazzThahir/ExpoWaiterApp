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
import { ShoppingCart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/validation';

interface CartSummaryProps {
    itemCount: number;
    totalAmount: number;
    onPress: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const CartSummary: React.FC<CartSummaryProps> = ({
    itemCount,
    totalAmount,
    onPress
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

    const handlePress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    if (itemCount === 0) {
        return null;
    }

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={styles.container}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
            >
                <View style={styles.content}>
                    <View style={styles.leftSection}>
                        <ShoppingCart size={20} color="#fff" />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{itemCount}</Text>
                        </View>
                    </View>

                    <Text style={styles.text}>View Cart</Text>

                    <Text style={styles.amount}>{formatCurrency(totalAmount)}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 300,
        backgroundColor: colors.primary,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: colors.secondaryLight,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    amount: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
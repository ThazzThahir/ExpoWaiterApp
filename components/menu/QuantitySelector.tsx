import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    minQuantity?: number;
    maxQuantity?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onIncrease,
    onDecrease,
    minQuantity = 1,
    maxQuantity = 99,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    quantity <= minQuantity && styles.buttonDisabled
                ]}
                onPress={onDecrease}
                disabled={quantity <= minQuantity}
            >
                <Minus
                    size={18}
                    color={quantity <= minQuantity ? colors.textLight : colors.primary}
                />
            </TouchableOpacity>

            <Text style={styles.quantity}>{quantity}</Text>

            <TouchableOpacity
                style={[
                    styles.button,
                    quantity >= maxQuantity && styles.buttonDisabled
                ]}
                onPress={onIncrease}
                disabled={quantity >= maxQuantity}
            >
                <Plus
                    size={18}
                    color={quantity >= maxQuantity ? colors.textLight : colors.primary}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        overflow: 'hidden',
    },
    button: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    quantity: {
        width: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
});
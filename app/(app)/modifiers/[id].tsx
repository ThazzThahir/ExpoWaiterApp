import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useMenuStore } from '@/store/menuStore';
import { ModifierGroup } from '@/components/modifiers/ModifierGroup';
import { Modifier } from '@/types/menu';
import { formatCurrency } from '@/utils/validation';

export default function ModifiersScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { getMenuItemById, getModifierGroupsForItem } = useMenuStore();

    const menuItem = getMenuItemById(id);
    const modifierGroups = getModifierGroupsForItem(id);

    const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Pre-select default modifiers (first option in required groups)
        const defaultModifiers: Modifier[] = [];

        modifierGroups.forEach(group => {
            if (group.required && !group.multiSelect && group.modifiers.length > 0) {
                defaultModifiers.push(group.modifiers[0]);
            }
        });

        setSelectedModifiers(defaultModifiers);
    }, [modifierGroups]);

    const handleSelectModifier = (modifier: Modifier, selected: boolean) => {
        if (selected) {
            setSelectedModifiers(prev => [...prev, modifier]);
        } else {
            setSelectedModifiers(prev => prev.filter(m => m.id !== modifier.id));
        }
    };

    const calculateModifiersTotal = () => {
        return selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
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

    const handleSave = () => {
        if (!validateSelection()) {
            // Show error or alert that required selections are missing
            alert('Please make all required selections');
            return;
        }

        setIsLoading(true);

        // Simulate a delay for better UX
        setTimeout(() => {
            // In a real app, you would pass these selections back to the previous screen
            // or store them in a global state
            setIsLoading(false);
            router.back();
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
                    headerTitle: "Customize Item",
                }}
            />

            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.header}>
                        <Text style={styles.itemName}>{menuItem.name}</Text>
                        <Text style={styles.basePrice}>Base: {formatCurrency(menuItem.price)}</Text>
                    </View>

                    {modifierGroups.map(group => (
                        <ModifierGroup
                            key={group.id}
                            group={group}
                            selectedModifiers={selectedModifiers}
                            onSelectModifier={handleSelectModifier}
                        />
                    ))}
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Additional cost:</Text>
                        <Text style={styles.priceValue}>
                            {calculateModifiersTotal() > 0
                                ? `+${formatCurrency(calculateModifiersTotal())}`
                                : formatCurrency(0)}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Check size={20} color="#fff" style={styles.saveIcon} />
                                <Text style={styles.saveButtonText}>Save Selections</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 24,
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    basePrice: {
        fontSize: 16,
        color: colors.textLight,
    },
    footer: {
        backgroundColor: colors.card,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    priceLabel: {
        fontSize: 16,
        color: colors.text,
    },
    priceValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveIcon: {
        marginRight: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
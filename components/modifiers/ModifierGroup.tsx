import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { Check, Circle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Modifier, ModifierGroup as ModifierGroupType } from '@/types/menu';
import { formatCurrency } from '@/utils/validation';

interface ModifierGroupProps {
    group: ModifierGroupType;
    selectedModifiers: Modifier[];
    onSelectModifier: (modifier: Modifier, selected: boolean) => void;
}

export const ModifierGroup: React.FC<ModifierGroupProps> = ({
    group,
    selectedModifiers,
    onSelectModifier
}) => {
    const isModifierSelected = (modifier: Modifier) => {
        return selectedModifiers.some(m => m.id === modifier.id);
    };

    const handleModifierPress = (modifier: Modifier) => {
        const isSelected = isModifierSelected(modifier);

        if (group.multiSelect) {
            // For multi-select groups, toggle the selection
            onSelectModifier(modifier, !isSelected);
        } else {
            // For single-select groups, select this one and deselect others
            if (!isSelected) {
                // Deselect any other modifiers from this group
                selectedModifiers
                    .filter(m => m.groupId === group.id)
                    .forEach(m => onSelectModifier(m, false));

                // Select this modifier
                onSelectModifier(modifier, true);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.groupName}>{group.name}</Text>
                {group.required && (
                    <View style={styles.requiredBadge}>
                        <Text style={styles.requiredText}>Required</Text>
                    </View>
                )}
            </View>

            {group.modifiers.map((modifier) => {
                const selected = isModifierSelected(modifier);

                return (
                    <TouchableOpacity
                        key={modifier.id}
                        style={styles.modifierItem}
                        onPress={() => handleModifierPress(modifier)}
                    >
                        <View style={styles.modifierContent}>
                            {group.multiSelect ? (
                                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                                    {selected && <Check size={14} color="#fff" />}
                                </View>
                            ) : (
                                <View style={styles.radioContainer}>
                                    {selected ? (
                                        <View style={styles.radioSelected}>
                                            <View style={styles.radioInner} />
                                        </View>
                                    ) : (
                                        <View style={styles.radio} />
                                    )}
                                </View>
                            )}

                            <View style={styles.modifierDetails}>
                                <Text style={styles.modifierName}>{modifier.name}</Text>
                                {modifier.price > 0 && (
                                    <Text style={styles.modifierPrice}>+{formatCurrency(modifier.price)}</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    requiredBadge: {
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    requiredText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    modifierItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modifierContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxSelected: {
        backgroundColor: colors.primary,
    },
    radioContainer: {
        marginRight: 12,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    radioSelected: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    modifierDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modifierName: {
        fontSize: 16,
        color: colors.text,
    },
    modifierPrice: {
        fontSize: 14,
        color: colors.textLight,
    },
});
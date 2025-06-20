import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    Platform,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ModifierGroup as ModifierGroupType, Modifier, MenuItem } from '@/types/menu';
import { ModifierGroup } from '@/components/modifiers/ModifierGroup';
import { formatCurrency } from '@/utils/validation';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ModifierSelectionSheetProps {
    visible: boolean;
    onClose: () => void;
    onSave: (selectedModifiers: Modifier[]) => void;
    menuItem: MenuItem;
    modifierGroups: ModifierGroupType[];
    initialModifiers?: Modifier[];
}

export const ModifierSelectionSheet: React.FC<ModifierSelectionSheetProps> = ({
    visible,
    onClose,
    onSave,
    menuItem,
    modifierGroups,
    initialModifiers = [],
}) => {
    const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>(initialModifiers);
    const [activeTab, setActiveTab] = useState<'required' | 'optional'>('required');

    // Reset selections when modal opens
    useEffect(() => {
        if (visible) {
            setSelectedModifiers(initialModifiers);

            // Set initial tab based on if there are required groups
            const hasRequiredGroups = modifierGroups.some(group => group.required);
            setActiveTab(hasRequiredGroups ? 'required' : 'optional');
        }
    }, [visible, initialModifiers]);

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

        onSave(selectedModifiers);
        onClose();
    };

    // Filter groups by tab
    const requiredGroups = modifierGroups.filter(group => group.required);
    const optionalGroups = modifierGroups.filter(group => !group.required);

    // Determine which groups to show based on active tab
    const displayedGroups = activeTab === 'required' ? requiredGroups : optionalGroups;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <Text style={styles.title}>{menuItem.name}</Text>
                            <Text style={styles.basePrice}>Base: {formatCurrency(menuItem.price)}</Text>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    {requiredGroups.length > 0 && optionalGroups.length > 0 && (
                        <View style={styles.tabs}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'required' && styles.activeTab]}
                                onPress={() => setActiveTab('required')}
                            >
                                <Text style={[styles.tabText, activeTab === 'required' && styles.activeTabText]}>
                                    Required Modifiers
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'optional' && styles.activeTab]}
                                onPress={() => setActiveTab('optional')}
                            >
                                <Text style={[styles.tabText, activeTab === 'optional' && styles.activeTabText]}>
                                    Optional Add-ons
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <ScrollView style={styles.content}>
                        {displayedGroups.length > 0 ? (
                            displayedGroups.map(group => (
                                <ModifierGroup
                                    key={group.id}
                                    group={group}
                                    selectedModifiers={selectedModifiers}
                                    onSelectModifier={handleSelectModifier}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    No {activeTab} modifiers available
                                </Text>
                            </View>
                        )}
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
                            style={[
                                styles.saveButton,
                                !validateSelection() && styles.disabledButton
                            ]}
                            onPress={handleSave}
                            disabled={!validateSelection()}
                        >
                            <Check size={20} color="#fff" style={styles.saveIcon} />
                            <Text style={styles.saveButtonText}>
                                Add to Order • {formatCurrency(menuItem.price + calculateModifiersTotal())}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: SCREEN_HEIGHT * 0.8,
        maxHeight: SCREEN_HEIGHT * 0.8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    basePrice: {
        fontSize: 14,
        color: colors.textLight,
        marginTop: 4,
    },
    closeButton: {
        padding: 4,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        color: colors.textLight,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: colors.textLight,
        fontSize: 16,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
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
    disabledButton: {
        backgroundColor: colors.textLight,
        opacity: 0.7,
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
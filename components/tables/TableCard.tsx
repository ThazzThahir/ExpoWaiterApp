import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Users, Clock } from 'lucide-react-native';
import { Table } from '@/types';
import { colors } from '@/constants/colors';
import { formatDuration } from '@/utils/validation';

interface TableCardProps {
    table: Table;
    onPress: (tableId: string) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onPress }) => {
    const getStatusColor = () => {
        switch (table.status) {
            case 'vacant':
                return colors.vacant;
            case 'occupied':
                return colors.occupied;
            default:
                return colors.vacant;
        }
    };

    const getStatusText = () => {
        switch (table.status) {
            case 'vacant':
                return 'Vacant';
            case 'occupied':
                return 'Occupied';
            default:
                return 'Vacant';
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { borderColor: getStatusColor() }]}
            onPress={() => onPress(table.id)}
        >
            <View style={styles.header}>
                <Text style={styles.tableNumber}>T{table.number}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Always render info rows to keep height consistent */}
                <View style={styles.infoRow}>
                    {table.status !== 'vacant' ? (
                        <>
                            <Users size={16} color={colors.textLight} />
                            <Text style={styles.infoText}>{table.guestCount} guests</Text>
                        </>
                    ) : (
                        <>
                            <Users size={16} color={'transparent'} />
                            <Text style={[styles.infoText, { color: 'transparent' }]}>0 guests</Text>
                        </>
                    )}
                </View>
                <View style={styles.infoRow}>
                    {table.status === 'occupied' && table.occupiedSince ? (
                        <>
                            <Clock size={16} color={colors.textLight} />
                            <Text style={styles.infoText}>{formatDuration(table.occupiedSince)}</Text>
                        </>
                    ) : (
                        <>
                            <Clock size={16} color={'transparent'} />
                            <Text style={[styles.infoText, { color: 'transparent' }]}>--</Text>
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 4,
        flex: 1,
        margin: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tableNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        marginTop: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    infoText: {
        marginLeft: 6,
        color: colors.textLight,
        fontSize: 14,
    },
});
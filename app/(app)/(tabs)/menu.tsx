import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Grid, List } from 'lucide-react-native';
import { useAppTheme } from '@/components/common/AppThemeProvider';

export default function MenuScreen() {
    const router = useRouter();
    const { colors } = useAppTheme();
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

    const styles = createStyles(colors);

    const categories = [
        { id: '1', name: 'Appetizers', count: 12 },
        { id: '2', name: 'Main Course', count: 18 },
        { id: '3', name: 'Desserts', count: 8 },
        { id: '4', name: 'Beverages', count: 15 },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Menu</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Search size={20} color={colors.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Filter size={20} color={colors.textLight} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        {viewMode === 'grid' ? (
                            <List size={20} color={colors.textLight} />
                        ) : (
                            <Grid size={20} color={colors.textLight} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.categoryCard}
                                onPress={() => router.push(`/menu/${category.id}`)}
                            >
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <Text style={styles.categoryCount}>{category.count} items</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Featured Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Featured Items</Text>
                    <Text style={styles.comingSoon}>Coming soon...</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 14,
        color: colors.textLight,
    },
    comingSoon: {
        fontSize: 16,
        color: colors.textLight,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Play, Printer, Edit3, CheckCircle, Clock, ChefHat } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OrderCard } from '@/components/orders/OrderCard';
import { useOrderStore } from '@/store/orderStore';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import { OrderStatus } from '@/types';

export default function OrdersScreen() {
    const router = useRouter();
    const {
        orders,
        isLoading,
        fetchOrders,
        getActiveOrders,
        getCompletedOrders,
        updateOrderStatus,
        simulateOrderProgress
    } = useOrderStore();
    
    const { mode: themeMode } = useThemeStore();
    const colors = getColors(themeMode === 'dark');

    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [simulationModalVisible, setSimulationModalVisible] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const handleOrderPress = (orderId: string) => {
        console.log(`Order ${orderId} pressed`);
        // Future: Navigate to order detail screen
    };

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        updateOrderStatus(orderId, status);
        Alert.alert('Order Updated', `Order ${orderId} status changed to ${status}`);
    };

    const handleModifyOrder = (orderId: string) => {
        Alert.alert(
            'Modify Order',
            `Modify order ${orderId}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit Items', onPress: () => handleEditItems(orderId) },
                { text: 'Change Status', onPress: () => handleChangeStatus(orderId) },
            ]
        );
    };

    const handleEditItems = (orderId: string) => {
        Alert.alert('Edit Items', 'Item editing feature coming soon!');
    };

    const handleChangeStatus = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const statusOptions = [
            { text: 'Cancel', style: 'cancel' as const },
            { text: 'Preparing', onPress: () => handleStatusChange(orderId, 'preparing') },
            { text: 'Ready to Serve', onPress: () => handleStatusChange(orderId, 'serving') },
            { text: 'Complete', onPress: () => handleStatusChange(orderId, 'completed') },
        ];

        Alert.alert('Change Status', 'Select new status:', statusOptions);
    };

    const handlePrintOrder = (orderId: string) => {
        Alert.alert(
            'Print Order',
            `Print order ${orderId}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Kitchen Receipt', onPress: () => printKitchenReceipt(orderId) },
                { text: 'Customer Receipt', onPress: () => printCustomerReceipt(orderId) },
            ]
        );
    };

    const printKitchenReceipt = (orderId: string) => {
        Alert.alert('Success', `Kitchen receipt for order ${orderId} sent to printer!`);
    };

    const printCustomerReceipt = (orderId: string) => {
        Alert.alert('Success', `Customer receipt for order ${orderId} printed!`);
    };

    const handleStartSimulation = async () => {
        setIsSimulating(true);
        setSimulationModalVisible(false);
        
        // Simulate order progression for active orders
        const activeOrders = getActiveOrders();
        if (activeOrders.length === 0) {
            Alert.alert('No Active Orders', 'There are no active orders to simulate.');
            setIsSimulating(false);
            return;
        }

        Alert.alert('Simulation Started', 'Orders will progress automatically every 3 seconds.');
        
        for (const order of activeOrders.slice(0, 3)) { // Simulate first 3 orders
            setTimeout(() => {
                simulateOrderProgress(order.id);
            }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
        }
        
        setTimeout(() => {
            setIsSimulating(false);
            Alert.alert('Simulation Complete', 'Order simulation has finished.');
        }, 5000);
    };

    const renderSimulationModal = () => (
        <Modal
            visible={simulationModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setSimulationModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <LinearGradient
                        colors={[colors.primary, colors.primaryDark]}
                        style={styles.modalHeader}
                    >
                        <Play size={24} color="#fff" />
                        <Text style={styles.modalTitle}>Order Simulation</Text>
                    </LinearGradient>
                    
                    <View style={styles.modalBody}>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                            This will simulate the progression of active orders through different stages:
                        </Text>
                        
                        <View style={styles.simulationSteps}>
                            <View style={styles.stepItem}>
                                <ChefHat size={16} color={colors.primary} />
                                <Text style={[styles.stepText, { color: colors.textLight }]}>Preparing → Ready to Serve</Text>
                            </View>
                            <View style={styles.stepItem}>
                                <CheckCircle size={16} color={colors.vacant} />
                                <Text style={[styles.stepText, { color: colors.textLight }]}>Ready to Serve → Completed</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setSimulationModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.startButton]}
                            onPress={handleStartSimulation}
                        >
                            <Text style={styles.startButtonText}>Start Simulation</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const displayedOrders = activeTab === 'active'
        ? getActiveOrders()
        : getCompletedOrders();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.text }]}>Orders</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => setSimulationModalVisible(true)}
                        disabled={isSimulating}
                    >
                        {isSimulating ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Play size={18} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
                
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'active' && [styles.activeTab, { borderBottomColor: colors.primary }]
                        ]}
                        onPress={() => setActiveTab('active')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: colors.textLight },
                            activeTab === 'active' && [styles.activeTabText, { color: colors.primary }]
                        ]}>
                            Active Orders ({getActiveOrders().length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'completed' && [styles.activeTab, { borderBottomColor: colors.primary }]
                        ]}
                        onPress={() => setActiveTab('completed')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: colors.textLight },
                            activeTab === 'completed' && [styles.activeTabText, { color: colors.primary }]
                        ]}>
                            Completed Orders ({getCompletedOrders().length})
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={displayedOrders}
                    renderItem={({ item }) => (
                        <OrderCard
                            order={item}
                            onPress={handleOrderPress}
                            onStatusChange={handleStatusChange}
                            onModify={handleModifyOrder}
                            onPrint={handlePrintOrder}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.ordersList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Clock size={48} color={colors.textLight} />
                            <Text style={[styles.emptyText, { color: colors.textLight }]}>
                                No {activeTab} orders found
                            </Text>
                            <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
                                {activeTab === 'active' 
                                    ? 'New orders will appear here'
                                    : 'Completed orders will be shown here'
                                }
                            </Text>
                        </View>
                    }
                />
            )}

            {activeTab === 'active' && (
                <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
                    <Plus size={24} color="#fff" />
                </TouchableOpacity>
            )}
            
            {renderSimulationModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 0,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    headerActions: {
        position: 'absolute',
        right: 16,
        top: 12,
    },
    actionButton: {
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabText: {
        fontWeight: 'bold',
    },
    ordersList: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 12,
    },
    modalBody: {
        padding: 20,
    },
    modalDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    simulationSteps: {
        gap: 12,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepText: {
        fontSize: 14,
    },
    modalActions: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    startButton: {
        backgroundColor: '#3498db',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    startButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
});

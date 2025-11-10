import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import OrderManageStyle from "./order-manage.style";
import { OrderModel } from "@/src/data/model/order.model";
import { getStatusTextAndColorOrder, OrderStatus } from "@/src/common/resource/order_status";
import { mockOrders } from "@/src/data/json/order.data-json";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as OrderManagement from "@/src/data/management/order.management";
import { formatDate } from "@/src/common/utils/time.helper";
import { useToast } from "@/src/customize/toast.context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/data/types/global";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { MessageError } from "@/src/common/resource/message-error";
import { CommonColors } from "@/src/common/resource/colors";
import { AppConfig } from "@/src/common/config/app.config";
import { formatPriceRender } from "@/src/common/utils/currency.helper";
import DialogNotification from "@/src/components/dialog-notification/dialog-notification.component";
import { router } from "expo-router";
import * as UserActions from "@/src/data/store/actions/user/user.action";

const OrderManageScreen = () => {
    const preImage = new AppConfig().getPreImage();
    const { showToast } = useToast();
    const tabs = [
        OrderStatus.ALL,
        OrderStatus.PENDING,
        OrderStatus.PAID,
        OrderStatus.SHIPPED,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELED,
    ];
    const [activeTab, setActiveTab] = useState(OrderStatus.ALL);
    const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [displayOrders, setDisplayOrders] = useState<OrderModel[]>([]);
    const [openCancelConfirmDialog, setOpenCancelConfirmDialog] = useState(false);
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const dispatch = useDispatch();
    useEffect(() => {
        fetchListOrderUser();
    }, [])

    const fetchListOrderUser = async () => {
        try {
            const response = await OrderManagement.fetchListOrderUser();
            setOrders(response);
            setDisplayOrders(response);
        } catch (error) {
            console.log('OrderManageScreen 48: ', error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const handleCancelOrder = async (order?: OrderModel) => {
        if (!order) {
            showToast('Trạng thái đơn hàng không cho phép thực hiện', 'error');
            return;
        }

        if (!(order.status === OrderStatus.PENDING) && !(order.status === OrderStatus.PROCESSING)) {
            showToast('Trạng thái đơn hàng không cho phép thực hiện', 'error');
            return;
        }

        try {
            await OrderManagement.cancelOrderUser(order.id);
            const updatedOrders = orders.map(o =>
                o.id === order.id ? { ...o, status: OrderStatus.CANCELED } as OrderModel : o
            );
            setOrders(updatedOrders);
            setDisplayOrders(updatedOrders.filter(o =>
                activeTab === OrderStatus.ALL || o.status === activeTab
            ));
            setSelectedOrder(null);
            showToast('Đơn hàng đã được hủy thành công', 'success');
        } catch (error: any) {
            console.log('OrderManageScreen 79: ', error);
            if (error?.message === 'Session expired, please log in again') {
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        } finally {
            setOpenCancelConfirmDialog(false);
        }

    };

    const changeTab = (tab: OrderStatus) => {
        setActiveTab(tab);
        if (tab === OrderStatus.ALL) {
            setDisplayOrders(orders);
            return;
        }
        setDisplayOrders(orders.filter(order => order.status === tab));
    }

    const renderTab = (tab: OrderStatus) => (
        <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
            onPress={() => changeTab(tab)}
        >
            <AntDesign name="carryout" size={25} color={activeTab === tab ? CommonColors.white : CommonColors.black} />
            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
                {getStatusTextAndColorOrder(tab).text}
            </Text>
        </TouchableOpacity>
    );

    const renderOrderItem = ({ item }: { item: OrderModel }) => {
        const { text: statusText, color: statusColor } = getStatusTextAndColorOrder(item.status);
        return (
            <TouchableOpacity style={styles.orderCard} onPress={() => setSelectedOrder(item)}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
                    <Text style={[styles.orderStatus, { color: statusColor }]}>{statusText}</Text>
                </View>
                <Text style={styles.orderDate}>Ngày đặt: {formatDate(new Date(item.created_at ?? ''))}</Text>
                {item.order_shops.map((shop) => (
                    <View key={shop.id} style={styles.shopContainer}>
                        <View style={styles.shopNameContainer}>
                            <MaterialIcons name="store" size={20} color={CommonColors.primary} />
                            <Text style={styles.shopName}>
                                {shop.shop?.shop_name}
                            </Text>
                        </View>
                        {shop.order_items.map((orderItem) => (
                            <Text key={orderItem.id} style={styles.itemPreview}>
                                {orderItem.product_variant?.product?.product_name ?? ''} x{orderItem.quantity}
                            </Text>
                        ))}
                    </View>
                ))}
                <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>
                        Tổng: {item.total_price.toLocaleString('vi-VN')} VNĐ
                    </Text>
                    <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
                </View>
            </TouchableOpacity>
        );
    };

    const renderOrderDetail = () => (
        <Modal
            visible={!!selectedOrder}
            animationType="slide"
            onRequestClose={() => {
                setSelectedOrder(null);
                setOpenCancelConfirmDialog(false)
            }}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalHeader, { marginHorizontal: 16 }]}>
                    <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                        <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Chi tiết đơn hàng #{selectedOrder?.id}</Text>
                </View>
                <ScrollView>
                    <View style={[styles.modalSection, { marginHorizontal: 16 }]}>
                        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                        <Text style={styles.modalText}>
                            Ngày đặt: {formatDate(selectedOrder?.created_at ?? new Date())}
                        </Text>
                        <Text style={styles.modalText}>
                            Trạng thái: {getStatusTextAndColorOrder(selectedOrder?.status || '').text}
                        </Text>
                        <Text style={styles.modalText}>
                            Địa chỉ: {`${selectedOrder?.address?.address_detail}, ${selectedOrder?.address?.city?.name}, ${selectedOrder?.address?.district?.name}, ${selectedOrder?.address?.ward?.name}`}
                        </Text>
                    </View>
                    {selectedOrder?.order_shops.map((shop) => (
                        <View key={shop.id} style={[styles.shopDetail, { marginHorizontal: 16 }]}>
                            <View style={styles.shopNameContainer}>
                                <MaterialIcons name="store" size={20} color={CommonColors.primary} />
                                <Text style={styles.shopName}>
                                    {shop.shop?.shop_name}
                                </Text>
                            </View>
                            {shop.order_items.map((item) => (
                                <View key={item.id} style={styles.itemDetail}>
                                    <Image style={styles.itemImage} source={{ uri: `${preImage}/${item.product_variant?.image_url}` }} />
                                    <Text style={styles.itemName}>{item.product_variant?.product?.product_name}</Text>
                                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                    <Text style={styles.itemPrice}>
                                        {(item.product_variant?.product?.unit_price || 0).toLocaleString('vi-VN')} VNĐ
                                    </Text>
                                </View>
                            ))}
                            <View style={styles.shopSummary}>
                                <Text style={styles.shopSubtotal}>
                                    Tạm tính: {shop.subtotal.toLocaleString('vi-VN')} VNĐ
                                </Text>
                                <Text style={styles.shopDiscount}>
                                    Giảm giá: {shop.discount.toLocaleString('vi-VN')} VNĐ
                                </Text>
                                <Text style={styles.shopTotal}>
                                    Tổng cộng: {shop.final_total.toLocaleString('vi-VN')} VNĐ
                                </Text>
                            </View>
                        </View>
                    ))}
                    <View style={[styles.modalSection, { marginHorizontal: 16 }]}>
                        <Text style={styles.sectionTitle}>Tổng đơn hàng</Text>
                        <Text style={styles.orderTotal}>
                            {formatPriceRender(selectedOrder?.total_price ?? 0)} VNĐ
                        </Text>
                    </View>

                </ScrollView>
                <View style={styles.buttonContainer}>
                    {selectedOrder && [OrderStatus.PENDING, OrderStatus.PROCESSING].includes(selectedOrder.status as OrderStatus) && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                            onPress={() => setOpenCancelConfirmDialog(true)}
                        >
                            <Text style={styles.actionButtonText}>Hủy đơn hàng</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: CommonColors.primary }]}
                        onPress={() => setSelectedOrder(null)}
                    >
                        <Text style={styles.actionButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
                <DialogNotification
                    visible={openCancelConfirmDialog}
                    message="Thao tác không thể hoàn tác. Bạn có chắc muốn tiếp tục?"
                    textClose="Bỏ qua"
                    textConfirm="Đồng ý"
                    onClose={() => setOpenCancelConfirmDialog(false)}
                    onConfirm={() => handleCancelOrder(selectedOrder ?? undefined)}
                />
            </View>
        </Modal>
    );

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Quản lý đơn hàng</Text>
                <View style={{ marginBottom: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                        {tabs.map(renderTab)}
                        <TouchableOpacity
                            style={[styles.tab]}
                            onPress={() => router.navigate('/(routes)/review')}
                        >
                            <AntDesign name="carryout" size={25} color={CommonColors.black} />
                            <Text style={[styles.tabText]}>
                                Đánh giá
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <FlatList
                    data={displayOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
                    }
                />
                {renderOrderDetail()}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    ...OrderManageStyle,
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OrderManageScreen;
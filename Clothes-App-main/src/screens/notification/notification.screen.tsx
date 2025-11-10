import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NotificationStyle from "./notification.style";
import { useHeaderHeight } from "@react-navigation/elements"
import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NotificationModel } from "@/src/data/model/notification.model";
import { formatDate } from "@/src/common/utils/time.helper";
import { useDispatch, useSelector } from "react-redux";
import { NotificationStoreState } from "@/src/data/store/reducers/notification/notification.reducer";
import { RootState } from "@/src/data/types/global";
import { PaginateModel } from "@/src/common/model/paginate.model";
import * as NotificationMana from "@/src/data/management/notification.management";
import * as NotificationActions from "@/src/data/store/actions/notification/notification.action";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { NotificationActionType, NotificationReferenceType, NotificationType } from "@/src/common/resource/notification";
import { LinearGradient } from "expo-linear-gradient";
import { formatPriceRender } from "@/src/common/utils/currency.helper";
import { useToast } from "@/src/customize/toast.context";
import { MessageError } from "@/src/common/resource/message-error";
import { getStatusTextAndColorOrder } from "@/src/common/resource/order_status";
import { OrderModel } from "@/src/data/model/order.model";
import { AppConfig } from "@/src/common/config/app.config";
import store from "@/src/data/store/store.config";

const NotificationScreen = () => {
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const preImage = new AppConfig().getPreImage();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);
    const initPaginate = new PaginateModel().convertObj({
        currentPage: 1,
        limit: 3,
        totalItems: 0,
        totalPages: 1
    })
    const [refresh, setRefresh] = useState(false);
    const isEndReachedList = useRef(false);
    const isFetching = useRef(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);

    // useFocusEffect(useCallback(() => {
    //     if (!store.getState().notification.isLoaded) {
    //         fetchNotifications(1);
    //     } else {
    //         let notifications = store.getState().notification.notifications;
    //         console.log(notifications.map(n => n.id));
    //         setNotifications(notifications);
    //         let isEndList =store.getState().notification.notifications.length >= notificationSelector.pagination.totalItems;
    //         isEndReachedList.current = isEndList;
    //     }
    // }, []))
    useEffect(() => {
        if (!store.getState().notification.isLoaded) {
            fetchNotifications(1);
        } else {
            let notificationSelector = store.getState().notification;
            console.log(notificationSelector.notifications.map(n => n.id));
            setNotifications(notificationSelector.notifications);
            let isEndList = notificationSelector.notifications.length >= notificationSelector.pagination.totalItems;
            isEndReachedList.current = isEndList;
        }
    }, [store.getState().notification.notifications])

    const fetchNotifications = async (page: number) => {
        try {
            if (!userSelector.isLogged || isEndReachedList.current || isFetching.current) {
                return;
            }

            isFetching.current = true;
            const notificationSelector = store.getState().notification;
            const response = await NotificationMana.fetchNotificationByUser(page, notificationSelector.pagination.limit);
            const newNotifications = response.get('notifications');

            // Loại bỏ trùng lặp dựa trên ID
            const uniqueNotifications = page === 1
                ? newNotifications
                : [...notifications, ...newNotifications].filter((item, index, self) =>
                    index === self.findIndex((t) => t.id === item.id)
                );

            setNotifications(uniqueNotifications);
            dispatch(NotificationActions.SaveNotifications(
                uniqueNotifications,
                response.get('pagination'),
                response.get('unreadCount')
            ));

            isEndReachedList.current = uniqueNotifications.length >= response.get('pagination').totalItems;
        } catch (error) {
            console.log(error);
        } finally {
            isFetching.current = false;
            setRefresh(false);
        }
    }

    const markNotificationAsRead = async (notification: NotificationModel) => {
        if (notification.action === NotificationActionType.VIEW_ORDER && notification.reference_type === NotificationReferenceType.ORDER) {
            try {
                console.log(notification);
                const order = await NotificationMana.fetchOrderDetails(notification.data?.order_id);
                setSelectedOrder(order);
            } catch (error) {
                console.log(error);
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }

        try {
            await NotificationMana.markNotificationAsRead(notification.id);
            const currNotifications = notifications;
            const readNotification = currNotifications.find(n => n.id === notification.id);
            if (readNotification) {
                readNotification.is_read = true;
            }
            dispatch(NotificationActions.MarkNotificationAsRead(notification.id));
            setNotifications(currNotifications);
        } catch (error) {
            console.log(error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const handleRefreshNotifications = useCallback(() => {
        setRefresh(true);
        setNotifications([]);
        isEndReachedList.current = false;
        fetchNotifications(1);
    }, [])

    const handleLoadMore = () => {
        let notificationSelector = store.getState().notification;
        if (!isEndReachedList.current && !isFetching.current && notificationSelector.pagination.currentPage < notificationSelector.pagination.totalPages) {
            fetchNotifications(notificationSelector.pagination.currentPage + 1);
        }
    };

    const renderNotificationItem = ({ item, index }: { item: NotificationModel; index: number }) => {
        const isUnread = !item.is_read;
        const timeAgo = formatDate(item.created_at ?? new Date());

        let icon = (
            <Feather name="package" size={24} color={CommonColors.primary} />
        )
        let title = "";
        let message = "";

        if (item.type === NotificationType.ORDER_NEW) {
            title = "Đơn hàng mới";
            message = `Bạn đã mua ${item.data?.order_id ? `#${item.data.order_id}` : ''} thành công. Tổng: ${formatPriceRender(item.data?.order_total ?? 0)} VNĐ`;
        } else if (item.type === NotificationType.ORDER_CANCELED) {
            icon = (
                <Feather name="x-octagon" size={24} color={CommonColors.red} />
            )
            title = "Hủy đơn hàng";
            message = `Đơn hàng ${item.data?.order_id ? `#${item.data.order_id}` : ''} đã bị hủy ${item.data?.reason ? `(${item.data.reason})` : ''}.`;
        }

        return (
            <Animated.View entering={FadeInDown.delay(index * 100).duration(300)}>
                <TouchableOpacity style={styles.notificationItem} onPress={() => markNotificationAsRead(item)}>
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                        <Text style={styles.time}>{timeAgo}</Text>
                    </View>
                    {isUnread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderOrderDetail = () => (
        <Modal
            visible={!!selectedOrder}
            animationType="slide"
            onRequestClose={() => {
                setSelectedOrder(null);
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
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: CommonColors.primary }]}
                        onPress={() => setSelectedOrder(null)}
                    >
                        <Text style={styles.actionButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <LinearGradient
            colors={['rgba(240,248,255,0.95)', 'rgba(224,242,254,0.95)']}
            style={{ flex: 1 }}
        >
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Thông báo {store.getState().notification.unreadCount > 0 ? `(${store.getState().notification.unreadCount})` : ''}</Text>
                </View>
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => `${item.id}`}
                    refreshControl={
                        <RefreshControl refreshing={refresh} onRefresh={handleRefreshNotifications} />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.05}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Không có thông báo nào</Text>
                    }
                />
            </View>
            {renderOrderDetail()}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    ...NotificationStyle,
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    modalSection: {
        marginBottom: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: '700',
        color: CommonColors.primary,
    },
    shopDetail: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    itemDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemImage: {
        width: 80,
        height: 80,
        marginRight: 10
    },
    itemName: {
        fontSize: 15,
        color: CommonColors.black,
        flex: 1,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#6B7280',
        marginHorizontal: 8,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    shopNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10
    },
    shopName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    shopSummary: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    shopSubtotal: {
        fontSize: 14,
        color: '#6B7280',
    },
    shopDiscount: {
        fontSize: 14,
        color: CommonColors.primary,
    },
    shopTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: CommonColors.primary,
        marginTop: 4,
    },
    closeButton: {
        backgroundColor: CommonColors.primary,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
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

export default NotificationScreen;

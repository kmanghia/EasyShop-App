import { CommonColors } from "@/src/common/resource/colors";
import { formatPriceRender } from "@/src/common/utils/currency.helper";
import { formatDate } from "@/src/common/utils/time.helper";
import { OrderModel } from "@/src/data/model/order.model";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as CartActions from "@/src/data/store/actions/cart/cart.action";
import { useDispatch } from "react-redux";

type Props = {}

const PaymentSuccessScreen = (props: Props) => {
    const route = useRoute();
    const { order_info } = route.params as {
        order_info: string,
    };
    const parsedOrderInfo: OrderModel = JSON.parse(order_info);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(CartActions.ResetCart());
    }, [])

    const navigateToOrderDetail = () => {
        router.dismissAll();
        router.navigate('/(routes)/order-manage');
    }

    const backHome = () => {
        router.dismissAll();
        router.navigate('/(tabs)');
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Ionicons name="checkmark-circle" size={80} color="#00cc00" />
                <Text style={styles.successText}>
                    Đặt hàng thành công
                </Text>
                <Text style={styles.subText}>
                    Cảm ơn bạn đã mua sắm tại <Text style={{ color: CommonColors.primary, fontWeight: '500' }}>Fashion Zone</Text>!
                </Text>
            </View>

            {/* Order Details Section */}
            <View style={styles.orderDetails}>
                <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
                    <Text style={styles.detailValue}>#{parsedOrderInfo.id}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Thời gian:</Text>
                    <Text style={styles.detailValue}>{formatDate(new Date(parsedOrderInfo?.created_at ?? new Date()))}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tổng tiền:</Text>
                    <Text style={styles.detailValue}>{formatPriceRender(parsedOrderInfo.total_price)} VND</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={navigateToOrderDetail}>
                    <Text style={styles.buttonText}>Xem chi tiết đơn hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={backHome}>
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>Tiếp tục mua sắm</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    subText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    orderDetails: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    primaryButton: {
        backgroundColor: CommonColors.primary
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: CommonColors.primary,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    secondaryButtonText: {
        color: CommonColors.primary
    },
});

export default PaymentSuccessScreen;
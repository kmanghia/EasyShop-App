import { CommonColors } from "@/src/common/resource/colors"
import { CouponModel } from "@/src/data/model/coupon.model"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type Props = {
    item: CouponModel,
    preImage: string,
    onSaveCoupon: (coupon_id: number) => void,
    onUseCoupon?: () => void,
}

const CouponItemComponent = ({
    item,
    preImage,
    onSaveCoupon,
    onUseCoupon,
}: Props) => {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value);
    }

    const formatValidity = () => {
        let valid_from = item.valid_from;
        let valid_to = item.valid_to;
        if (!valid_from && !valid_to) {
            return "Vô thời hạn";
        }

        const from = valid_from
            ? new Date(valid_from).toLocaleDateString("vi-VN")
            : "Bây giờ";
        const to = valid_to
            ? new Date(valid_to).toLocaleDateString("vi-VN")
            : "Không xác định";

        return `HSD: ${from} - ${to}`;
    }

    const handleSave = () => {
        onSaveCoupon(item.id);
    }

    return (
        <View style={styles.couponCard}>
            {/* Phần hình ảnh */}
            <View style={styles.couponImageContainer}>
                <Image style={styles.couponImage} source={{ uri: `${preImage}/${item.shop?.logo_url}` }} />
            </View>

            {/* Phần thông tin */}
            <View style={styles.couponInfo}>
                <Text style={styles.couponName}>{item.name}</Text>
                <Text style={styles.couponDiscount}>
                    {item.discount_type === "percentage"
                        ? `Giảm ${item.discount_value}%`
                        : `Giảm ${formatCurrency(item.discount_value)}`}
                    {item.max_discount && `, tối đa ${formatCurrency(item.max_discount)}`}
                </Text>
                <Text style={styles.couponMinOrder}>
                    Đơn tối thiểu: {formatCurrency(item.min_order_value)}
                </Text>
                <Text style={styles.couponValidity}>
                    {formatValidity()}
                </Text>
            </View>

            {/* Phần hành động */}
            <View style={styles.couponAction}>
                {item.is_used ? (
                    <Text style={styles.usedText}>Đã sử dụng</Text>
                ) : item.is_saved ? (
                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={onUseCoupon}
                    >
                        <Text style={styles.actionButtonText}>
                            Sử dụng
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => handleSave()}
                        style={[styles.actionButton, styles.saveButton]}
                    >
                        <Text style={styles.actionButtonText}>Lưu</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    couponCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 3,
        padding: 12,
        borderWidth: 1,
        borderColor: CommonColors.extraLightGray,
        shadowColor: CommonColors.lightGray,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    couponImageContainer: {
        width: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    couponImage: {
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    couponInfo: {
        flex: 1,
        paddingHorizontal: 12,
    },
    couponName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    couponDiscount: {
        fontSize: 14,
        color: CommonColors.primary,
        marginTop: 4,
    },
    couponMinOrder: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
    couponValidity: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
    couponAction: {
        justifyContent: "flex-end",
        alignItems: "center",
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 28,
        paddingHorizontal: 8,
        borderRadius: 3,
        borderWidth: 1,
    },
    saveButton: {
        borderColor: CommonColors.primary,
    },
    useButton: {
        backgroundColor: "#ee4d2d",
        borderColor: "#ee4d2d",
    },
    actionButtonText: {
        color: CommonColors.primary,
    },
    usedText: {
        color: CommonColors.gray,
        fontSize: 13,
    },
    appliedText: {
        color: CommonColors.primary,
        fontSize: 13,
        fontWeight: '500',
    },
})

export default CouponItemComponent;
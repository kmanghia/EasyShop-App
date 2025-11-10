import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { Text, TextInput, View } from "react-native"
import { CartShopModel } from "@/src/data/model/cart.model";
import { CouponModel } from "@/src/data/model/coupon.model";
import { useToast } from "@/src/customize/toast.context";
import CouponImage from "@/assets/images/icon_coupon.svg";
import * as CouponManagement from "@/src/data/management/coupon.management";
import CouponItemComponent from "../coupon-item/coupon-item.component";

type Props = {
    preImage: string,
    selectedCartShop: CartShopModel | null,
    onSelectCoupon?: (cart_shop_id: number, coupon: CouponModel) => void
}

const CouponSelectComponent = ({
    preImage = "",
    selectedCartShop = null,
    onSelectCoupon
}: Props) => {
    const { showToast } = useToast();
    const [coupons, setCoupons] = useState<CouponModel[]>([]);
    useEffect(() => {
        if (selectedCartShop) {
            fetchCouponShop();
        }
    }, [selectedCartShop])

    const fetchCouponShop = async () => {
        try {
            const response = await CouponManagement.fetchCouponShopMobile(selectedCartShop?.shop?.id ?? 0);
            setCoupons(response);
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
        }
    }

    const handleSaveCoupon = async (coupon_id: number) => {
        try {
            await CouponManagement.saveCouponMobile(coupon_id);
            setCoupons((prevCoupons) =>
                prevCoupons.map((coupon) =>
                    coupon.id === coupon_id
                        ? { ...coupon, is_saved: true, is_used: false } as CouponModel
                        : coupon
                )
            );
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
        }
    }

    const renderEmptyCoupons = () => {
        return (
            <View style={styles.messageContainer}>
                <View style={styles.iconContainer}>
                    <CouponImage style={{ width: 200, height: 200 }}></CouponImage>
                </View>
                <Text style={styles.message}>Chưa có mã giảm giá nào của Shop</Text>
                <Text style={styles.subMessage}>
                    Nhập mã giảm giá có thể sử dụng vào thanh bên trên
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.bottomSheetContent}>
            <Text style={styles.title}>{selectedCartShop?.shop?.shop_name} Shop Voucher</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập mã voucher của Shop"
                />
                <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Áp Dụng</Text>
                </TouchableOpacity>
            </View>

            {coupons.length === 0 ? (
                renderEmptyCoupons()
            ) : (
                <FlatList
                    data={coupons}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                        <View style={{ height: 8 }}></View>
                    )}
                    renderItem={({ item, index }) => (
                        <View key={`${item.id}-index`}>
                            <CouponItemComponent
                                item={item}
                                preImage={preImage}
                                onSaveCoupon={(coupon_id) => handleSaveCoupon(coupon_id)}
                                onUseCoupon={() =>
                                    onSelectCoupon?.(selectedCartShop?.id ?? 0, item)
                                }
                                selectedCouponId={selectedCartShop?.selectedCoupon?.id}
                            />
                        </View>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    bottomSheetContent: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    applyButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    messageContainer: {
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dot: {
        fontSize: 24,
        color: '#666',
        marginHorizontal: 5,
    },
    message: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default CouponSelectComponent;
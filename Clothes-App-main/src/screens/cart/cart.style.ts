import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get('window').width;

const CartStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    headerContainer: {
        height: 100,
        backgroundColor: 'transparent',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        position: 'relative',
    },
    paymentHeaderText: {
        fontSize: 21,
        fontWeight: '500',
    },
    loadingWrapper: {
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    loadingText: {
        fontSize: 14,
        color: CommonColors.primary
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: CommonColors.white,
    },
    priceInfoWrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    totalText: {
        fontSize: 16,
        fontWeight: '500',
        color: CommonColors.black
    },
    checkoutBtn: {
        flex: 1,
        backgroundColor: CommonColors.primary,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    checkoutBtnText: {
        fontSize: 15,
        fontWeight: '500',
        color: CommonColors.white,
        lineHeight: 24,
        fontFamily: Fonts.POPPINS_MEDIUM
    },
    changeVariantBtn: {
        minWidth: 80,
        maxWidth: 150,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: CommonColors.extraLightGray
    },

    cartShopWrapper: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10
    },
    cartShopHeader: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderColor: 'rgba(0, 0, 0, 0.16)',
        borderWidth: 1,
        borderRadius: 5,
    },
    checkboxChecked: {
        backgroundColor: CommonColors.primary,
    },
    shopNameText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000'
    },
    listCartItemWrapper: {
        paddingHorizontal: 10,
        gap: 25
    },
    cartItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cartItemInfo: {
        flexDirection: 'row',
        gap: 15
    },
    cartItemImage: {
        width: 100,
        height: 100
    },
    cartItemContent: {
        paddingVertical: 10,
        justifyContent: 'space-between'
    },
    cartItemNameText: {
        fontSize: 16
    },
    cartItemPriceAndQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    dText: {
        fontSize: 15,
        color: CommonColors.primary,
        fontWeight: '700'
    },
    priceText: {
        fontSize: 16,
        color: CommonColors.primary,
        fontWeight: '700'
    },
    devider: {
        marginVertical: 15,
        height: 1,
        width: width,
        backgroundColor: CommonColors.extraLightGray
    },
    promotionWrapper: {
        paddingHorizontal: 10
    },
    promotionItem: {
        height: 40,
        width: width,
        flexDirection: 'row',
        gap: 15
    },
    promotionText: {
        fontSize: 15
    },
    stockQuantityText: {
        fontSize: 14,
        color: CommonColors.lightGray
    },

    // Empty cart
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyCartImage: {
        width: 150, // Giảm kích thước cho hợp lý hơn
        height: 150,
    },
    emptyCartText: {
        fontSize: 16,
        color: CommonColors.lightGray,
        marginTop: 20,
        fontFamily: Fonts.POPPINS_REGULAR, // Đồng bộ font nếu có
    },
    shopNowButton: {
        marginTop: 20,
        backgroundColor: CommonColors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    shopNowButtonText: {
        fontSize: 15,
        color: CommonColors.white,
        fontWeight: '500',
        fontFamily: Fonts.POPPINS_MEDIUM,
    },
});

export default CartStyle;
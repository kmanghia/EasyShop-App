import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const ProductDetailStyle = StyleSheet.create({
    headerContainer: {
        height: 100,
        backgroundColor: 'transparent',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        position: 'absolute',
        zIndex: 9999
    },
    container: {
        paddingVertical: 10,
        backgroundColor: CommonColors.white,
        gap: 5
    },
    btnBack: {
        backgroundColor: 'rgba(0, 0, 0, 0.16)',
        borderRadius: 30,
        position: 'absolute',
        left: 20,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        top: 50,
        zIndex: 100
    },
    btnCart: {
        backgroundColor: 'rgba(0, 0, 0, 0.16)',
        borderRadius: 30,
        position: 'absolute',
        right: 20,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        top: 50,
        zIndex: 100
    },
    metaInfoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    priceAndRatingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        marginLeft: 5,
        fontSize: 14,
        fontFamily: Fonts.POPPINS_REGULAR,
        lineHeight: 19,
        fontWeight: '400',
        color: CommonColors.gray
    },
    soldAndLikeWrapper: {
        flexDirection: 'row',
        gap: 8
    },
    soldTxt: {
        color: CommonColors.lightGray,
        fontSize: 14,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        paddingHorizontal: 20,
        color: CommonColors.black,
        letterSpacing: 0.6,
        lineHeight: 32
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    price: {
        fontSize: 18,
        fontFamily: Fonts.POPPINS_BOLD,
        fontWeight: '600',
        lineHeight: 26,
        color: CommonColors.black
    },
    priceDiscount: {
        backgroundColor: CommonColors.extraLightGray,
        padding: 5,
        borderRadius: 5
    },
    priceDiscountTxt: {
        fontSize: 14,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        color: CommonColors.primary
    },
    oldPrice: {
        fontSize: 16,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        textDecorationLine: 'line-through',
        color: CommonColors.gray
    },
    variantWrapper: {

    },
    variantInfoWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 5
    },
    variantText: {
        fontSize: 14
    },
    descriptionWrapper: {

    },
    descHeader: {
        paddingHorizontal: 20,
    },
    descTxt: {
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: Fonts.POPPINS_MEDIUM,
        lineHeight: 24,
        fontWeight: '500'
    },
    shopWrapper: {
        height: 70,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    shopInfoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    shopContent: {
        justifyContent: 'space-between',
        height: 50
    },
    shopNameText: {
        fontSize: 16,
        fontWeight: '700'
    },
    shopAddressText: {
        fontSize: 13,
        color: CommonColors.gray
    },
    productShopWrapper: {
        paddingHorizontal: 20,
        gap: 10
    },
    productShopText: {
        fontSize: 15,
        fontWeight: '700'
    },
    buttonShopView: {
        borderWidth: 1,
        borderColor: CommonColors.primary,
        padding: 6,
        borderRadius: 4
    },
    buttonShopViewText: {
        color: CommonColors.primary
    },
    devider: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.16)'
    },
    buttonWrapper: {
        position: 'absolute',
        height: 90,
        padding: 20,
        bottom: 0,
        width: "100%",
        backgroundColor: CommonColors.white,
        flexDirection: 'row',
        gap: 10
    },
    button: {
        flex: 1,
        backgroundColor: CommonColors.primary,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        gap: 5,
        elevation: 5,
        shadowColor: CommonColors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    buttonTxt: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: Fonts.POPPINS_MEDIUM,
        lineHeight: 24,
        color: CommonColors.white
    },
    emptyContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'transparent'
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontSize: 15
    },
})

export default ProductDetailStyle;
import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const CartItemComponentStyle = StyleSheet.create({
    cartItemWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: CommonColors.lightGray,
        borderRadius: 5
    },
    cartItemInfoWrapper: {
        flex: 1,
        alignSelf: 'flex-start',
        gap: 10
    },
    cartItemImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginRight: 10
    },
    cartItemText: {
        fontSize: 15,
        fontWeight: '500',
        fontFamily: Fonts.POPPINS_MEDIUM,
        lineHeight: 24,
        color: CommonColors.black,
    },
    cartItemControlWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    quantityControlWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    quantityControl: {
        padding: 5,
        borderWidth: 1,
        borderColor: CommonColors.lightGray,
        borderRadius: 5
    }
})

export default CartItemComponentStyle;
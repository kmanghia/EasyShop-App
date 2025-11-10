import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { Dimensions, StyleSheet } from "react-native";

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const ShopSearchStyle = StyleSheet.create({
    /** Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'white',
    },


    headerContainer: {
        width: WIDTH_SCREEN,
        height: 100,
        backgroundColor: CommonColors.extraLightGray,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20,
        position: 'absolute',
        zIndex: 1000000000000000
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 15,
    },
    searchContainer: {
        width: WIDTH_SCREEN * 0.8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 5,
        gap: 10,
        marginLeft: 18
    },
    textTitle: {
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 1.2,
        fontFamily: Fonts.ROBOTO_MEDIUM
    },

    container: {
        flex: 1,
        backgroundColor: CommonColors.extraLightGray,
        paddingTop: 10,
    },
    itemsWrapper: {
        width: WIDTH_SCREEN,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        marginBottom: 50,
    },
    productWrapper: {
        width: (WIDTH_SCREEN / 2) - 16,
        marginBottom: 10
    },

    btnSearchMore: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: WIDTH_SCREEN,
        height: 50
    },
    btnSearchMoreText: {
        fontSize: 18,
        color: CommonColors.primary
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontSize: 15
    },
});

export default ShopSearchStyle;
import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { Platform, StyleSheet } from "react-native";

const FlashSaleComponentStyle = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
        marginHorizontal: 20,

    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
        borderBottomWidth: 2,
        borderBottomColor: '#33adff',
    },
    titleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    titleBtn: {
        fontSize: 15,
        fontWeight: '500',
        color: '#33adff',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
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

export default FlashSaleComponentStyle;
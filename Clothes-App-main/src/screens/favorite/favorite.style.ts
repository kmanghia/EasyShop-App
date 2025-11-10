import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const FavoriteStyle = StyleSheet.create({
    headerContainer: {
        height: 100,
        backgroundColor: CommonColors.white,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20,
        position: 'relative',
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 15,
    },
    paymentHeaderText: {
        fontSize: 21,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
})

export default FavoriteStyle;
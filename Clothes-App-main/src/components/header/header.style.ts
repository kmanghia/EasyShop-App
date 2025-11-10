import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const HeaderStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: CommonColors.white,
        paddingHorizontal: 20,
        paddingBottom: 10,
        gap: 15
    },
    logo: {
        fontSize: 24,
        fontFamily: Fonts.POPPINS_BOLD,
        color: CommonColors.primary,
    },
    searchBar: {
        flex: 1,
        backgroundColor: CommonColors.background,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    searchTxt: {
        color: CommonColors.gray
    },
    buttonMessage: {
        backgroundColor: CommonColors.primary,
        height: 35,
        width: 35,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default HeaderStyle;
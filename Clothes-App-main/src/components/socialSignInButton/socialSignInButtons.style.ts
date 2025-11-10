import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const SocialSignInButtonStyle = StyleSheet.create({
    socialSignInWrapper: {
        alignSelf: 'stretch',
    },
    button: {
        flexDirection: 'row',
        padding: 10,
        borderColor: CommonColors.gray,
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        gap: 5
    },
    btnTxt: {
        fontSize: 14,
        fontFamily: Fonts.POPPINS_BOLD,
        color: CommonColors.black,
    },
})

export default SocialSignInButtonStyle;
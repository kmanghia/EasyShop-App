import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const WelcomeStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end'
    },
    wrapper: {
        paddingBottom: 50,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        color: CommonColors.primary,
        fontFamily: Fonts.POPPINS_BOLD,
        letterSpacing: 2.4,
        marginBottom: 5
    },
    description: {
        fontSize: 14,
        color: CommonColors.gray,
        fontFamily: Fonts.POPPINS_REGULAR,
        letterSpacing: 1.2,
        lineHeight: 30,
        marginBottom: 20
    },
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
    btnStart: {
        flexDirection: 'row',
        padding: 10,
        borderColor: 'transparent',
        backgroundColor: CommonColors.primary,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        gap: 5,
        width: 320
    },
    btnTxt: {
        fontSize: 14,
        fontFamily: Fonts.POPPINS_BOLD,
        color: CommonColors.black,
    },
    signInWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        gap: 5
    },
    signInTxt: {
        fontSize: 14,
        color: CommonColors.black,
        fontFamily: Fonts.POPPINS_REGULAR,
    },
    signInTxtSpan: {
        fontSize: 18,
        color: CommonColors.white,
        fontWeight: '700',
        letterSpacing: 2
    }
});

export default WelcomeStyle;
import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { Platform, StyleSheet } from "react-native";

const SignInStyle = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20,
    },
    container: {
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    logo: {
        width: 150,
        height: 50,
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 25,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
    },
    section: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: '#374151',
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 8,
        overflow: 'hidden'
    },
    inputError: {
        borderColor: '#ef4444',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1f2937',
    },
    icon: {
        padding: 10,
    },
    error: {
        fontSize: 12,
        color: '#ef4444',
    },
    submitButton: {
        marginTop: 16,
        borderRadius: 5,
        backgroundColor: '#33adff',
        overflow: 'hidden',
        paddingVertical: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    signInWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        gap: 5,
    },
    signInTxt: {
        fontSize: 14,
        color: CommonColors.black,
    },
    signInTxtSpan: {
        color: '#33adff',
        fontWeight: '700'
    },
});

export default SignInStyle;
import { CommonColors } from "@/src/common/resource/colors";
import { Platform, StyleSheet } from "react-native";

const SignUpStyle = StyleSheet.create({
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
    phonePrefix: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRightWidth: 1,
        borderRightColor: '#d1d5db',
        backgroundColor: '#f3f4f6',
    },
    phonePrefixText: {
        fontSize: 14,
        color: '#374151',
    },
    phoneInput: {
        flex: 1,
    },
    icon: {
        padding: 10,
    },
    error: {
        fontSize: 12,
        color: '#ef4444',
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#33adff',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    avatarText: {
        color: '#a1a1aa',
        fontSize: 10,
        marginTop: 4,
    },
    genderSelectionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    genderWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 36,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#d1d5db',
        backgroundColor: '#fff',
    },
    genderActiveWrapper: {
        borderColor: '#33adff',
        backgroundColor: 'rgba(240,248,255,0.9)',
    },
    genderText: {
        fontSize: 13,
        color: '#374151',
    },
    genderActiveText: {
        color: CommonColors.primary,
        fontWeight: '600',
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
        gap: 3,
    },
    signInTxt: {
        fontSize: 14,
        color: CommonColors.black,
    },
    signInTxtSpan: {
        color: '#33adff',
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 2
    },
});

export default SignUpStyle;
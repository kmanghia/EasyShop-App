import { CommonColors } from "@/src/common/resource/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width: WIDTH_SCREEN } = Dimensions.get('window');

const ChangePasswordStyle = StyleSheet.create({
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
    btnSaveForm: {
        position: 'absolute',
        top: 50,
        right: 20,
    },
    btnSaveFormText: {
        fontSize: 16,
        fontWeight: '500',
        color: CommonColors.primary
    },

    container: {
        flex: 1,
    },
    sectionWrapper: {
        backgroundColor: '#FFF',
        width: WIDTH_SCREEN,
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    section: {
        marginBottom: 5,
        position: 'relative'
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 2,
        marginBottom: 8,
    },
    inputError: {
        borderColor: 'red',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    submitButton: {
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
    icon: {
        position: 'absolute',
        top: '50%',
        right: 5,
        transform: 'translate(-50%, -50%)'
    },
    error: {
        color: 'red',
        fontSize: 13,
        marginBottom: 8,
    },
});

export default ChangePasswordStyle;
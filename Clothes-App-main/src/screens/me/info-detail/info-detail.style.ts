import { CommonColors } from "@/src/common/resource/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width: WIDTH_SCREEN } = Dimensions.get('window');

const InfoDetailStyle = StyleSheet.create({
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
    phonePrefix: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        backgroundColor: '#ccc',
    },
    phonePrefixText: {
        fontSize: 16,
        color: '#333',
    },
    phoneInput: {
        flex: 1,
    },
    genderSelectionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 8
    },
    genderWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 36,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#CCC'
    },
    genderActiveWrapper: {
        borderColor: CommonColors.primary
    },
    genderText: {
        fontSize: 14
    },
    genderActiveText: {
        color: CommonColors.primary
    },
    avatarInfo: {

    },
    avatarWrapper: {
        marginBottom: 20,
        height: 80,
        width: Dimensions.get('window').width,
        position: 'relative'
    },
    avatar: {
        height: 80,
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#CCC',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-66%, -50%)'
    },
    avatarImage: {
        width: 80,
        height: 80
    },
    editImageButton: {
        marginTop: 'auto',
        marginHorizontal: 'auto',
        backgroundColor: CommonColors.primary,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 36,
        paddingHorizontal: 10
    },
    editImageButtonText: {
        fontSize: 15,
        color: CommonColors.white,
        fontWeight: '500'
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

export default InfoDetailStyle;
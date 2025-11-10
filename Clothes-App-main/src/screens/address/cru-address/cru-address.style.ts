import { CommonColors } from '@/src/common/resource/colors';
import { StyleSheet } from 'react-native';

const CRUAddressStyle = StyleSheet.create({
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
        borderRadius: 4,
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
    icon: {
        padding: 12,
    },
    bottomSheetContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    resetButton: {
        color: 'red',
        fontSize: 16,
    },
    stepsContainer: {
        flexDirection: 'column',
    },
    stepContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    breadcrumb: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    breadcrumbText: {
        fontSize: 14,
        color: '#333',
    },
    breadcrumbDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginRight: 8,
    },
    breadcrumbDotActive: {
        backgroundColor: 'red',
    },
    breadcrumbTextActive: {
        color: 'red',
    },
    breadcrumbArrow: {
        fontSize: 14,
        color: 'red',
        marginHorizontal: 4,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listItemText: {
        fontSize: 16,
        color: '#333',
    },
    checkmark: {
        fontSize: 16,
        color: 'green',
    },
    addressTypeContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    addressTypeButton: {
        width: 85,
        height: 30,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressTypeSelected: {
        borderColor: CommonColors.primary,
        backgroundColor: CommonColors.white,
    },
    addressTypeText: {
        fontSize: 13,
        color: '#333',
    },
    addressTypeTextSelected: {
        color: CommonColors.primary,
    },
    addressText: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: CommonColors.primary,
        padding: 12,
        borderRadius: 3,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
    error: {
        color: 'red',
        fontSize: 13,
        marginBottom: 8,
    },
});

export default CRUAddressStyle;
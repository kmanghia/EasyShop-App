import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const AddressStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    addressContainer: {
        paddingVertical: 15,
        backgroundColor: CommonColors.white,
        paddingHorizontal: 20
    },
    phoneText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        marginVertical: 5,
    },
    defaultLabel: {
        fontSize: 13,
        color: CommonColors.primary,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
    },
    addButtonContainer: {
        paddingVertical: 20,
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: CommonColors.white
    },
    addButtonText: {
        fontSize: 16,
        color: CommonColors.primary,
        fontWeight: 'bold',
    },
});

export default AddressStyle;
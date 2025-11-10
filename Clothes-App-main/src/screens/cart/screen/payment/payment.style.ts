import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const PaymentStyle = StyleSheet.create({
    /** Header */
    headerContainer: {
        height: 100,
        backgroundColor: CommonColors.white,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20,
        position: 'relative'
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 15
    },
    paymentHeaderText: {
        fontSize: 21,
        fontWeight: '500',
    },
    /** Scroll Content */
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollView: {
        flex: 1, // Đảm bảo ScrollView không chiếm không gian footer
    },

    section: {
        backgroundColor: '#FFF',
        padding: 15,
        marginBottom: 10,
        borderRadius: 12
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    addressText: {
        fontSize: 14,
        color: '#555',
    },
    shopName: {
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: '100%',
        paddingRight: 20
    },
    favoriteLabel: {
        color: '#FF6347',
        fontSize: 12,
    },
    productRow: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    productDetails: {
        flex: 1,
        marginLeft: 10,
    },
    productName: {
        fontSize: 14,
        color: '#333',
        maxWidth: '90%'
    },
    variant: {
        fontSize: 12,
        color: '#888',
        marginVertical: 5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: CommonColors.primary,
        marginRight: 10,
    },
    quantity: {
        fontSize: 14,
        color: '#333',
    },
    shippingOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 5,
    },
    shippingMethod: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00CED1',
    },
    shippingFee: {
        fontSize: 14,
        color: '#333',
    },
    shippingDetails: {
        fontSize: 13,
        color: '#555',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: CommonColors.primary,
    },
    paymentMethod: {
        marginTop: 10,
    },
    paymentMethodOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paymentMethodText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        marginLeft: 10,
    },
    detailLabel: {
        fontSize: 14,
        color: '#555',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
    },
    termsNote: {
        fontSize: 12,
        color: '#888',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        marginTop: 'auto'
    },
    footerTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    footerSavings: {
        fontSize: 13,
        color: CommonColors.primary,
    },
    orderButton: {
        backgroundColor: CommonColors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    orderButtonText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
    devider: {
        marginVertical: 15,
        height: 1,
        width: '100%',
        backgroundColor: CommonColors.extraLightGray
    },
});

export default PaymentStyle;
import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const OrderManageStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
        marginTop: 25,
    },
    tabContainer: {
        height: 80
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        minWidth: 100,
        maxWidth: 120,
        alignItems: 'center',
        height: 80,
        gap: 5
    },
    activeTab: {
        backgroundColor: CommonColors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: CommonColors.black,
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    listContainer: {
        paddingBottom: 16,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    orderStatus: {
        fontSize: 14,
        fontWeight: '500',
    },
    orderDate: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8,
    },
    shopContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
        marginBottom: 8,
    },
    shopNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10
    },
    shopName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    itemPreview: {
        fontSize: 13,
        color: '#4B5563',
        marginBottom: 4,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: '700',
        color: CommonColors.primary,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 32,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    modalSection: {
        marginBottom: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    shopDetail: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    itemDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemImage: {
        width: 80,
        height: 80,
        marginRight: 10
    },
    itemName: {
        fontSize: 15,
        color: CommonColors.black,
        flex: 1,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#6B7280',
        marginHorizontal: 8,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    shopSummary: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    shopSubtotal: {
        fontSize: 14,
        color: '#6B7280',
    },
    shopDiscount: {
        fontSize: 14,
        color: CommonColors.primary,
    },
    shopTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: CommonColors.primary,
        marginTop: 4,
    },
    closeButton: {
        backgroundColor: CommonColors.primary,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
})

export default OrderManageStyle;
import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const ReviewStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 25
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    tabContainer: {
        height: 50
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
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
    pendingReviewCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    reviewContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8,
    },
    rateButton: {
        backgroundColor: CommonColors.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    rateButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    ratedReviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#34D399',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        overflow: 'hidden'
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    starContainer: {
        flexDirection: 'row',
    },
    variantText: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8,
    },
    reviewComment: {
        fontSize: 14,
        color: '#1F2937',
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratedProductImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 8,
    },
    ratedProductName: {
        fontSize: 13,
        color: '#4B5563',
        flex: 1,
    },
    feedbackContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    feedbackText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#F9FAFB',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    viewRatedButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: CommonColors.primary,
    },
    viewRatedButtonText: {
        color: CommonColors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
})

export default ReviewStyle;
import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const ProductReviewStyle = StyleSheet.create({
    reviewWrapper: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: CommonColors.white,
    },
    reviewHeader: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    reviewTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: CommonColors.black,
    },
    ratingDistribution: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingAverageContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 16
    },
    ratingAverage: {
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 48,
        fontWeight: '700',
        color: '#111827',
    },
    stars: {
        flexDirection: 'row',
        marginLeft: 12,
    },
    reviewCount: {
        fontSize: 16,
        color: '#6B7280',
        marginLeft: 12,
    },
    ratingDistributionList: {
        flexDirection: 'column',
        borderLeftColor: CommonColors.lightGray,
        borderLeftWidth: 1,
        paddingLeft: 16
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingCount: {
        backgroundColor: CommonColors.yellow,
        paddingVertical: 6,
    },
    ratingCountText: {
        fontSize: 13,
        color: CommonColors.lightGray,
    },
    ratingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    ratingLabelStars: {
        flexDirection: 'row',
    },
    ratingLabelText: {
        fontSize: 14,
        color: '#374151',
        marginRight: 8,
    },
    reviewItem: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        // borderBottomColor: CommonColors.lightGray,
        // borderBottomWidth: 1
    },
    reviewUser: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#34D399',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 6,
    },
    starContainer: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontSize: 14,
        color: '#1F2937',
        marginBottom: 12,
    },
    reviewDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },

    // Footer
    footerContainer: {
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: CommonColors.white,
    },
    footerLine: {
        height: 1,
        width: "80%",
        backgroundColor: "#E5E7EB",
        marginBottom: 15,
    },
    footerText: {
        fontSize: 16,
        color: "#6B7280",
        marginBottom: 15,
    },
    footerButton: {
        backgroundColor: CommonColors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    footerButtonText: {
        color: CommonColors.white,
        fontSize: 14,
        fontWeight: "600",
    },
    listContent: {
        paddingBottom: 20,
    },
})

export default ProductReviewStyle;
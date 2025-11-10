import { CommonColors } from "@/src/common/resource/colors";
import { formatDate } from "@/src/common/utils/time.helper";
import { ProductModel } from "@/src/data/model/product.model";
import { ProductReviewModel } from "@/src/data/model/review.model";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";

type Props = {
    preImage: string,
    product: ProductModel,
    reviews: ProductReviewModel[],
    totalReviews: number,
}

const ReviewListComponent = ({
    preImage,
    product,
    reviews = [],
    totalReviews = 0
}: Props) => {

    const navigateListReviewProductScreen = () => {
        router.navigate({
            pathname: '/(routes)/product-review',
            params: {
                product_id: product.id,
                avgRating: product.rating
            }
        })
    }

    const calculatRatingDistribution = () => {
        let distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            const rating = review.review?.rating ?? 0;
            if (rating >= 1 && rating <= 5) {
                distribution[rating as keyof typeof distribution] = (distribution[rating as keyof typeof distribution] || 0) + 1;
            }
        });

        return distribution;
    }

    const ratingDistribution: { [key: number]: number } = calculatRatingDistribution();

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={"star"}
                    size={16}
                    color={i <= rating ? "#FFD700" : "#D1D5DB"}
                    style={{ marginRight: 4 }}
                />
            );
        }
        return stars;
    };

    const renderFullStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={"star"}
                    size={14}
                    color={i <= rating ? CommonColors.yellow : CommonColors.lightGray}
                    style={{ marginRight: 2 }}
                />
            );
        }
        return <View style={reviewStyles.ratingLabelStars}>{stars}</View>;
    };

    const renderRatingDistribution = () => {
        return (
            <TouchableOpacity onPress={navigateListReviewProductScreen} style={reviewStyles.ratingDistribution}>
                <View style={reviewStyles.ratingAverageContainer}>
                    <View style={[reviewStyles.ratingAverage]}>
                        <Text style={reviewStyles.ratingText}>{Number(product.rating).toFixed(1)}</Text>
                        <View style={reviewStyles.stars}>
                            {renderStars(Number(product.rating))}
                        </View>
                    </View>
                    <Text style={reviewStyles.reviewCount}>({totalReviews} đánh giá)</Text>
                </View>
                <View style={reviewStyles.ratingDistributionList}>
                    {Object.entries(ratingDistribution).reverse().map(([stars, count]) => (
                        <View key={stars} style={reviewStyles.ratingRow}>
                            <Text style={reviewStyles.ratingLabelText}>{stars} sao</Text>
                            <View style={reviewStyles.ratingLabel}>
                                {renderFullStars(Number(stars))}
                            </View>
                            <Text style={reviewStyles.ratingCountText}>({count} đánh giá)</Text>
                        </View>
                    ))}
                </View>
                <MaterialIcons style={{ marginLeft: 'auto' }} name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
        );
    };

    return (
        <View style={reviewStyles.reviewWrapper}>
            <View style={reviewStyles.reviewHeader}>
                <Text style={reviewStyles.reviewTitle}>Đánh giá sản phẩm</Text>
                {renderRatingDistribution()}
            </View>
            {reviews.slice(0, 2).map((review) => (
                <View key={review.id} style={reviewStyles.reviewItem}>
                    <View style={reviewStyles.reviewUser}>
                        <View style={reviewStyles.avatar}>
                            <Image style={{ width: '100%', height: '100%' }} source={{ uri: `${preImage}/${review.user?.image_url}` }} />
                        </View>
                        <View style={reviewStyles.userDetails}>
                            <Text style={reviewStyles.userName}>{review.user?.name === '' ? 'Anonymous' : review.user?.name}</Text>
                            <View style={reviewStyles.starContainer}>{renderStars(review.review?.rating ?? 0)}</View>
                        </View>
                    </View>
                    <Text style={reviewStyles.reviewComment}>{review.review?.comment}</Text>
                    <Text style={reviewStyles.reviewDate}>{formatDate(new Date(review.review?.created_at ?? new Date()))}</Text>
                </View>
            ))}
        </View>
    )
}

const reviewStyles = StyleSheet.create({
    reviewWrapper: {
        paddingVertical: 12,
        backgroundColor: CommonColors.white,
    },
    reviewHeader: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    reviewTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: CommonColors.primary,
        marginBottom: 12,
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
});

export default ReviewListComponent;
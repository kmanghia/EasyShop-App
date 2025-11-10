import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import ProductReviewStyle from "./product-review.style";
import { CommonColors } from "@/src/common/resource/colors";
import { ProductReviewModel } from "@/src/data/model/review.model";
import * as ReviewManagement from "@/src/data/management/review.management";
import { PaginateModel } from "@/src/common/model/paginate.model";
import { formatDate } from "@/src/common/utils/time.helper";
import { AppConfig } from "@/src/common/config/app.config";
import { useToast } from "@/src/customize/toast.context";
import { MessageError } from "@/src/common/resource/message-error";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

const ProductReviewScreen = () => {
    const route = useRoute();
    const preImage = new AppConfig().getPreImage();
    const { product_id, avgRating } = route.params as {
        product_id: number,
        avgRating: number
    }
    const { showToast } = useToast();
    const [reviews, setReviews] = useState<ProductReviewModel[]>([]);
    const [reviewPaginate, setReviewPaginate] = useState<PaginateModel>(new PaginateModel().convertObj({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    }))
    const isReachedEnd = useRef<boolean>(false);
    const isFetching = useRef<boolean>(false);
    const isFirstFetching = useRef<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    useEffect(() => {
        fetchListProductReview(1);
    }, [])

    const fetchListProductReview = async (page: number) => {
        try {
            if (isReachedEnd.current || isFetching.current) {
                setIsRefreshing(false);
                return;
            }
            isFetching.current = true;
            const response = await ReviewManagement.fetchListReviewProduct(
                +product_id,
                page,
                reviewPaginate.limit
            );

            if (page === 1) {
                setReviews(response.get("reviews"));
            } else {
                setReviews((prev) => [...prev, ...response.get("reviews")]);
            }
            setReviewPaginate(response.get('paginate'));

            if (page >= response.get('paginate').totalPages) {
                isReachedEnd.current = true;
            }
            isFetching.current = false;
            setIsRefreshing(false);
        } catch (error) {
            console.log(error);
            isFetching.current = false;
            setIsRefreshing(false);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        setReviewPaginate((prev) => ({ ...prev, currentPage: 1 } as PaginateModel));
        fetchListProductReview(1);
    };

    const loadingMore = async () => {
        if (!isFetching.current && !isReachedEnd.current) {
            const currentPage = reviewPaginate.currentPage + 1;
            setReviewPaginate((prev) => ({ ...prev, currentPage: currentPage } as PaginateModel));
            await fetchListProductReview(currentPage);
        }
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
        return <View style={styles.ratingLabelStars}>{stars}</View>;
    };

    const renderRatingDistribution = () => {
        return (
            <View style={styles.ratingDistribution}>
                <View style={styles.ratingAverageContainer}>
                    <View style={[styles.ratingAverage]}>
                        <Text style={styles.ratingText}>{Number(avgRating).toFixed(1)}</Text>
                        <View style={styles.stars}>
                            {renderStars(Number(avgRating))}
                        </View>
                    </View>
                    <Text style={styles.reviewCount}>({reviewPaginate.totalItems} đánh giá)</Text>
                </View>
                <View style={styles.ratingDistributionList}>
                    {Object.entries(ratingDistribution).reverse().map(([stars, count]) => (
                        <View key={stars} style={styles.ratingRow}>
                            <Text style={styles.ratingLabelText}>{stars} sao</Text>
                            <View style={styles.ratingLabel}>
                                {renderFullStars(Number(stars))}
                            </View>
                            <Text style={styles.ratingCountText}>({count} đánh giá)</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.reviewWrapper}>
            <View style={styles.reviewHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 25, gap: 10 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <AntDesign name="arrowleft" size={25} color={CommonColors.black} style={{ marginTop: 5 }} />
                    </TouchableOpacity>
                    <Text style={[styles.reviewTitle, { fontSize: 25 }]}>Sản phẩm #{product_id}</Text>
                </View>
                {renderRatingDistribution()}
            </View>
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.reviewItem}>
                        <View style={styles.reviewUser}>
                            <View style={styles.avatar}>
                                <Image style={{ width: '100%', height: '100%' }} source={{ uri: `${preImage}/${item.user?.image_url}` }} />
                            </View>
                            <View style={styles.userDetails}>
                                <Text style={styles.userName}>{item.user?.name === '' ? 'Anonymous' : item.user?.name}</Text>
                                <View style={styles.starContainer}>{renderStars(item.review?.rating ?? 0)}</View>
                            </View>
                        </View>
                        <Text style={styles.reviewComment}>{item.review?.comment}</Text>
                        <Text style={styles.reviewDate}>{formatDate(new Date(item.review?.created_at ?? new Date()))}</Text>
                    </View>
                )}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => (
                    <View style={styles.footerContainer}>
                        <View style={styles.footerLine} />
                        {isReachedEnd.current && !isFetching.current && (
                            <Animated.View entering={FadeInDown.delay(300).duration(300).springify()}>
                                <Text style={styles.footerText}>
                                    Không tìm thấy đánh giá
                                </Text>
                            </Animated.View>
                        )}
                        {!isReachedEnd.current && !isFetching.current && (
                            <Animated.View entering={FadeInDown.delay(300).duration(300).springify()}>
                                <TouchableOpacity onPress={loadingMore} style={styles.footerButton}>
                                    <Text style={styles.footerButtonText}>
                                        Xem thêm đánh giá
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                        {!isReachedEnd.current && isFetching.current && (
                            <ActivityIndicator size={"large"} color={CommonColors.primary} />
                        )}
                    </View>
                )}
            />
        </View>
    )
}

const styles = ProductReviewStyle;

export default ProductReviewScreen;
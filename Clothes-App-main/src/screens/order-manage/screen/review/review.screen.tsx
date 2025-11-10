import { useEffect, useRef, useState } from "react";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, Modal, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import { useToast } from "@/src/customize/toast.context";
import { AppConfig } from "@/src/common/config/app.config";
import { formatDate } from "@/src/common/utils/time.helper";
import { router } from "expo-router";
import { mockReviews } from "@/src/data/json/review.data-json";
import ReviewStyle from "./review.style";
import { ProductReviewModel, ReviewModel } from "@/src/data/model/review.model";
import * as ReviewManagement from "@/src/data/management/review.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/data/types/global";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { MessageError } from "@/src/common/resource/message-error";
import { CategoryModel } from "@/src/data/model/category.model";

const ReviewScreen = () => {
    const preImage = new AppConfig().getPreImage();
    const { showToast } = useToast();
    const tabs = ["Chưa đánh giá", "Đã đánh giá"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [displayReviews, setDisplayReviews] = useState<any[]>([]);
    const [unreviewedPurchases, setUnreviewedPurchases] = useState<ProductReviewModel[]>([]);
    const [reviewedPurchases, setReviewedPurchases] = useState<ProductReviewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const firstFetch = useRef(true);
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const dispatch = useDispatch();

    const [selectedItem, setSelectedItem] = useState<ProductReviewModel | null>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        fetchUnreviewedPurchases();
        fetchReviewedPurchases();
    }, []);

    const fetchUnreviewedPurchases = async () => {
        try {
            const unreviewedSource = await ReviewManagement.fetchListUnreviewPurchaseUser();
            setUnreviewedPurchases(unreviewedSource);
            if (firstFetch.current) {
                firstFetch.current = false;
                setDisplayReviews(unreviewedSource);
            }
        } catch (error) {
            console.log('ReviewScreen 47: ', error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const fetchReviewedPurchases = async () => {
        try {
            const reviewedSource = await ReviewManagement.fetchListReviewedPurchaseUser();
            setReviewedPurchases(reviewedSource);
        } catch (error) {
            console.log('ReviewScreen 57: ', error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const filterReviews = (tab: string) => {
        setActiveTab(tab);
        if (tab === "Chưa đánh giá") {
            setDisplayReviews(unreviewedPurchases);
        } else {
            setDisplayReviews(reviewedPurchases);
        }
    };

    const navigateProductDetail = (item: ProductReviewModel) => {
        router.navigate({
            pathname: "/(routes)/product-details",
            params: {
                id: item.product_id
            }
        })
    }

    const renderTab = (tab: string) => (
        <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
            onPress={() => filterReviews(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
                {tab}
            </Text>
        </TouchableOpacity>
    );

    const renderPendingReviewItem = ({ item, index }: { item: ProductReviewModel, index: number }) => {
        return (
            <TouchableOpacity style={styles.pendingReviewCard}>
                <Image
                    style={styles.productImage}
                    source={{ uri: `${preImage}/${item.image_url}` }}
                />
                <View style={styles.reviewContent}>
                    <Text style={styles.productName}>{item.product_name}</Text>
                    <Text style={styles.orderDate}>Đơn hàng: {formatDate(new Date(item.purchased_at ?? new Date()))}</Text>
                    <TouchableOpacity
                        style={styles.rateButton}
                        onPress={() => {
                            setSelectedItem(item);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.rateButtonText}>Đánh giá ngay</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const renderRatedReviewItem = ({ item }: { item: ProductReviewModel }) => {
        const renderStars = (rating: number) => {
            const stars = [];
            for (let i = 0; i < 5; i++) {
                stars.push(
                    <AntDesign
                        key={i}
                        name="star"
                        size={14}
                        color={i < rating ? "#FFD700" : "#D1D5DB"}
                    />
                );
            }
            return stars;
        };

        const renderCategory = (category?: CategoryModel) => {
            if (!category) {
                return "Không có phân loại";
            }

            let render = [];
            render.push(category.category_name);
            if (category.parent) {
                render.unshift(category.parent.category_name);
            }

            return render.join(', ');
        }

        return (
            <TouchableOpacity style={styles.ratedReviewCard}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Image style={{ width: '100%', height: '100%' }} source={{ uri: `${preImage}/${item.user?.image_url}` }} />
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{item.user?.name === '' ? 'Anonymous' : item.user?.name}</Text>
                        <View style={styles.starContainer}>{renderStars(item.review?.rating ?? 0)}</View>
                    </View>
                </View>
                <Text style={styles.variantText}>
                    Phân loại: {renderCategory(item.category)}
                </Text>
                <Text style={styles.reviewComment}>{item.review?.comment}</Text>
                <Text style={styles.reviewDate}>{formatDate(new Date(item.created_at ?? new Date()))}</Text>
                <TouchableOpacity onPress={() => navigateProductDetail(item)} style={styles.productInfo}>
                    <Image
                        style={styles.ratedProductImage}
                        source={{ uri: `${preImage}/${item.image_url}` }}
                    />
                    <Text style={styles.ratedProductName}>{item.product_name}</Text>
                    <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <AntDesign name="star" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>
                Không có sản phẩm nào để {activeTab.toLowerCase()}
            </Text>
            <Text style={styles.emptySubText}>
                Bạn đã hoàn tất đánh giá tất cả sản phẩm.
            </Text>
            {activeTab === "Chưa đánh giá" && (
                <TouchableOpacity style={styles.viewRatedButton} onPress={() => filterReviews("Đã đánh giá")}>
                    <Text style={styles.viewRatedButtonText}>Xem các sản phẩm đã đánh giá</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const handleSubmitReview = async () => {
        if (!selectedItem || rating === 0) {
            showToast("Vui lòng chọn số sao và kiểm tra lại thông tin", "error");
            return;
        }

        setLoading(true);
        try {
            const reviewModel = new ReviewModel();
            reviewModel.rating = rating;
            reviewModel.comment = comment;

            const payload = new ProductReviewModel().convertDataToModel(selectedItem, reviewModel);
            const response = await ReviewManagement.addReviewPurchaseUser(payload);

            payload.id = response.id;
            payload.review = response;
            payload.created_at = response.created_at;

            showToast("Đánh giá thành công", "success");

            setReviewedPurchases(prev => [payload, ...prev]);
            let updatedList = [...unreviewedPurchases];
            updatedList = updatedList.filter(item => item.id !== selectedItem.id);
            setUnreviewedPurchases(updatedList);
            setDisplayReviews(updatedList);

            setModalVisible(false);
            setRating(0);
            setComment("");
        } catch (error: any) {
            console.log('ReviewScreen 170: ', error);
            if (error?.message === 'OrderItem này đã được đánh giá') {
                showToast(MessageError.ALREADY_REVIEWED_PRODUCT, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderRatingStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <AntDesign
                        name="star"
                        size={30}
                        color={i <= rating ? "#FFD700" : "#D1D5DB"}
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={CommonColors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá của tôi</Text>
            </View>
            <View style={{ marginBottom: 16 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                    {tabs.map(renderTab)}
                </ScrollView>
            </View>
            <FlatList
                data={displayReviews}
                renderItem={activeTab === "Chưa đánh giá" ? renderPendingReviewItem : renderRatedReviewItem}
                keyExtractor={(item, index) => activeTab === "Chưa đánh giá" ? `${item.id}-${index}` : `${item.review?.id}`}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmpty}
            />

            {/* Model */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setRating(0);
                    setComment("");
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Đánh giá sản phẩm</Text>
                        <Image
                            style={styles.modalProductImage}
                            source={{ uri: `${preImage}/${selectedItem?.image_url}` }}
                        />
                        <Text style={styles.modalProductName}>{selectedItem?.product_name}</Text>
                        <Text style={styles.modalInstruction}>Vui lòng đánh giá sản phẩm của bạn</Text>
                        {renderRatingStars()}
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Nhập bình luận của bạn (không bắt buộc)"
                            value={comment}
                            onChangeText={setComment}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#D1D5DB' }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setRating(0);
                                    setComment("");
                                }}
                            >
                                <Text style={styles.modalButtonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: CommonColors.primary }]}
                                onPress={handleSubmitReview}
                                disabled={loading}
                            >
                                <Text style={styles.modalButtonText}>{loading ? "Đang gửi..." : "Gửi đánh giá"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    ...ReviewStyle,
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 16,
    },
    modalProductImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 12,
    },
    modalProductName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalInstruction: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#1F2937',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ReviewScreen;
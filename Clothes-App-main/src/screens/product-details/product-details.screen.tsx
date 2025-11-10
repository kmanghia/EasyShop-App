import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ProductDetailStyle from "./product-details.style"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import ImageSliderComponent from "@/src/components/imageSlider/image-slider.comp"
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { CommonColors } from "@/src/common/resource/colors"
import Animated, { FadeInDown } from "react-native-reanimated"
import { ProductImageModel, ProductModel } from "@/src/data/model/product.model";
import * as ProductManagement from "../../data/management/product.management";
import { AppConfig } from "@/src/common/config/app.config"
import RenderHTML from "react-native-render-html";
import { ProductVariantModel } from "@/src/data/model/product_variant.model"
import AvailableVariantImagesComponent from "./comp/available-variant-images/available-variant-images.component"
import ShopProductListComponent from "./comp/shop-product-list/shop-product-list.component"
import SelectVariantComponent from "@/src/components/select-variant/select-variant.component"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, SCREEN_WIDTH } from "@gorhom/bottom-sheet"
import { useToast } from "@/src/customize/toast.context"
import * as CartManagement from "../../data/management/cart.management";
import { formatPriceRender } from "@/src/common/utils/currency.helper"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/src/data/types/global"
import { CartStoreState } from "@/src/data/store/reducers/cart/cart.reducer"
import * as CartActions from "@/src/data/store/actions/cart/cart.action";
import { MessageError } from "@/src/common/resource/message-error"
import DialogNotification from "@/src/components/dialog-notification/dialog-notification.component"
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer"
import * as FavoriteManagement from "@/src/data/management/favorite.management";
import * as ReviewManagement from "@/src/data/management/review.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { formatDate } from "@/src/common/utils/time.helper"
import ReviewListComponent from "./comp/review-list/review-list.component"
import { ProductReviewModel } from "@/src/data/model/review.model"
import { PaginateModel } from "@/src/common/model/paginate.model"
import LoadingDots from "@apolloeagle/loading-dots";
import BottomSheetComponent from "./comp/bottom-sheet/bottom-sheet.component"

type Props = {};

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = (props: Props) => {
    const { id } = useLocalSearchParams();
    const { showToast } = useToast();
    const [cartPosition, setCartPosition] = useState({ x: width - 50, y: 50 });
    const [preImage, setPreImage] = useState('');
    const [product, setProduct] = useState<ProductModel>();
    const [slideImages, setSlideImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<ProductVariantModel[]>([]);
    const [availableVariants, setAvailableVariants] = useState<Map<number, string>>();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [reviews, setReviews] = useState<ProductReviewModel[]>([]);
    const [reviewPaginate, setReviewPaginate] = useState<PaginateModel>(new PaginateModel().convertObj({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    }))
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const cartSelector = useSelector((state: RootState) => state.cart) as CartStoreState;
    const isFavorite = userSelector.favorites.includes(product?.id ?? 0);
    const [firstLoading, setFirstLoading] = useState(true);

    const dispatch = useDispatch();
    const [isOpenSelectVariantSheet, setIsOpenSelectVariantSheet] = useState(false);

    useEffect(() => {
        setFirstLoading(true);
        fetchPreImage();
        fetchProductDetails();
        fetchProductVariants();
    }, []);

    useEffect(() => {
        if (product) {
            fetchProductShop();
            fetchListProductReview();
        }
    }, [product])

    const fetchPreImage = () => {
        const preImage = new AppConfig().getPreImage();
        setPreImage(preImage);
    }

    const fetchProductVariants = async () => {
        try {
            const response = await ProductManagement.fetchProductVariantByProductId(+id);
            console.log('Danh sách biến thể: Done!');
            const availableVariantMap = new Map<number, string>(
                response?.map((variant: ProductVariantModel) => [variant.color?.id ?? 0, variant.image_url])
            );
            availableVariantMap.delete(0);
            setAvailableVariants(availableVariantMap);
            setVariants(response);
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                setFirstLoading(false);
            }, 1000);
        }
    }

    const fetchProductDetails = async () => {
        try {
            const response = await ProductManagement.fetchDetailProduct(+id);
            console.log('Chi tiết sản phẩm: Done!');
            const images = response?.product_images?.map(
                (image: ProductImageModel) => image.image_url
            )
            setSlideImages(images);
            setProduct(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProductShop = async () => {
        try {
            const response = await ProductManagement.fetchRelativeProductInShop(product?.shop?.id ?? 0, +id);
            console.log('Danh sách sản phẩm cửa hàng: Done!');
            setProducts(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchListProductReview = async () => {
        try {
            const response = await ReviewManagement.fetchListReviewProduct(
                product?.id ?? 0,
                1,
                2
            );
            setReviews(response.get('reviews'));
            setReviewPaginate(response.get('paginate'));
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddToCart = async (variant: ProductVariantModel, quantity: number) => {
        try {
            if (userSelector.isLogged === false) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');

                return;
            }

            const response = await CartManagement.addCartItem(variant, quantity);
            dispatch(CartActions.AddCartItemToCart(
                response.get('cart_item'),
                response.get('cart_shop_id'),
                quantity
            ))
            showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
            setIsOpenSelectVariantSheet(false);
        } catch (error: any) {
            console.log(error);
            if (error?.message?.includes("Vượt quá số lượng hàng tồn kho")) {
                showToast(MessageError.EXCEED_QUANTITY_STOCK, "error");
            } else if (error?.message === 'Session expired, please log in again') {
                setIsOpenSelectVariantSheet(false);
                router.navigate('/(routes)/sign-in');
                showToast(MessageError.EXPIRES_SESSION, "error");
            } else {
                showToast(MessageError.BUSY_SYSTEM, "error");
                setIsOpenSelectVariantSheet(false);
            }

        }
    }

    const navigateToShop = (id: number) => {
        router.navigate({
            pathname: "/(routes)/shop",
            params: {
                shop_id: id
            }
        })
    }

    const navigateToCart = () => {
        router.navigate("/(tabs)/cart");
    }

    const favoriteProduct = async () => {
        try {
            if (userSelector.isLogged === false) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
                return;
            }
            await FavoriteManagement.favoriteProductByUser(product?.id ?? 0);
            dispatch(UserActions.AddFavorite(product?.id ?? 0));
        } catch (error: any) {
            console.log('ProductItemComponent 39: ', error);
            if (error?.message === 'Session expired, please log in again') {
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const unFavoriteProduct = async () => {
        try {
            if (userSelector.isLogged === false) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
                return;
            }
            await FavoriteManagement.unfavoriteProductByUser(product?.id ?? 0);
            dispatch(UserActions.RemoveFavorite(product?.id ?? 0));
        } catch (error: any) {
            console.log('ProductItemComponent 54: ', error);
            if (error?.message === 'Session expired, please log in again') {
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    if (firstLoading) {
        return (
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    backgroundColor: CommonColors.extraLightGray
                }}
            >
                <LoadingDots size={16} color={CommonColors.primary} />
            </View>
        )
    }

    const openSelectVariant = () => {
        if (userSelector.isLogged && userSelector.id === product?.shop?.ownerId) {
            showToast('Không thể chọn sản phẩm thuộc cửa hàng của bạn', 'info');
            return;
        }
        // handleSnapPress(0);
        setIsOpenSelectVariantSheet(true);
    }

    return (
        <>
            <View style={{ position: 'relative', width: SCREEN_WIDTH, backgroundColor: CommonColors.yellow }}>
                <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={28} color={CommonColors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnCart}
                    onPress={() => navigateToCart()}
                >
                    <Ionicons name="cart-outline" size={28} color={CommonColors.white} />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 90, flex: 1 }}>
                {/* Product Slider */}
                {product && (
                    <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                        <ImageSliderComponent images={slideImages} preImage={preImage} />
                    </Animated.View>
                )}
                {/* Product Info */}
                {product && (
                    <Animated.View style={styles.container} entering={FadeInDown.delay(600).duration(500)}>
                        <Animated.View
                            style={styles.variantWrapper}
                            entering={FadeInDown.delay(800).duration(500)}
                        >
                            <View style={styles.variantInfoWrapper}>
                                <Text style={styles.variantText}>{availableVariants?.size} phân loại có sẵn</Text>
                                <AvailableVariantImagesComponent images={Array.from(availableVariants?.values() ?? [])} preImage={preImage} />
                            </View>
                        </Animated.View>

                        <Animated.View style={styles.metaInfoWrapper} entering={FadeInDown.delay(800).duration(500)}>
                            <View style={styles.priceAndRatingWrapper}>
                                <View style={styles.priceWrapper}>
                                    <Text style={styles.price}>đ{formatPriceRender(product.unit_price)}</Text>
                                </View>
                                <View style={styles.ratingWrapper}>
                                    <FontAwesome name="star" size={18} color={CommonColors.yellow} />
                                    <Text style={styles.rating}>
                                        {Number(product.rating).toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.soldAndLikeWrapper}>
                                <Text style={styles.soldTxt}>Đã bán {product.sold_quantity}</Text>
                                {isFavorite ? (
                                    <TouchableOpacity onPress={unFavoriteProduct}>
                                        <FontAwesome name="heart" size={20} color={CommonColors.red} />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={favoriteProduct}>
                                        <FontAwesome name="heart-o" size={20} color={CommonColors.lightGray} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>

                        <Animated.Text style={styles.title} entering={FadeInDown.delay(800).duration(500)} >
                            {product.product_name}
                        </Animated.Text>

                        <Animated.View
                            style={styles.descriptionWrapper}
                            entering={FadeInDown.delay(800).duration(500)}
                        >
                            {/* <View style={styles.devider}></View> */}
                            <View style={styles.descHeader}>
                                <Text style={styles.descTxt}>Chi tiết sản phẩm</Text>

                            </View>
                            {/* <View style={styles.devider}></View> */}
                            <View style={{ paddingHorizontal: 20, flex: 1 }}>
                                <RenderHTML contentWidth={Dimensions.get('window').width} source={{ html: product.description }} />
                            </View>
                        </Animated.View>
                    </Animated.View>
                )}
                {/* Shop */}
                {product && (
                    <Animated.View style={[styles.container, { marginTop: 10 }]} entering={FadeInDown.delay(800).duration(500)}>
                        <View style={styles.shopWrapper}>
                            <View style={styles.shopInfoWrapper}>
                                <View style={{ width: 60, height: 60, overflow: 'hidden', borderRadius: 30 }}>
                                    <Image
                                        style={{ width: '100%', height: '100%' }}
                                        source={{ uri: `${preImage}/${product.shop?.logo_url}` }}
                                    />
                                </View>
                                <View style={styles.shopContent}>
                                    <Text style={styles.shopNameText}>{product.shop?.shop_name}</Text>
                                    <Text style={styles.shopAddressText}>{product.shop?.contact_address}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.buttonShopView} onPress={() => navigateToShop(product.shop?.id ?? -1)}>
                                <Text style={styles.buttonShopViewText}>Xem cửa hàng</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
                {/* Product Shop */}
                {product && (
                    <Animated.View style={[styles.container, { marginTop: 10 }]} entering={FadeInDown.delay(800).duration(500)}>
                        <View style={styles.productShopWrapper}>
                            <Text style={styles.productShopText}>Các sản phẩm khác của cửa hàng</Text>
                            {products.length > 0 ? (
                                <ShopProductListComponent
                                    products={products}
                                    preImage={preImage}
                                    shop_id={product.shop?.id ?? 0}
                                />
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                                </View>
                            )}
                        </View>
                    </Animated.View>
                )}
                {/* Review */}
                {product && (
                    <Animated.View style={[styles.container, { marginTop: 10, marginBottom: 10 }]} entering={FadeInDown.delay(800).duration(500)}>
                        <ReviewListComponent
                            preImage={preImage}
                            product={product}
                            reviews={reviews}
                            totalReviews={reviewPaginate.totalItems}
                        />
                    </Animated.View>
                )}
            </ScrollView>
            {/* Button Action */}
            <Animated.View
                style={styles.buttonWrapper}
                entering={FadeInDown.delay(500).duration(500).springify()}
            >
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: CommonColors.white,
                            borderColor: CommonColors.primary,
                            borderWidth: 1,
                        }
                    ]}
                    onPress={() => openSelectVariant()}
                >
                    <Ionicons name="cart-outline" size={20} color={CommonColors.primary} />
                    <Text style={[styles.buttonTxt, { color: CommonColors.primary }]}>
                        Thêm vào giỏ
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => openSelectVariant()}>
                    <Text style={styles.buttonTxt}>Mua ngay</Text>
                </TouchableOpacity>
            </Animated.View>
            {product && variants.length > 0 && (
                <BottomSheetComponent
                    isOpen={isOpenSelectVariantSheet}
                    onClose={() => setIsOpenSelectVariantSheet(false)}
                >
                    <SelectVariantComponent
                        product={product}
                        variants={variants}
                        preImage={preImage}
                        cartPosition={cartPosition}
                        handleAddToCart={handleAddToCart}
                    />
                </BottomSheetComponent>
            )}
        </>
    )
}

const styles = ProductDetailStyle;

export default ProductDetailScreen;
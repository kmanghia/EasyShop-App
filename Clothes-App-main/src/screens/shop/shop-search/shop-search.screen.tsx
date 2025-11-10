import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome6, Ionicons, Octicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { CommonColors } from "@/src/common/resource/colors";
import { router } from "expo-router";
import ShopSearchStyle from "./shop-search.style";
import * as ShopManagement from "@/src/data/management/shop.management";
import { PaginateModel } from "@/src/common/model/paginate.model";
import { ProductModel } from "@/src/data/model/product.model";
import { useRoute } from "@react-navigation/native";
import { useToast } from "@/src/customize/toast.context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import ProductItemComponent from "../../home/comp/product-item/product-item.comp";
import { AppConfig } from "@/src/common/config/app.config";
import LoadingDots from "@apolloeagle/loading-dots";

type Props = {}

const ShopSearchScreen = (props: Props) => {
    const { showToast } = useToast();
    const [searchInput, setSearchInput] = useState('');
    const preImage = new AppConfig().getPreImage();
    const { shop_id: SHOP_ID, parent_category_id: CATEGORY_ID, type: TYPE, textTitle: TEXT_TITLE } = useRoute().params as {
        shop_id: string,
        parent_category_id: string,
        type: "Category" | "BestSellers" | 'Latest' | "All",
        textTitle: string
    }
    const [products, setProducts] = useState<ProductModel[]>([]);
    const initPaginate = new PaginateModel().convertObj({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    })
    const [paginate, setPaginate] = useState<PaginateModel>(initPaginate);
    const [isEndReached, setIsEndReached] = useState(false);
    const isFetching = useRef(false);

    useEffect(() => {
        if (SHOP_ID) {
            if (isFetching.current === false) {
                setProducts([]);
                if (TYPE === 'Category' && CATEGORY_ID) {
                    fetchProductsByParentCategoryInShop(1);
                } else if (TYPE === "BestSellers") {
                    fetchPopularProducts(1);
                } else if (TYPE === 'Latest') {
                    fetchLatestProducts(1);
                } else if (TYPE === 'All') {

                }
            }
        }
    }, []);

    const fetchProductsByParentCategoryInShop = async (page: number) => {
        try {
            if (isEndReached) {
                return;
            }
            isFetching.current = true;
            const response = await ShopManagement.fetchProductsByParentCategoryInShop(
                +SHOP_ID,
                +CATEGORY_ID,
                page,
                paginate.limit
            );
            const products = response.products;
            const pagination = response.paginate;

            setProducts(prev => [...prev, ...products]);
            setPaginate(prev => ({
                ...prev,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                currentPage: page
            } as PaginateModel));

            if (page >= pagination.totalPages) {
                setIsEndReached(true);
            }
            isFetching.current = false;
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
            isFetching.current = false;
        }
    }

    const fetchPopularProducts = async (page: number) => {
        try {
            isFetching.current = true;
            const response = await ShopManagement.fetchPopularProductsByShop(
                +SHOP_ID,
                page,
                paginate.limit
            );
            const products = response.products;
            const pagination = response.paginate;
            setProducts(prev => [...prev, ...products]);
            setPaginate(prev => ({
                ...prev,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                currentPage: page
            } as PaginateModel));

            if (page >= pagination.totalPages) {
                setIsEndReached(true);
            }
            isFetching.current = false;
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
            isFetching.current = false;
        }
    }

    const fetchLatestProducts = async (page: number) => {
        try {
            isFetching.current = false;
            const response = await ShopManagement.fetchLatestProductsByShop(
                +SHOP_ID,
                page,
                paginate.limit
            );
            const products = response.products;
            const pagination = response.paginate;

            setProducts(prev => [...prev, ...products]);
            setPaginate(prev => ({
                ...prev,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                currentPage: page
            } as PaginateModel));

            if (page >= pagination.totalPages) {
                setIsEndReached(true);
            }
            isFetching.current = false;
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
            isFetching.current = false;
        }
    }

    const onSearchMore = async () => {
        const page = paginate.currentPage + 1;
        if (TYPE === 'Category' && CATEGORY_ID) {
            await fetchProductsByParentCategoryInShop(page);
        } else if (TYPE === "BestSellers") {
            await fetchPopularProducts(page);
        } else if (TYPE === 'Latest') {
            await fetchLatestProducts(page);
        } else if (TYPE === 'All') {

        }
    }

    return (
        <>
            {/* Header */}
            <View style={[styles.header, { paddingTop: 30, position: 'relative' }]}>
                {TYPE === 'All' && (
                    <View style={styles.searchContainer}>
                        <Octicons name="search" size={18} color={CommonColors.white} />
                        <TextInput
                            value={searchInput}
                            onChangeText={(text: string) => setSearchInput(text)}
                            placeholder="Tìm kiếm sản phẩm trong cửa hàng"
                        />
                    </View>
                )}
                {TYPE !== 'All' && (
                    <Text style={styles.textTitle}>{TEXT_TITLE}</Text>
                )}
            </View>
            <View style={{ flex: 1 }}>
                {isFetching.current ? (
                    <LoadingDots size={16} color={CommonColors.primary} />
                ) : (
                    <ScrollView
                        style={[styles.container]}
                        contentContainerStyle={styles.itemsWrapper}
                        showsVerticalScrollIndicator={false}
                    >
                        {products.map((product, index) => (
                            <View key={`${index}-${product.id}-${index}`} style={[styles.productWrapper, { marginLeft: 16 }]}>
                                <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                            </View>
                        ))}
                        {products.length > 0 && !isFetching.current && !isEndReached && (
                            <ButtonSearchMore onSearchMore={onSearchMore} />
                        )}
                    </ScrollView>
                )}
                {isEndReached && !isFetching.current && (
                    <Animated.View
                        entering={FadeInDown.delay(1000).duration(300)}
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 50,
                            backgroundColor: 'transparent'
                        }}
                    >
                        <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                    </Animated.View>
                )}
            </View>
        </>
    )
}

const ButtonSearchMore = ({
    onSearchMore
}: {
    onSearchMore: () => void
}) => {
    return (
        <Animated.View entering={FadeInDown.delay(800).duration(300)}>
            <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={styles.btnSearchMore}
            >
                <TouchableOpacity onPress={() => onSearchMore()} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.btnSearchMoreText}>Tải thêm</Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    )
}

const styles = ShopSearchStyle;
{/* <View style={[styles.headerContainer]}>
    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back-sharp" size={24} color="black" />
    </TouchableOpacity>
    {TYPE === 'All' && (
        <View style={styles.searchContainer}>
            <Octicons name="search" size={18} color={CommonColors.white} />
            <TextInput
                value={searchInput}
                onChangeText={(text: string) => setSearchInput(text)}
                placeholder="Tìm kiếm sản phẩm trong cửa hàng"
            />
        </View>
    )}
    {TYPE !== 'All' && (
        <Text style={styles.textTitle}>{TEXT_TITLE}</Text>
    )}
</View> */}
export default ShopSearchScreen;
import { CommonColors } from "@/src/common/resource/colors"
import { ProductModel } from "@/src/data/model/product.model";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as ProductManagement from "@/src/data/management/product.management";
import * as ShopManagement from "@/src/data/management/shop.management";
import { useToast } from "@/src/customize/toast.context";
import ProductItemComponent from "@/src/screens/home/comp/product-item/product-item.comp";
import { PaginateModel } from "@/src/common/model/paginate.model";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';
import { Sort } from "@/src/common/resource/sort";
import LoadingDots from "@apolloeagle/loading-dots";
type Props = {
    shop_id: number;
    preImage: string;
}

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const TabProductComponent = ({
    shop_id,
    preImage = ''
}: Props) => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState(0);
    const [decreasePrice, setDecreasePrice] = useState(true);
    const [popularProducts, setPopularProducts] = useState<ProductModel[]>([]);
    const [latestProducts, setLatestProducts] = useState<ProductModel[]>([]);
    const [productByPrices, setProductByPrices] = useState<ProductModel[]>([]);
    const initPaginate = new PaginateModel().convertObj({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    })
    const [paginate, setPaginate] = useState<PaginateModel>(initPaginate)
    const [isEndReachedList, setIsEndReachedList] = useState(false);
    const isFetching = useRef(false);

    const changeActiveTab = (value: number) => {
        setIsEndReachedList(false);
        setPaginate(initPaginate);

        if (value === 2) {
            setProductByPrices([]);
            setActiveTab(2);
            setDecreasePrice(prev => !prev);
            return;
        }

        setActiveTab(value);
        if (decreasePrice) {
            setDecreasePrice(false);
        }
    }

    const fetchPopularProducts = async (page: number) => {
        try {
            if (isEndReachedList) {
                return;
            }
            isFetching.current = true;
            const response = await ShopManagement.fetchPopularProductsByShop(
                shop_id,
                page,
                paginate.limit
            );
            const products = response.products;
            const pagination = response.paginate;
            setPopularProducts(prev => [...prev, ...products]);
            setPaginate(prev => ({
                ...prev,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                currentPage: page
            } as PaginateModel));

            if (page >= pagination.totalPages) {
                setIsEndReachedList(true);
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
            if (isEndReachedList) {
                return;
            }
            isFetching.current = true;
            const response = await ShopManagement.fetchLatestProductsByShop(
                shop_id,
                page,
                paginate.limit
            );
            const products = response.products;
            const pagination = response.paginate;
            setLatestProducts(prev => [...prev, ...products]);
            setPaginate(prev => ({
                ...prev,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                currentPage: page
            } as PaginateModel));

            if (page >= pagination.totalPages) {
                setIsEndReachedList(true);
            }
            isFetching.current = false;
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
            isFetching.current = false;
        }
    }

    const fetchProductByPrices = async (page: number) => {
        try {
            if (isEndReachedList) {
                return;
            }
            isFetching.current = true;
            const response = await ShopManagement.fetchPriceProductsByShop(
                shop_id,
                page,
                paginate.limit,
                decreasePrice ? Sort.DESC : Sort.ASC
            );
            const products = response.products;
            const pagination = response.paginate;
            setProductByPrices(prev => [...prev, ...products]);
            setPaginate(prev => ({
                ...prev,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                currentPage: page
            } as PaginateModel));

            if (page >= pagination.totalPages) {
                setIsEndReachedList(true);
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
        if (activeTab === 0) {
            await fetchPopularProducts(page);
        } else if (activeTab === 1) {
            await fetchLatestProducts(page);
        } else if (activeTab === 2) {
            await fetchProductByPrices(page);
        }
    }

    useEffect(() => {
        if (shop_id) {
            setPopularProducts([]);
            fetchPopularProducts(1);
        }
    }, []);

    useEffect(() => {
        if (shop_id) {
            if (activeTab === 0) {
                setPopularProducts([]);
                if (isFetching.current === false) {
                    fetchPopularProducts(1);
                }
            } else if (activeTab === 1) {
                setLatestProducts([]);
                if (isFetching.current === false) {
                    fetchLatestProducts(1);
                }
            } else if (activeTab === 2) {
                setProductByPrices([]);
                if (isFetching.current === false) {
                    fetchProductByPrices(1);
                }
            }
        }
    }, [activeTab])

    useEffect(() => {
        if (activeTab === 2 && !isFetching.current) {
            fetchProductByPrices(1);
        }
    }, [decreasePrice]);

    return (
        <>
            <View style={styles.tabBarContainer}>
                <TouchableOpacity style={styles.tabBar} onPress={() => changeActiveTab(0)}>
                    <Text style={[styles.tabBarText, activeTab === 0 && styles.tabBarActiveText]}>
                        Bán chạy
                    </Text>
                </TouchableOpacity>
                <Text style={styles.deviderTabBar}>|</Text>
                <TouchableOpacity style={styles.tabBar} onPress={() => changeActiveTab(1)}>
                    <Text style={[styles.tabBarText, activeTab === 1 && styles.tabBarActiveText]}>
                        Mới nhất
                    </Text>
                </TouchableOpacity>
                <Text style={styles.deviderTabBar}>|</Text>
                <TouchableOpacity style={styles.tabBar} onPress={() => changeActiveTab(2)}>
                    <Text style={[styles.tabBarText, activeTab === 2 && styles.tabBarActiveText]}>
                        Giá
                    </Text>
                    {activeTab === 2 && (
                        <AntDesign name={decreasePrice ? 'arrowdown' : 'arrowup'} size={14} color={CommonColors.primary} />
                    )}
                </TouchableOpacity>
            </View>
            {isFetching.current ? (
                <LoadingDots size={16} color={CommonColors.primary} />
            ) : (
                <ScrollView
                    style={[styles.container]}
                    contentContainerStyle={styles.itemsWrapper}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 0 && popularProducts.map((product, index) => (
                        <View key={`${index}-${product.id}-${index}`} style={[styles.productWrapper, { marginLeft: 16 }]}>
                            <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                        </View>
                    ))}
                    {activeTab === 1 && latestProducts.map((product, index) => (
                        <View key={`${index}-${product.id}-${index}-${index}`} style={[styles.productWrapper, { marginLeft: 16 }]}>
                            <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                        </View>
                    ))}
                    {activeTab === 2 && productByPrices.map((product, index) => (
                        <View key={`${index}-${product.id}-${index}-${index}-${index}`} style={[styles.productWrapper, { marginLeft: 16 }]}>
                            <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                        </View>
                    ))}
                    {popularProducts.length > 0 && activeTab === 0 && !isFetching.current && !isEndReachedList && (
                        <ButtonSearchMore onSearchMore={onSearchMore} />
                    )}
                    {latestProducts.length > 0 && activeTab === 1 && !isFetching.current && !isEndReachedList && (
                        <ButtonSearchMore onSearchMore={onSearchMore} />
                    )}
                    {productByPrices.length > 0 && activeTab === 2 && !isFetching.current && !isEndReachedList && (
                        <ButtonSearchMore onSearchMore={onSearchMore} />
                    )}
                </ScrollView>
            )}
            {isEndReachedList && !isFetching.current && (
                <Animated.View
                    entering={FadeInDown.delay(1000).duration(300)}
                    style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        backgroundColor: CommonColors.extraLightGray
                    }}
                >
                    <Text style={styles.emptyText}>Không có có sản phẩm</Text>
                </Animated.View>
            )}
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

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,

        shadowColor: '#000',
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: 'white',
    },
    tabBar: {
        width: WIDTH_SCREEN * (1 / 3),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    tabBarText: {
        color: CommonColors.gray,
        fontSize: 14,
        fontWeight: '500',
    },
    tabBarActiveText: {
        color: CommonColors.primary
    },
    deviderTabBar: {
        color: '#CCC'
    },
    container: {
        backgroundColor: CommonColors.extraLightGray,
        paddingTop: 10,
    },

    itemsWrapper: {
        width: WIDTH_SCREEN,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        marginBottom: 50,
    },
    productWrapper: {
        width: (WIDTH_SCREEN / 2) - 16,
        marginBottom: 10
    },

    btnSearchMore: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: WIDTH_SCREEN,
        height: 50
    },
    btnSearchMoreText: {
        fontSize: 18,
        color: CommonColors.primary
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontSize: 15
    },
})

export default TabProductComponent;
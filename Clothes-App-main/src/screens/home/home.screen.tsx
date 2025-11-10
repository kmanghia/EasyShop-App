import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import HomeStyle from "./home.style";
import HeaderComponent from "@/src/components/header/header.comp";
import ProductListComponent from "./comp/product-list/product-list.comp";
import CategoryListComponent from "./comp/category-list/category-list.comp";
import FlashSaleComponent from "./comp/flash-sale/flash-sale.comp";
import { ActivityIndicator, Image, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { CategoryModel } from "@/src/data/model/category.model";
import { AppConfig } from "@/src/common/config/app.config";
import * as CategoryManagement from "../../data/management/category.management";
import * as ProductManagement from "../../data/management/product.management";
import { ProductModel } from "@/src/data/model/product.model";
import SearchOverlayComponent from "@/src/components/search-overlay/search-overlay.component";
import { FontAwesome } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import LoadingDots from "@apolloeagle/loading-dots";

const HomeScreen = () => {
    const [preImage, setPreImage] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshCategory, setRefreshCategory] = useState(false);
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [latestProducts, setLatestProducts] = useState<ProductModel[]>([]);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [isSearchOverlayVisible, setSearchOverlayVisible] = useState(false);
    const firstFetching = useRef(true);
    useEffect(() => {
        fetchPreImage();
        fetchCategories();
        fetchLatestProducts();
        fetchProducts();
        firstFetching.current = false;
    }, [])

    useEffect(() => {
        if (firstFetching.current) {
            return;
        }
        if (refreshCategory) {
            fetchCategories();
            setRefreshCategory(false);
        }
    }, [refreshCategory])

    useEffect(() => {
        if (firstFetching.current) {
            return;
        }
        if (refreshProduct) {
            fetchProducts();
            setRefreshProduct(false);
        }
    }, [refreshProduct])

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchProducts = async () => {
        try {
            const response = await ProductManagement.fetchProducts();
            setProducts(response);
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
            setIsLoading(false)
        }
    }

    const fetchLatestProducts = async () => {
        try {
            const response = await ProductManagement.fetchLatestProduct();
            setLatestProducts(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await CategoryManagement.fetchParentCategories();
            setCategories(response);
        } catch (error) {
            console.log(error);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
        fetchLatestProducts();
    };

    const onHandleSearch = (searchValue: string) => {
        router.push({
            pathname: '/(routes)/search-result',
            params: {
                search: searchValue
            }
        })
        setSearchOverlayVisible(false);
    }

    const ChatbotButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
        return (
            <TouchableOpacity style={styles.chatbotButton} onPress={onPress}>
                <FontAwesome name="comments" size={26} color={CommonColors.white} />
            </TouchableOpacity>
        );
    };

    return (
        <>
            <HeaderComponent openSearch={() => setSearchOverlayVisible(true)} />
            {
                isLoading ? (
                    <View style={{ marginTop: 30 }}>
                        <LoadingDots size={22} color={CommonColors.primary} />
                    </View>
                ) : (
                    <>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={["#33adff"]}
                                />
                            }
                        >
                            <CategoryListComponent categories={categories} preImage={preImage} setRefreshCategory={setRefreshCategory} />
                            <FlashSaleComponent preImage={preImage} products={latestProducts} />
                            <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
                                <Image
                                    source={require("@/assets/images/sale-banner.jpg")}
                                    style={{
                                        width: "100%",
                                        height: 150,
                                        borderRadius: 15
                                    }}
                                />
                            </View>
                            <ProductListComponent preImage={preImage} products={products} flatlist={false} />
                        </ScrollView>
                        <SearchOverlayComponent isVisible={isSearchOverlayVisible} onHandleSearch={onHandleSearch} onClose={() => setSearchOverlayVisible(false)} />
                        <ChatbotButton onPress={() => router.navigate('/(routes)/chatbot')} />
                    </>
                )
            }
        </>
    );
};

const styles = HomeStyle;

export default HomeScreen;

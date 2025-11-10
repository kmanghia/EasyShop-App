import { FlatList, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { AppConfig } from "@/src/common/config/app.config";
import { CommonColors } from "@/src/common/resource/colors";
import { useRoute } from "@react-navigation/native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { ProductModel } from "@/src/data/model/product.model";
import { PaginateModel } from "@/src/common/model/paginate.model";
import { useToast } from "@/src/customize/toast.context";
import * as ProductManagement from "@/src/data/management/product.management";
import { router } from "expo-router";
import ProductItemComponent from "@/src/screens/home/comp/product-item/product-item.comp";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import CustomBottomSheet from "@/src/components/custom-bottom-sheet/custom-bottom-sheet.component";
import FilterCategoryComponent from "@/src/screens/search/comp/filter-category.component";
import { FilterCategoryParams } from "@/src/data/types/global";
import { Sort } from "@/src/common/resource/sort";
import SearchOverlayComponent from "@/src/components/search-overlay/search-overlay.component";
import CategorySearchStyle from "./category-search.style";
import { MessageError } from "@/src/common/resource/message-error";

type Props = {};

const CategorySearchScreen = (props: Props) => {
    const {
        search: SEARCH_PARAMS,
        id: PARENT_ID
    } = useRoute().params as { search: string, id: string };
    const { showToast } = useToast();
    const [preImage, setPreImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [searchValue, setSearchValue] = useState(SEARCH_PARAMS ?? '');
    const [openSearchOverlay, setOpenSearchOverlay] = useState(false);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const initPaginate = new PaginateModel().convertObj({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
    });
    const [paginate, setPaginate] = useState<PaginateModel>(initPaginate);
    const isEndReached = useRef<boolean>(false);
    const isFetching = useRef<boolean>(false);
    const [isOpenFilterSheet, setIsOpenFilterSheet] = useState(false);
    const [filterParams, setFilterParams] = useState<FilterCategoryParams>({
        origins: [],
        sortPrice: Sort.ASC,
        minPrice: 0,
        maxPrice: Infinity,
        minRatings: [],
    });
    const firstFetching = useRef(true);

    useEffect(() => {
        fetchPreImage();
        searchAndFilterProducts(1, filterParams);
    }, []);

    useEffect(() => {
        if (firstFetching.current) {
            firstFetching.current = false;
            return;
        }

        isEndReached.current = false;
        setProducts([]);
        searchAndFilterProducts(1, filterParams);
    }, [searchValue])

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    };

    const searchAndFilterProducts = async (page: number, params: FilterCategoryParams) => {
        try {
            if (isEndReached.current) {
                return;
            }
            isFetching.current = true;
            let response: any;
            if (PARENT_ID) {
                response = await ProductManagement.searchAndFilterProductsByParentCategoryMobile(
                    parseInt(PARENT_ID),
                    searchValue,
                    page,
                    paginate.limit,
                    params.origins,
                    params.sortPrice,
                    params.minPrice,
                    params.maxPrice,
                    params.minRatings
                );
            } else {
                response = [];
            }

            setProducts(prev => [...prev, ...response.products]);
            setPaginate(prev => ({
                ...prev,
                totalItems: response.paginate.totalItems,
                totalPages: response.paginate.totalPages,
                currentPage: page,
            } as PaginateModel));

            if (page >= response.paginate.totalPages) {
                isEndReached.current = true;
            }

            isFetching.current = false;
        } catch (error) {
            console.log(error);
            showToast(MessageError.BUSY_SYSTEM, "error");
            isFetching.current = false;
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setRefreshing(false);
    };

    const onSearchMore = async () => {
        const page = paginate.currentPage + 1;
        await searchAndFilterProducts(page, filterParams);
    };

    const handleApplyFilter = async (newFilterParams: FilterCategoryParams) => {
        setFilterParams(newFilterParams);
        isEndReached.current = false;
        setProducts([]);
        await searchAndFilterProducts(1, newFilterParams);
        setIsOpenFilterSheet(false);
    };

    const handleResetFilter = () => {
        const resetParams: FilterCategoryParams = {
            origins: [],
            sortPrice: Sort.ASC,
            minPrice: 0,
            maxPrice: Infinity,
            minRatings: [],
        };
        setFilterParams(resetParams);
        isEndReached.current = false;
        setProducts([]);
        searchAndFilterProducts(1, resetParams);
    };

    const { height: HEIGHT_SCREEN } = useWindowDimensions();

    return (
        <>
            <View style={[styles.container, { marginBottom: 10 }]}>
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={CommonColors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setOpenSearchOverlay(true)} style={styles.input}>
                        <TextInput
                            value={searchValue}
                            editable={false}
                            placeholder="Tìm kiếm sản phẩm"
                            autoFocus={Platform.OS === 'web'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsOpenFilterSheet(true)}>
                        <Ionicons name="filter-outline" size={24} color={CommonColors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={products}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => `${item.id}`}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        marginHorizontal: 16,
                    }}
                    renderItem={({ index, item }) => (
                        <ProductItemComponent item={item} index={index} preImage={preImage} productType="regular" />
                    )}
                    ListFooterComponent={() =>
                        products.length > 0 && !isFetching.current && !isEndReached.current ? (
                            <ButtonSearchMore onSearchMore={onSearchMore} />
                        ) : (
                            <></>
                        )
                    }
                />
                {isEndReached.current && !isFetching.current && (
                    <Animated.View entering={FadeInDown.delay(1000).duration(300)}>
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                        </View>
                    </Animated.View>
                )}
            </View>
            <CustomBottomSheet
                isVisible={isOpenFilterSheet}
                height={HEIGHT_SCREEN * 0.86}
                onClose={() => setIsOpenFilterSheet(false)}
            >
                <FilterCategoryComponent
                    onApply={handleApplyFilter}
                    onReset={handleResetFilter}
                    initFilterParams={filterParams}
                />
            </CustomBottomSheet>
            <SearchOverlayComponent
                isVisible={openSearchOverlay}
                onClose={() => setOpenSearchOverlay(false)}
                onHandleSearch={(searchValue) => {
                    setSearchValue(searchValue);
                    setOpenSearchOverlay(false);
                }}
                initialQuery={searchValue}
            />
        </>
    );
};

const ButtonSearchMore = ({ onSearchMore }: { onSearchMore: () => void }) => {
    return (
        <Animated.View entering={FadeInDown.delay(800).duration(300)}>
            <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={styles.btnSearchMore}>
                <TouchableOpacity onPress={() => onSearchMore()} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.btnSearchMoreText}>Tải thêm</Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = CategorySearchStyle;

export default CategorySearchScreen;
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native"
import FavoriteStyle from "./favorite.style"
import * as UserActions from '@/src/data/store/actions/user/user.action'
import * as FavoriteManagement from "@/src/data/management/favorite.management"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/src/data/types/global"
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer"
import { useEffect, useState } from "react"
import { ProductModel } from "@/src/data/model/product.model"
import { AppConfig } from "@/src/common/config/app.config"
import { useToast } from "@/src/customize/toast.context"
import { MessageError } from "@/src/common/resource/message-error"
import { CommonColors } from "@/src/common/resource/colors"
import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import ProductItemComponent from "../home/comp/product-item/product-item.comp"

const FavoriteScreen = () => {
    const { showToast } = useToast();
    const preImage = new AppConfig().getPreImage();
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const [productFavorites, setProductFavorites] = useState<ProductModel[]>([]);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFavoriteUsers()
    }, [])

    const fetchFavoriteUsers = async () => {
        try {
            setLoading(true);
            const products = await FavoriteManagement.fetchFavoritesByUser();
            setProductFavorites(products);
            setLoading(false);
        } catch (error: any) {
            console.log(error);
            setLoading(false);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    if (loading) {
        return (
            <>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back-sharp" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.paymentHeaderText}>
                        Favorites
                    </Text>
                </View>
                <ActivityIndicator size={"large"} color={CommonColors.primary} />
            </>
        )
    }

    return (
        <>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.paymentHeaderText}>
                    Favorites
                </Text>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={productFavorites}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                    }}
                    renderItem={({ index, item }) => (
                        <View key={`item-${item.id}`}>
                            <ProductItemComponent
                                index={index}
                                item={item}
                                preImage={preImage}
                                productType="regular"
                            />
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View style={{ marginTop: 20, marginHorizontal: 'auto', alignItems: 'center' }}>
                            <Image
                                style={{ width: 200, height: 200 }}
                                source={require('@/assets/images/no-data.png')}
                            />
                            <Text style={{ fontSize: 20, color: CommonColors.lightGray }}>
                                Không có dữ liệu
                            </Text>
                        </View>
                    )}
                />
            </View>
        </>
    )
}

const styles = FavoriteStyle;

export default FavoriteScreen;
import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { router, Stack, useFocusEffect } from 'expo-router';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MeStyle from './me.style';
import { AppConfig } from '@/src/common/config/app.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/data/types/global';
import * as UserManagement from '@/src/data/management/user.management';
import * as UserActions from '@/src/data/store/actions/user/user.action';
import * as CartActions from '@/src/data/store/actions/cart/cart.action';
import * as NotificationActions from '@/src/data/store/actions/notification/notification.action';
import { UserStoreState } from '@/src/data/store/reducers/user/user.reducer';
import { useToast } from '@/src/customize/toast.context';
import { MessageError } from '@/src/common/resource/message-error';
import * as ProductManagement from '@/src/data/management/product.management';
import { ProductModel } from '@/src/data/model/product.model';
import ProductItemComponent from '../home/comp/product-item/product-item.comp';
import { useWebSocket } from '@/src/customize/socket.context';
import { WebSocketNotificationType } from '@/src/common/resource/websocket';

type Props = {};

const MeScreen = (props: Props) => {
    const { showToast } = useToast();
    const preImage = new AppConfig().getPreImage();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const dispatch = useDispatch();
    const headerHeight = useHeaderHeight();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { sendMessage } = useWebSocket();

    useEffect(() => {
        fetchInfoUser();
        fetchProducts();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const fetchInfoUser = async () => {
        if (!userSelector.isLogged) {
            return;
        }
        try {
            const userLogged = await UserManagement.fetchInfoUser();
            userLogged.expires = true;
            dispatch(UserActions.UpdateInfoLogged(userLogged));
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Session expired, please log in again') {
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await ProductManagement.fetchLatestProduct();
            setProducts(response);
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false);
        }
    }

    const navigateToInfoDetailScreen = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }
        router.navigate('/(routes)/info-detail');
    };

    const logout = async () => {
        try {
            await new AppConfig().clear();
            dispatch(UserActions.ResetInfoLogged());
            dispatch(CartActions.ResetCart());
            dispatch(NotificationActions.ResetState());
            sendMessage({
                type: WebSocketNotificationType.LOGOUT,
                userId: userSelector.id
            })
            router.dismissAll();
            router.navigate({
                pathname: '/(tabs)',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const navigateFavoriteScreen = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }
        router.navigate('/(routes)/favorite');
    };

    const navigateOrderManageScreen = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }
        router.navigate('/(routes)/order-manage');
    };

    const navigateRegisterShop = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }

        router.navigate('/(routes)/register-shop');
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Hồ sơ',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <View style={[styles.container, { marginTop: headerHeight }]}>
                <LinearGradient
                    colors={['#33adff', '#3b82f6']}
                    style={styles.header}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <View style={styles.headerContent}>
                            <View style={styles.userInfo}>
                                {userSelector.image_url === '' ? (
                                    <Image
                                        source={{
                                            uri: 'https://tiki.vn/blog/wp-content/uploads/2023/01/Y7deW5ZtpOonbiD_XawHLHdkjKYKHvWxvxNZzKdXXn0L8InieLIH_-U5m0u-RUlFtXKp0Ty91Itj4Oxwn_tjKg_UZo3lxFSrOH_DHIbpKP1LDn80z6BbOxj4d8bmymdy8PWFGjLkTpCdoz-3X-KY7IedQ_dxWJlHSIBWwCYhgM02FvUfVUgLKOQxrQWgjw.jpg',
                                        }}
                                        style={styles.infoImage}
                                    />
                                ) : (
                                    <Image
                                        source={{ uri: `${preImage}/${userSelector.image_url}` }}
                                        style={styles.infoImage}
                                    />
                                )}
                                <View>
                                    <Text style={styles.username}>
                                        {userSelector.name === '' ? 'Anonymous' : userSelector.name}
                                    </Text>
                                    <Text style={styles.tagline}>Cảm hứng bất tận</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.registerShopButton}
                                onPress={navigateRegisterShop}
                            >
                                <Text style={styles.registerShopText}>Đăng ký cửa hàng</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </LinearGradient>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateOrderManageScreen}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="card-outline" size={22} color="#33adff" />
                            <Text style={styles.buttonText}>Danh sách đơn hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateFavoriteScreen}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="heart-outline" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Danh sách mong muốn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.navigate('/(routes)/address')}
                            activeOpacity={0.7}
                        >
                            <FontAwesome name="address-card-o" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Địa chỉ giao hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateToInfoDetailScreen}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="pencil-outline" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
                        </TouchableOpacity>
                        {userSelector.isLogged && userSelector.expires ? (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={logout}
                                activeOpacity={0.7}
                            >
                                <AntDesign name="logout" size={20} color="#33adff" />
                                <Text style={styles.buttonText}>Đăng xuất</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => router.navigate('/(routes)/sign-in')}
                                activeOpacity={0.7}
                            >
                                <AntDesign name="login" size={20} color="#33adff" />
                                <Text style={styles.buttonText}>Đăng nhập</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.recentlyViewedSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Sản phẩm gần đây</Text>
                        </View>
                        {products.length > 0 ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productCarousel}>
                                {products.map((product) => (
                                    <View key={`${product.id}-latest`} style={{ marginRight: 16 }}>
                                        <ProductItemComponent key={product.id} item={product} preImage={preImage} productType='regular' index={products.indexOf(product)} />
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = MeStyle;

export default MeScreen;
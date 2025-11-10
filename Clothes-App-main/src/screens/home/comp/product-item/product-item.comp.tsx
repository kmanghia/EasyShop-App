import React, { useState, useEffect } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Animated,
    StyleSheet,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ProductItemStyle from './product-item.style';
import { ProductModel } from '@/src/data/model/product.model';
import { useToast } from '@/src/customize/toast.context';
import { useDispatch, useSelector } from 'react-redux';
import * as UserActions from '@/src/data/store/actions/user/user.action';
import * as FavoriteManagement from '@/src/data/management/favorite.management';
import { MessageError } from '@/src/common/resource/message-error';
import { RootState } from '@/src/data/types/global';
import { UserStoreState } from '@/src/data/store/reducers/user/user.reducer';
import { formatPriceRender } from '@/src/common/utils/currency.helper';

type Props = {
    item: ProductModel & { isFavorite?: boolean };
    preImage: string;
    index: number;
    productType: 'sale' | 'regular';
};

const ProductItemComponent = ({ item, index, preImage, productType }: Props) => {
    const { showToast } = useToast();
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const isFavorite = userSelector.favorites.includes(item.id);
    const dispatch = useDispatch();
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.95))[0];
    const heartScale = useState(new Animated.Value(1))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: 300 + index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                delay: 300 + index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        if (isFavorite) {
            Animated.spring(heartScale, {
                toValue: 1.2,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start(() => {
                Animated.spring(heartScale, {
                    toValue: 1,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                }).start();
            });
        } else {
            heartScale.setValue(1);
        }
    }, [isFavorite]);

    const favoriteProduct = async () => {
        try {
            if (!userSelector.isLogged) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
                return;
            }
            await FavoriteManagement.favoriteProductByUser(item.id);
            dispatch(UserActions.AddFavorite(item.id));
        } catch (error: any) {
            console.log('ProductItemComponent: ', error);
            if (error?.message === 'Session expired, please log in again') {
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    };

    const unFavoriteProduct = async () => {
        try {
            if (!userSelector.isLogged) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
                return;
            }
            await FavoriteManagement.unfavoriteProductByUser(item.id);
            dispatch(UserActions.RemoveFavorite(item.id));
        } catch (error: any) {
            console.log('ProductItemComponent: ', error);
            if (error?.message === 'Session expired, please log in again') {
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    };

    const navigateDetails = () => {
        router.navigate({
            pathname: '/(routes)/product-details',
            params: {
                id: item.id,
                shop_id: item.shop?.id ?? 0,
                productType: productType,
            },
        });
    };

    return (
        <>
            {item && (
                <TouchableOpacity
                    onPress={navigateDetails}
                    activeOpacity={0.9}
                    style={{ transform: [{ scale: scaleAnim }] }}
                >
                    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: `${preImage}/${item.product_images[0].image_url}` }}
                                style={styles.productImg}
                            />
                            <TouchableOpacity
                                onPress={isFavorite ? unFavoriteProduct : favoriteProduct}
                                style={styles.bookmarkBtn}
                            >
                                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                                    <FontAwesome
                                        name={isFavorite ? 'heart' : 'heart-o'}
                                        size={18}
                                        color={isFavorite ? '#FF0000' : '#fff'}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.product_name}
                            </Text>
                            <Text style={styles.price}>
                                {formatPriceRender(item.unit_price)}₫
                            </Text>
                            <View style={styles.ratingSoldWrapper}>
                                <View style={styles.ratingWrapper}>
                                    <Text style={styles.ratingTxt}>{Number(item.rating).toFixed(1)}</Text>
                                    <FontAwesome name={'star'} size={13} color="#33adff" />
                                </View>
                                <View style={styles.soldWrapper}>
                                    <MaterialIcons name="shopping-bag" size={13} color="#33adff" />
                                    <Text style={styles.soldTxt}>{item.sold_quantity} đã bán</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = ProductItemStyle;

export default ProductItemComponent;
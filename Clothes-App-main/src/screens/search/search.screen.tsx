import React, { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SearchStyle from './search.style';
import { router, Stack } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import * as CategoryManagement from '../../data/management/category.management';
import { CategoryModel } from '@/src/data/model/category.model';
import { AppConfig } from '@/src/common/config/app.config';

type Props = {};

type CategoryItemProps = {
    item: CategoryModel;
    index: number;
    preImage: string;
    navigateCategorySearch: (parent_id: number) => void;
};

const CategoryItem = ({ item, index, preImage, navigateCategorySearch }: CategoryItemProps) => {
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.95))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                delay: 200 + index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                delay: 200 + index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, [index]);

    return (
        <TouchableOpacity
            onPress={() => navigateCategorySearch(item.id)}
            activeOpacity={0.9}
            style={{ transform: [{ scale: scaleAnim }] }}
        >
            <Animated.View style={[styles.itemWrapper, { opacity: fadeAnim }]}>
                <View style={styles.textWrapper}>
                    <Text style={styles.itemTitle}>
                        <Text style={styles.titleHighlight}>{item.category_name.charAt(0)}</Text>
                        {item.category_name.slice(1)}
                    </Text>
                    <View style={styles.itemCountWrapper}>
                        <Ionicons name="bag-outline" size={14} color="#33adff" />
                        <Text style={styles.itemCount}>{item.count} sản phẩm</Text>
                    </View>
                </View>
                <Image
                    source={{ uri: `${preImage}/${item.image_url}` }}
                    style={styles.itemImage}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const SearchScreen = (props: Props) => {
    const [preImage, setPreImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [headerFadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        fetchPreImage();
        fetchCategories();
        Animated.timing(headerFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    };

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            console.log('Đang tải lại danh mục...');
            const response = await CategoryManagement.fetchParentCategories();
            console.log('Category: Done!');
            setCategories(response);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCategories();
        setRefreshing(false);
    };

    const navigateCategorySearch = (parent_id: number) => {
        router.navigate({
            pathname: '/(routes)/category-search',
            params: {
                id: parent_id,
                search: '',
            },
        });
    };

    const headerHeight = useHeaderHeight();

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Danh mục',
                    headerShown: false,
                    headerTransparent: true,
                    headerTitleAlign: 'center',
                }}
            />
            <LinearGradient
                colors={['rgba(240,248,255,0.95)', 'rgba(224,242,254,0.95)']}
                style={[styles.container, { marginTop: headerHeight }]}
            >
                <Animated.View style={[styles.headerWrapper, { opacity: headerFadeAnim }]}>
                    <Text style={styles.headerTitle}>Danh mục</Text>
                </Animated.View>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#33adff']}
                            tintColor="#33adff"
                        />
                    }
                    renderItem={({ item, index }) => (
                        <CategoryItem
                            item={item}
                            index={index}
                            preImage={preImage}
                            navigateCategorySearch={navigateCategorySearch}
                        />
                    )}
                />
            </LinearGradient>
        </>
    );
};

const styles = SearchStyle;

export default SearchScreen;
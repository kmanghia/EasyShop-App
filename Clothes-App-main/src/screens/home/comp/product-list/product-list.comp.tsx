import React from 'react';
import { View, TouchableOpacity, FlatList, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductListStyle from './product-list.style';
import ProductItemComponent from '../product-item/product-item.comp';
import { ProductModel } from '@/src/data/model/product.model';
import { router } from 'expo-router';

type Props = {
    products: ProductModel[];
    preImage: string;
    flatlist: boolean;
};

const ProductListComponent = ({ products, preImage, flatlist }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Dành cho bạn</Text>
                <TouchableOpacity
                    onPress={() => {
                        router.push({
                            pathname: '/(routes)/search-result',
                            params: {
                                search: '',
                            },
                        });
                    }}
                    activeOpacity={0.7}
                    style={styles.titleButton}
                >
                    <Text style={styles.titleBtn}>Xem tất cả</Text>
                    <Ionicons name="chevron-forward" style={{ marginTop: 2 }} size={16} color="#33adff" />
                </TouchableOpacity>
            </View>
            {flatlist ? (
                <FlatList
                    data={products}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginBottom: 16,
                    }}
                    style={{ marginBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ index, item }) => (
                        <ProductItemComponent
                            item={item}
                            index={index}
                            preImage={preImage}
                            productType="regular"
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                        </View>
                    )}
                />
            ) : (
                <>
                    {products.length > 0 ? (
                        <View style={styles.itemsWrapper}>
                            {products.map((item, index) => (
                                <View key={item.id} style={styles.productWrapper}>
                                    <ProductItemComponent
                                        item={item}
                                        index={index}
                                        preImage={preImage}
                                        productType="regular"
                                    />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                        </View>
                    )}

                </>
            )}
        </View>
    );
};

const styles = ProductListStyle;

export default ProductListComponent;
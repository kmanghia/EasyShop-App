import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FlashSaleComponentStyle from './flash-sale.style';
import ProductItemComponent from '../product-item/product-item.comp';
import { ProductModel } from '@/src/data/model/product.model';
import { router } from 'expo-router';

type Props = {
    products: ProductModel[];
    preImage: string;
};

const FlashSaleComponent = ({ products, preImage }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Mới ra mắt</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.titleButton}
                    onPress={() => {
                        router.push({
                            pathname: '/(routes)/search-result',
                            params: {
                                search: '',
                                type: 'latest'
                            },
                        });
                    }}
                >
                    <Text style={styles.titleBtn}>
                        Xem tất cả
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#33adff" />
                </TouchableOpacity>
            </View>
            {products.length > 0 ? (
                <FlatList
                    data={products}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginLeft: 20, paddingRight: 20 }}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ index, item }) => (
                        <View style={{ marginRight: 10 }}>
                            <ProductItemComponent
                                item={item}
                                index={index}
                                preImage={preImage}
                                productType="sale"
                            />
                        </View>
                    )}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                </View>
            )}
        </View>
    );
};

const styles = FlashSaleComponentStyle;

export default FlashSaleComponent;
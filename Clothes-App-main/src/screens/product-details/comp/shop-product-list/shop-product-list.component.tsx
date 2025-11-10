import { CommonColors } from "@/src/common/resource/colors"
import { ProductModel } from "@/src/data/model/product.model"
import ProductItemComponent from "@/src/screens/home/comp/product-item/product-item.comp"
import { FlatList, Image, StyleSheet, View } from "react-native"

type Props = {
    products: ProductModel[],
    shop_id: number,
    preImage: string
}

const ShopProductListComponent = ({ products, shop_id, preImage }: Props) => {

    return (
        <View>
            <FlatList
                data={products}
                keyExtractor={(item) => `${item.id}`}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 10 }}></View>}
                renderItem={({ item, index }) => (
                    <ProductItemComponent item={item} index={index} preImage={preImage} productType="regular" />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: CommonColors.extraLightGray
    },
    imageItem: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    }
});

export default ShopProductListComponent;
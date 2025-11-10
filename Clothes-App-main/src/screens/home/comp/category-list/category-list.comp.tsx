import React, { useRef } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import CategoryListComponentStyle from "./category-list.style"
import CategoryItemComponent from "../category-item/category-item.comp"
import { CategoryModel } from "@/src/data/model/category.model"

type Props = {
    preImage: string,
    categories: CategoryModel[],
    setRefreshCategory: React.Dispatch<React.SetStateAction<boolean>>,
}

const CategoryListComponent = ({ categories, setRefreshCategory, preImage }: Props) => {
    const flatListRef = useRef<FlatList>(null);

    const checkRefresh = (event: any) => {
        const { contentOffset } = event.nativeEvent;
        if (contentOffset.x <= 0) {
            console.log('Đang tải lại danh mục...');
            setRefreshCategory(true);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>Danh mục</Text>
                </View>
                <FlatList
                    ref={flatListRef}
                    data={categories}
                    keyExtractor={(item) => `${item.id}`}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ index, item }) => (
                        <CategoryItemComponent item={item} preImage={preImage} index={index} />
                    )}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={(event) => checkRefresh(event)}
                />
            </View>
        </>
    )
}

const styles = CategoryListComponentStyle;

export default CategoryListComponent;
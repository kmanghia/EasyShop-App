import { CategoryType } from "@/src/data/types/global"
import { Image, Text, TouchableOpacity, View } from "react-native";
import CategoryItemComponentStyle from "./category-item.style";
import { CategoryModel } from "@/src/data/model/category.model";
import { AppConfig } from "@/src/common/config/app.config";
import { useEffect, useState } from "react";
import { router } from "expo-router";

type Props = {
    item: CategoryModel;
    preImage: string;
    index: number;
}

const CategoryItemComponent = ({ item, preImage, index }: Props) => {

    const navigateCategorySearch = (parent_id: number) => {
        router.navigate({
            pathname: "/(routes)/category-search",
            params: {
                id: parent_id,
                search: ''
            }
        })
    }

    return (
        <TouchableOpacity onPress={() => navigateCategorySearch(item?.id ?? 0)}>
            <View style={styles.itemContainer}>
                <Image source={{ uri: `${preImage}/${item.image_url}` }} style={styles.itemImg} />
                <Text style={styles.itemTxt}>{item.category_name}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = CategoryItemComponentStyle;

export default CategoryItemComponent;
import { CategoryModel } from "../model/category.model";
import * as CategoryService from "../service/category.service";

export const fetchParentCategories = async () => {
    try {
        const result = await CategoryService.fetchParentCategories();
        const response = result?.categories?.map(
            (category: any) => new CategoryModel().convertObj(category)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}


export const fetchCategoryBoth = async () => {
    try {
        const result = await CategoryService.fetchCategoryBoth();
        const response = result?.categories?.map(
            (category: any) => new CategoryModel().convertObj(category)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchParentCategoriesWithTotalProductByShop = async (
    shop_id: number
) => {
    try {
        const result = await CategoryService.fetchParentCategoriesWithTotalProductByShop(shop_id);
        const response = result?.categories?.map(
            (category: any) => new CategoryModel().convertObj(category)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}
import * as FavoriteService from '@/src/data/service/favorite.service'
import { ProductModel } from '../model/product.model';

export const fetchFavoritesByUser = async () => {
    try {
        const result = await FavoriteService.fetchFavoritesByUser();
        const response: ProductModel[] = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}

export const favoriteProductByUser = async (product_id: number) => {
    try {
        await FavoriteService.favoriteProductByUser(product_id);
        return true;
    } catch (error) {
        throw error;
    }
}

export const unfavoriteProductByUser = async (product_id: number) => {
    try {
        await FavoriteService.unfavoriteProductByUser(product_id);
        return true;
    } catch (error) {
        throw error;
    }
}
import * as ShopService from "@/src/data/service/shop.service";
import { ShopModel } from "../model/shop.model";
import { Sort } from "@/src/common/resource/sort";
import { ProductPaginate } from "../types/global";
import { ProductModel } from "../model/product.model";
import { PaginateModel } from "@/src/common/model/paginate.model";

export const fetchShopById = async (id: number) => {
    try {
        const result = await ShopService.fetchShopById(id);
        const response: ShopModel[] = result?.shops?.map(
            (shop: any) => new ShopModel().convertObj(shop)
        );

        if (response.length === 0) {
            return undefined;
        }

        return response[0];
    } catch (error) {
        throw error;
    }
}

export const fetchPopularProductsByShop = async (id: number, page: number, limit: number) => {
    try {
        const result = await ShopService.fetchPopularProductsByShop(id, page, limit);
        const productPaginate: ProductPaginate = {
            products: result?.products?.map((product: any) => new ProductModel().convertObj(product)) ?? [],
            paginate: result?.pagination
                ? new PaginateModel().convertObj(result.pagination)
                : new PaginateModel()
        }
        return productPaginate;
    } catch (error) {
        throw error;
    }
}

export const fetchLatestProductsByShop = async (id: number, page: number, limit: number) => {
    try {
        const result = await ShopService.fetchLatestProductsByShop(id, page, limit);
        const productPaginate: ProductPaginate = {
            products: result?.products?.map((product: any) => new ProductModel().convertObj(product)) ?? [],
            paginate: result?.pagination
                ? new PaginateModel().convertObj(result.pagination)
                : new PaginateModel()
        }
        return productPaginate;
    } catch (error) {
        throw error;
    }
}

export const fetchPriceProductsByShop = async (id: number, page: number, limit: number, sort: Sort) => {
    try {
        const result = await ShopService.fetchPriceProductsByShop(id, page, limit, sort);
        const productPaginate: ProductPaginate = {
            products: result?.products?.map((product: any) => new ProductModel().convertObj(product)) ?? [],
            paginate: result?.pagination
                ? new PaginateModel().convertObj(result.pagination)
                : new PaginateModel()
        }
        return productPaginate;
    } catch (error) {
        throw error;
    }
}

export const fetchProductsByParentCategoryInShop = async (
    shop_id: number,
    parent_category_id: number,
    page: number,
    limit: number,
) => {
    try {
        const result = await ShopService.fetchProductsByParentCategoryInShop(
            shop_id,
            parent_category_id,
            page,
            limit
        );
        const productPaginate: ProductPaginate = {
            products: result?.products?.map((product: any) => new ProductModel().convertObj(product)) ?? [],
            paginate: result?.pagination
                ? new PaginateModel().convertObj(result.pagination)
                : new PaginateModel()
        }
        return productPaginate;
    } catch (error) {
        throw error;
    }
}
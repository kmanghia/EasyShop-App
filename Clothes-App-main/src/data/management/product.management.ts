import { PaginateModel } from "@/src/common/model/paginate.model";
import * as ProductService from "../../data/service/product.service";
import { ProductModel } from "../model/product.model";
import { ProductVariantModel } from "../model/product_variant.model";
import { ProductPaginate } from "../types/global";
import { Sort } from "@/src/common/resource/sort";

export const fetchProducts = async () => {
    try {
        const result = await ProductService.fetchProducts();
        const response = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchRelativeProductInShop = async (shopId: number, productId: number) => {
    try {
        const result = await ProductService.fetchRelativeProductInShop(shopId, productId);
        const response = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchLatestProduct = async () => {
    try {
        const result = await ProductService.fetchLatestProduct();
        const response = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchProductsByShopId = async (id: number) => {
    try {
        const result = await ProductService.fetchProductsByShopId(id);
        const response = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchDetailProduct = async (id: number) => {
    try {
        const result = await ProductService.fetchDetailProduct(id);
        const response = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        return response[0];
    } catch (error) {
        throw error;
    }
}

export const fetchProductVariantByProductId = async (id: number) => {
    try {
        const result = await ProductService.fetchProductVariantByProductId(id);
        const response: ProductVariantModel[] = result?.variants?.map(
            (variant: any) => new ProductVariantModel().convertObj(variant)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}

export const searchAndFilterProductMobile = async (
    searchValue: string,
    page: number,
    limit: number,
    origins: string[],
    categoryId: number | null,
    sortPrice: Sort,
    minPrice: number,
    maxPrice: number,
    minRatings: number[],
    isLatest: boolean
) => {
    try {
        const result = await ProductService.searchAndFilterProductMobile(
            searchValue,
            page,
            limit,
            origins,
            categoryId,
            sortPrice,
            minPrice,
            maxPrice,
            minRatings,
            isLatest
        );
        const products: ProductModel[] = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        const paginate = new PaginateModel().convertObj(result?.paginate);
        const response: ProductPaginate = {
            products: products,
            paginate: paginate
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export const searchAndFilterProductShopMobile = async (
    shop_id: number,
    searchValue: string,
    page: number,
    limit: number,
    origins: string[],
    categoryId: number | null,
    sortPrice: Sort,
    minPrice: number,
    maxPrice: number,
    minRatings: number[]
) => {
    try {
        const result = await ProductService.searchAndFilterProductShopMobile(
            shop_id,
            searchValue,
            page,
            limit,
            origins,
            categoryId,
            sortPrice,
            minPrice,
            maxPrice,
            minRatings
        );
        const products: ProductModel[] = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        const paginate = new PaginateModel().convertObj(result?.paginate);
        const response: ProductPaginate = {
            products: products,
            paginate: paginate
        }

        return response;
    } catch (error) {
        throw error;
    }
}

export const searchAndFilterProductsByParentCategoryMobile = async (
    parentCategoryId: number,
    searchValue: string,
    page: number,
    limit: number,
    origins: string[],
    sortPrice: Sort,
    minPrice: number,
    maxPrice: number,
    minRatings: number[]
) => {
    try {
        const result = await ProductService.searchAndFilterProductsByParentCategoryMobile(
            parentCategoryId,
            searchValue,
            page,
            limit,
            origins,
            sortPrice,
            minPrice,
            maxPrice,
            minRatings
        );
        const products: ProductModel[] = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        const paginate = new PaginateModel().convertObj(result?.paginate);
        const response: ProductPaginate = {
            products: products,
            paginate: paginate
        }

        return response;
    } catch (error) {
        throw error;
    }
}
import { AppConfig } from "@/src/common/config/app.config";
import { Sort } from "@/src/common/resource/sort";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchProducts = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/mobile`
        )

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchRelativeProductInShop = async (shopId: number, productId: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/${shopId}/${productId}/relative`
        )

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchLatestProduct = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/latest`
        )

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchProductsByShopId = async (id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/shop/${id}/mobile`
        )

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchDetailProduct = async (id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/${id}/mobile`
        )

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchProductVariantByProductId = async (id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/${id}/variants/mobile`
        )

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
        const domain = new AppConfig().getDomain();

        const queryParams = new URLSearchParams({
            search: searchValue,
            page: page.toString(),
            limit: limit.toString(),
            ...(categoryId !== null && { categoryId: categoryId.toString() }),
            sortPrice: sortPrice,
            minPrice: minPrice.toString(),
            maxPrice: maxPrice.toString()
        });

        if (origins && origins.length > 0) {
            let originParams = origins.join(',');
            queryParams.append('origins', originParams);
        }

        if (minRatings && minRatings.length > 0) {
            let minRatingParams = minRatings.map((rating) => rating.toString()).join(',');
            queryParams.append('minRatings', minRatingParams);
        }

        const response = await ServiceCore.GET(
            `${domain}`,
            isLatest
                ? `product/latest/search-and-filter?${queryParams.toString()}`
                : `product/search-and-filter?${queryParams.toString()}`
        )

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
        const domain = new AppConfig().getDomain();

        const queryParams = new URLSearchParams({
            search: searchValue,
            page: page.toString(),
            limit: limit.toString(),
            ...(categoryId !== null && { categoryId: categoryId.toString() }),
            sortPrice: sortPrice,
            minPrice: minPrice.toString(),
            maxPrice: maxPrice.toString()
        });

        if (origins && origins.length > 0) {
            let originParams = origins.join(',');
            queryParams.append('origins', originParams);
        }

        if (minRatings && minRatings.length > 0) {
            let minRatingParams = minRatings.map((rating) => rating.toString()).join(',');
            queryParams.append('minRatings', minRatingParams);
        }

        const response = await ServiceCore.GET(
            `${domain}`,
            `product/search-and-filter/shop/${shop_id}?${queryParams.toString()}`
        )

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
        const domain = new AppConfig().getDomain();
        const queryParams = new URLSearchParams({
            search: searchValue,
            page: page.toString(),
            limit: limit.toString(),
            sortPrice: sortPrice,
            minPrice: minPrice.toString(),
            maxPrice: maxPrice.toString()
        });

        if (origins && origins.length > 0) {
            let originParams = origins.join(',');
            queryParams.append('origins', originParams);
        }

        if (minRatings && minRatings.length > 0) {
            let minRatingParams = minRatings.map((rating) => rating.toString()).join(',');
            queryParams.append('minRatings', minRatingParams);
        }

        const response = await ServiceCore.GET(
            `${domain}`,
            `product/search-and-filter/category/${parentCategoryId}?${queryParams.toString()}`
        )

        return response;
    } catch (error) {
        throw error;
    }
}
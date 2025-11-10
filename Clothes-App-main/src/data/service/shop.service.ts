import { AppConfig } from "@/src/common/config/app.config";
import { Sort } from "@/src/common/resource/sort";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchShopById = async (id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `shop/${id}/mobile`
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchPopularProductsByShop = async (id: number, page: number, limit: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `shop/${id}/product/best-sellers?page=${page}&limit=${limit}`
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchLatestProductsByShop = async (id: number, page: number, limit: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `shop/${id}/product/recents?page=${page}&limit=${limit}`
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchPriceProductsByShop = async (id: number, page: number, limit: number, sort: Sort) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `shop/${id}/product/prices?page=${page}&limit=${limit}&sort=${sort}`
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchProductsByParentCategoryInShop = async (
    shop_id: number,
    parent_category_id: number,
    page: number,
    limit: number
) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `shop/${shop_id}/category/${parent_category_id}/products?page=${page}&limit=${limit}`
        );

        return response;
    } catch (error) {
        throw error;
    }
}
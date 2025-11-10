import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchFavoritesByUser = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const userLogged = await new AppConfig().getUserInfo();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product-favorite/user/${userLogged.id}`
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const favoriteProductByUser = async (product_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.POST(
            `${domain}`,
            `product-favorite/product/${product_id}`,
            {}
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const unfavoriteProductByUser = async (product_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.POST(
            `${domain}`,
            `product-favorite/product/${product_id}/unfavorite`,
            {}
        );
        return response;
    } catch (error) {
        throw error;
    }
}
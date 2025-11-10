import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";
import { ProductVariantModel } from "../model/product_variant.model";
import { CartItemModel } from "../model/cart.model";
import { CartShopFinalType } from "../types/global";

export const fetchCartByUserNonAuthenticate = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const user_id = userInfo.id;
        const cart_id = userInfo.cart_id;
        const response = await ServiceCore.GET(
            `${domain}`,
            `cart/${cart_id}/user/${user_id}`
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchCartByUser = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const cart_id = userInfo.cart_id;
        const response = await ServiceCore.GET(
            `${domain}`,
            `cart/${cart_id}`
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const addCartItem = async (product_variant: ProductVariantModel, quantity: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const cart_id = userInfo.cart_id;
        const itemInfo = new CartItemModel().convertModelToExecute(product_variant, quantity);
        const response = await ServiceCore.POST(
            `${domain}`,
            `cart/${cart_id}/add`,
            itemInfo
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateCartItem = async (item_id: number, product_variant: ProductVariantModel, quantity: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const cart_id = userInfo.cart_id;
        const itemInfo = new CartItemModel().convertModelToExecute(product_variant, quantity);
        const response = await ServiceCore.PUT(
            `${domain}`,
            `cart/${cart_id}/item/${item_id}/update`,
            itemInfo
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateQuantityCartItem = async (item_id: number, quantity: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const cart_id = userInfo.cart_id;
        const response = await ServiceCore.PUT(
            `${domain}`,
            `cart/${cart_id}/item/${item_id}/quantity`,
            { quantity: quantity }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const removeCartItem = async (item_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const cart_id = userInfo.cart_id;
        const response = await ServiceCore.DELETE(
            `${domain}`,
            `cart/${cart_id}/item/${item_id}`,
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const removeCartShop = async (cart_shop_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const cart_id = userInfo.cart_id;
        const response = await ServiceCore.DELETE(
            `${domain}`,
            `cart/${cart_id}/cart-shop/${cart_shop_id}`,
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const paymentCart = async (
    address_id: number | null,
    cart_shops: CartShopFinalType[],
    subtotal: number,
    discount: number,
    final_total: number
) => {
    try {
        const domain = new AppConfig().getDomain();
        const cartInfo = convertCartInfo(
            address_id,
            cart_shops,
            subtotal,
            discount,
            final_total
        );
        const response = await ServiceCore.POST(
            `${domain}`,
            `order/mobile`,
            cartInfo
        );
        return response;
    } catch (error) {
        throw error;
    }
}

const convertCartInfo = (
    address_id: number | null,
    cart_shops: CartShopFinalType[],
    subtotal: number,
    discount: number,
    final_total: number
) => {
    return {
        address_id: address_id,
        cart_shops: cart_shops,
        subtotal: subtotal,
        discount: discount,
        final_total: final_total
    }
}
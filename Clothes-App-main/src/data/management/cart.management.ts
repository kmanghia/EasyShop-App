import { ErrorModel } from "@/src/common/model/error.model";
import { CartItemModel, CartModel } from "../model/cart.model";
import { ProductVariantModel } from "../model/product_variant.model";
import * as CartService from "../service/cart.service";
import { CartShopFinalType } from "../types/global";
import { OrderModel } from "../model/order.model";

export const fetchCartByUserNonAuthenticate = async () => {
    try {
        const result = await CartService.fetchCartByUserNonAuthenticate();
        return new CartModel().convertObj(result?.carts[0]);
    } catch (error) {
        throw error;
    }
}

export const fetchCartByUser = async () => {
    try {
        const result = await CartService.fetchCartByUser();
        return new CartModel().convertObj(result?.carts[0]);
    } catch (error) {
        throw error;
    }
}

export const addCartItem = async (product_variant: ProductVariantModel, quantity: number): Promise<Map<string, any>> => {
    try {
        const result = await CartService.addCartItem(product_variant, quantity);
        const cartItem = result?.cart_item ? new CartItemModel().convertObj(result?.cart_item) : new CartItemModel();
        const cartShopId = result?.cart_shop_id;
        const response = new Map<string, any>();
        response.set('cart_item', cartItem);
        response.set('cart_shop_id', cartShopId);
        response.set('quantity', quantity);
        return response;
    } catch (error) {
        throw error as ErrorModel;
    }
}

export const updateCartItem = async (item_id: number, product_variant: ProductVariantModel, quantity: number) => {
    try {
        await CartService.updateCartItem(item_id, product_variant, quantity);
        return true;
    } catch (error) {
        throw error;
    }
}

export const updateQuantityCartItem = async (item_id: number, quantity: number) => {
    try {
        await CartService.updateQuantityCartItem(item_id, quantity);
        return true;
    } catch (error) {
        throw error;
    }
}

export const removeCartItem = async (item_id: number) => {
    try {
        await CartService.removeCartItem(item_id);
        return true;
    } catch (error) {
        throw error;
    }
}

export const removeCartShop = async (cart_shop_id: number) => {
    try {
        await CartService.removeCartShop(cart_shop_id);
        return true;
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
        const result = await CartService.paymentCart(
            address_id,
            cart_shops,
            subtotal,
            discount,
            final_total
        );
        console.log(result);
        const response: OrderModel[] = result?.orders?.map(
            (order: any) => new OrderModel().convertObj(order)
        ) ?? [];
        return response[0];
    } catch (error) {
        throw error;
    }
}
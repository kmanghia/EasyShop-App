import { CartItemModel, CartModel } from "@/src/data/model/cart.model";
import { ActionState } from "../../action.state";
import { ProductVariantModel } from "@/src/data/model/product_variant.model";

export enum CartActions {
    SAVE_CART = '@Cart/SaveCart',
    RESET_CART = '@Cart/ResetCart',
    REMOVE_CART_SHOP = '@Cart/RemoveCartShop',
    REMOVE_CART_ITEM = '@Cart/RemoveCartItem',
    UPDATE_CART_ITEM = '@Cart/UpdateCartItem',
    ADD_CART_ITEM_TO_CART = '@Cart/AddCartItemToCart',
    UPDATE_QUANTITY_CART_ITEM = '@Cart/UpdateQuantityCartItem',
}

export const SaveCart = (cart: CartModel) => ({
    type: CartActions.SAVE_CART,
    data: cart
} as ActionState)

export const ResetCart = () => ({
    type: CartActions.RESET_CART
} as ActionState)

export const RemoveCartShop = (cart_shop_id: number) => ({
    type: CartActions.REMOVE_CART_SHOP,
    data: cart_shop_id
} as ActionState)

export const RemoveCartItem = (cart_item_id: number, cart_shop_id: number) => ({
    type: CartActions.REMOVE_CART_ITEM,
    data: {
        cart_item_id,
        cart_shop_id
    }
} as ActionState)

export const UpdateCartItem = (
    product_variant: ProductVariantModel,
    cart_item_id: number,
    cart_shop_id: number,
    quantity: number
) => ({
    type: CartActions.UPDATE_CART_ITEM,
    data: {
        product_variant: product_variant,
        cart_item_id: cart_item_id,
        cart_shop_id: cart_shop_id,
        quantity: quantity
    }
} as ActionState);

export const AddCartItemToCart = (
    cart_item: CartItemModel,
    cart_shop_id: number,
    quantity: number
) => ({
    type: CartActions.ADD_CART_ITEM_TO_CART,
    data: {
        cart_item: cart_item,
        cart_shop_id: cart_shop_id,
        quantity: quantity
    }
} as ActionState)

export const UpdateQuantityCartItem = (
    cart_item_id: number,
    cart_shop_id: number,
    quantity: number
) => ({
    type: CartActions.UPDATE_QUANTITY_CART_ITEM,
    data: {
        cart_item_id,
        cart_shop_id,
        quantity
    }
} as ActionState)
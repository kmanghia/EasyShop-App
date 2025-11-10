import { CartItemModel, CartModel, CartShopModel } from "@/src/data/model/cart.model";
import { ActionState } from "../../action.state";
import { CartActions } from "../../actions/cart/cart.action";

export interface CartStoreState {
    id: number,
    user_id: number,
    cart_shops: CartShopModel[]
}

const initialState: CartStoreState = {
    id: 0,
    user_id: 0,
    cart_shops: []
}

export const CartReducer = (state = initialState, actions: ActionState) => {
    switch (actions.type) {
        case CartActions.SAVE_CART:
            return {
                ...state,
                id: actions?.data?.id ?? 0,
                user_id: actions?.data?.user_id ?? 0,
                cart_shops: actions?.data?.cart_shops ?? []
            } as CartStoreState;
        case CartActions.RESET_CART:
            return {
                ...state,
                cart_shops: []
            } as CartStoreState;
        case CartActions.REMOVE_CART_SHOP:
            return state;
        case CartActions.REMOVE_CART_ITEM:
            {
                const { cart_item_id, cart_shop_id } = actions.data;
                if (!cart_item_id || !cart_shop_id) {
                    return state;
                }

                let currCartShops = state.cart_shops.map(shop => ({
                    ...shop,
                    cart_items: [...shop.cart_items]
                }));

                const updatedCartShop = currCartShops.find(cart_shop => cart_shop.id === cart_shop_id);
                if (!updatedCartShop) {
                    return state;
                }

                const afterRemoveList = updatedCartShop.cart_items.filter(item => item.id !== cart_item_id);

                updatedCartShop.cart_items = afterRemoveList;

                if (afterRemoveList.length === 0) {
                    console.log('Remove');
                    currCartShops = currCartShops.filter(cart_shop => cart_shop.id !== cart_shop_id);
                }

                return {
                    ...state,
                    cart_shops: currCartShops
                } as CartStoreState;
            }
        case CartActions.ADD_CART_ITEM_TO_CART:
            {
                let cart_item = actions?.data?.cart_item as CartItemModel;
                let cart_shop_id = actions?.data?.cart_shop_id;
                let addedQuantity = actions?.data?.quantity;

                if (!cart_shop_id || !cart_item || !cart_item.id || typeof addedQuantity !== 'number' || addedQuantity <= 0) {
                    return state;
                }

                const currCartShops = state.cart_shops.map(shop => ({
                    ...shop,
                    cart_items: [...shop.cart_items]
                }));

                const updatedCartShop = currCartShops.find(cart_shop => cart_shop.id === cart_shop_id);
                if (updatedCartShop) {
                    const updatedCartItem = updatedCartShop.cart_items.find(item => item.id === cart_item.id);
                    if (updatedCartItem) {
                        updatedCartItem.quantity += addedQuantity;
                    } else {
                        updatedCartShop.cart_items.push(cart_item);
                    }
                } else {
                    const newCartShop = new CartShopModel();
                    newCartShop.id = cart_shop_id;
                    newCartShop.cart_items.push(cart_item);
                    currCartShops.push(newCartShop);
                }

                return {
                    ...state,
                    cart_shops: currCartShops
                } as CartStoreState
            }
        case CartActions.UPDATE_QUANTITY_CART_ITEM:
            {
                const { cart_item_id, cart_shop_id, quantity } = actions.data;
                if (!cart_item_id || !cart_shop_id || typeof quantity !== 'number' || quantity <= 0) {
                    return state;
                }

                const currCartShops = state.cart_shops.map(shop => ({
                    ...shop,
                    cart_items: [...shop.cart_items]
                }));

                const updatedCartShop = currCartShops.find(cart_shop => cart_shop.id === cart_shop_id);
                if (!updatedCartShop) {
                    return state;
                }

                const updatedCartItem = updatedCartShop.cart_items.find(item => item.id === cart_item_id);
                if (!updatedCartItem) {
                    return state;
                }

                updatedCartItem.quantity = quantity;

                return {
                    ...state,
                    cart_shops: currCartShops
                } as CartStoreState
            }
        case CartActions.UPDATE_CART_ITEM:
            {
                const { cart_item_id, cart_shop_id, product_variant, quantity } = actions.data;
                if (!cart_item_id || !cart_shop_id || !product_variant || typeof quantity !== 'number' || quantity <= 0) {
                    return state;
                }

                const currCartShops = state.cart_shops.map(shop => ({
                    ...shop,
                    cart_items: [...shop.cart_items]
                }));

                const updatedCartShop = currCartShops.find(cart_shop => cart_shop.id === cart_shop_id);
                if (!updatedCartShop) {
                    return state;
                }

                const updatedCartItem = updatedCartShop.cart_items.find(item => item.id === cart_item_id);
                if (!updatedCartItem) {
                    return state;
                }

                updatedCartItem.product_variant = product_variant;
                updatedCartItem.quantity = quantity;

                return {
                    ...state,
                    cart_shops: currCartShops
                } as CartStoreState
            }
        default:
            return state;
    }
}
import { CouponModel } from "./coupon.model";
import { ProductVariantModel } from "./product_variant.model";
import { ShopModel } from "./shop.model";

export class CartModel {
    id: number;
    user_id: number;
    cart_shops: CartShopModel[];

    constructor(
        id?: number,
        user_id?: number,
        cart_shops?: CartShopModel[]
    ) {
        this.id = id ?? 0;
        this.user_id = user_id ?? 0;
        this.cart_shops = cart_shops ?? [];
    }

    convertObj(data: any) {
        const obj = new CartModel();
        obj.id = data?.id ?? 0;
        obj.user_id = data?.user_id ?? 0;
        obj.cart_shops = data?.cart_shops?.map(
            (item: any) => new CartShopModel().convertObj(item)
        )

        return obj;
    }
}

export class CartShopModel {
    id: number;
    shop: ShopModel | undefined;
    cart_items: CartItemModel[];
    selectedCoupon?: CouponModel | null;

    constructor(
        id?: number,
        shop?: ShopModel,
        cart_items?: CartItemModel[],
        selectedCoupon?: CouponModel
    ) {
        this.id = id ?? 0;
        this.shop = shop ?? undefined;
        this.cart_items = cart_items ?? [];
        this.selectedCoupon = selectedCoupon ?? null;
    }

    convertObj(data: any) {
        const obj = new CartShopModel();
        obj.id = data?.id ?? 0;
        obj.shop = new ShopModel().convertObj(data?.shop) ?? undefined;
        obj.cart_items = data?.cart_items?.map(
            (item: any) => new CartItemModel().convertObj(item)
        ) ?? [];
        obj.selectedCoupon = data?.selected_coupon ? new CouponModel().convertObj(data?.selected_coupon) : null;

        return obj;
    }
}

export class CartItemModel {
    id: number;
    product_variant: ProductVariantModel | undefined;
    quantity: number;

    constructor(
        id?: number,
        product_variant?: ProductVariantModel,
        quantity?: number,
    ) {
        this.id = id ?? 0;
        this.product_variant = product_variant ?? undefined;
        this.quantity = quantity ?? 0;
    }

    convertObj(data: any) {
        const obj = new CartItemModel();
        obj.id = data?.id ?? 0;
        obj.product_variant = new ProductVariantModel().convertObj(data?.product_variant) ?? undefined;
        obj.quantity = data?.quantity;

        return obj;
    }

    convertModelToExecute(data: ProductVariantModel, quantity: number) {
        return {
            shop_id: data.product?.shop?.id ?? 0,
            product_variant_id: data.id,
            quantity: quantity
        }
    }
}
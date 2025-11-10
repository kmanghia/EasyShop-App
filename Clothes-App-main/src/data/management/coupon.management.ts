import * as CouponService from "@/src/data/service/coupon.service";
import { CouponModel } from "../model/coupon.model";

export const fetchCouponShopMobile = async (shop_id: number) => {
    try {
        const result = await CouponService.fetchCouponShopMobile(shop_id);
        const response: CouponModel[] = result?.coupons?.map(
            (coupon: any) => new CouponModel().convertObj(coupon)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchCouponShopOnlyMobile = async (shop_id: number) => {
    try {
        const result = await CouponService.fetchCouponShopOnlyMobile(shop_id);
        const response: CouponModel[] = result?.coupons?.map(
            (coupon: any) => new CouponModel().convertObj(coupon)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchCouponUserMobile = async () => {
    try {
        const result = await CouponService.fetchCouponUserMobile();
        const response: CouponModel[] = result?.coupons?.map(
            (coupon: any) => new CouponModel().convertObj(coupon)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const saveCouponMobile = async (coupon_id: number) => {
    try {
        await CouponService.saveCouponMobile(coupon_id);
        return true;
    } catch (error) {
        throw error;
    }
}

export const applyCouponCartShopMobile = async (cart_shop_id: number, coupon_id: number) => {
    try {
        await CouponService.applyCouponCartShopMobile(cart_shop_id, coupon_id);
        return true;
    } catch (error) {
        throw error;
    }
}

export const removeCouponFromCartShopMobile = async (cart_shop_id: number) => {
    try {
        await CouponService.removeCouponFromCartShopMobile(cart_shop_id);
        return true;
    } catch (error) {
        throw error;
    }
}
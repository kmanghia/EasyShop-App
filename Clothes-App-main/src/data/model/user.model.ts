import { Gender } from "@/src/common/resource/gender";
import { ShopModel } from "./shop.model";

export class UserModel {
    id: number;
    name: string;
    email: string;
    gender: number;
    phone: string;
    address: string;
    image_url: string;
    cart_id: number;
    roles: string;
    expires: boolean;
    shop: ShopModel | null;
    shopId: number | null;

    constructor(
        id?: number,
        name?: string,
        email?: string,
        gender?: number,
        phone?: string,
        address?: string,
        image_url?: string,
        cart_id?: number,
        roles?: string,
        expires?: boolean,
        shop?: ShopModel,
        shopId?: number
    ) {
        this.id = id ?? 0;
        this.name = name ?? '';
        this.email = email ?? '';
        this.gender = gender ?? Gender.OTHER;
        this.phone = phone ?? '';
        this.address = address ?? '';
        this.image_url = image_url ?? '';
        this.cart_id = cart_id ?? 0;
        this.roles = roles ?? '';
        this.expires = expires ?? false;
        this.shop = shop ?? null;
        this.shopId = shopId ?? null;
    }

    convertObj(data: any) {
        const model = new UserModel();
        model.id = data?.id ?? 0;
        model.name = data?.name ?? '';
        model.email = data?.email ?? '';
        model.gender = data?.gender ?? Gender.OTHER;
        model.phone = data?.phone ?? '';
        model.address = data?.address ?? '';
        model.image_url = data?.image_url ?? '';
        model.cart_id = data?.cart_id ?? 0;
        model.roles = data?.roles ?? '';
        model.shop = data?.shop ? new ShopModel().convertObj(data.shop) : null;
        model.shopId = data?.shopId ?? null;

        return model;
    }

    toJsonExecute(data: UserModel) {
        return {
            name: data.name,
            phone: data.phone,
            gender: data.gender,
            address: data.address
        }
    }
}
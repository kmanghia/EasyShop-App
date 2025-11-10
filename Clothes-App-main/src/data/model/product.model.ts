import { CategoryModel } from "./category.model";
import { ShopModel } from "./shop.model";

export class ProductModel {
    id: number;
    product_name: string;
    product_images: ProductImageModel[];
    origin: string;
    gender: string;
    description: string;
    sold_quantity: number;
    unit_price: number;
    rating: number;
    category: CategoryModel | undefined;
    shop: ShopModel | undefined;

    constructor(
        id?: number,
        product_name?: string,
        product_images?: ProductImageModel[],
        origin?: string,
        gender?: string,
        description?: string,
        sold_quantity?: number,
        unit_price?: number,
        rating?: number,
        category?: CategoryModel,
        shop?: ShopModel
    ) {
        this.id = id ?? 0;
        this.product_name = product_name ?? '';
        this.product_images = product_images ?? [];
        this.origin = origin ?? '';
        this.gender = gender ?? '';
        this.description = description ?? '';
        this.sold_quantity = sold_quantity ?? 0;
        this.unit_price = unit_price ?? 0;
        this.rating = rating ?? 0;
        this.category = category ?? undefined;
        this.shop = shop ?? undefined;
    }

    convertObj(data: any) {
        const obj = new ProductModel();
        obj.id = data?.id ?? 0;
        obj.product_name = data?.product_name ?? '';
        obj.product_images = data?.product_images?.map(
            (product_image: any) => new ProductImageModel(product_image?.id, product_image?.image_url)
        );
        obj.origin = data?.origin ?? '';
        obj.gender = data?.gender ?? '';
        obj.description = data?.description ?? '';
        obj.sold_quantity = data?.sold_quantity ?? 0;
        obj.unit_price = data?.unit_price ?? 0;
        obj.rating = data?.rating ?? 0;
        obj.category = data?.category ? new CategoryModel().convertObj(data?.category) : undefined;
        obj.shop = data?.shop ? new ShopModel().convertObj(data?.shop) : undefined;

        return obj;
    }
}

export class ProductImageModel {
    id: number;
    image_url: string;

    constructor(
        id?: number,
        image_url?: string
    ) {
        this.id = id ?? 0;
        this.image_url = image_url ?? '';
    }
}
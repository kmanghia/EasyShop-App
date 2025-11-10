import { CategoryModel } from "./category.model";
import { ProductModel } from "./product.model";
import { ColorModel, SizeModel } from "./product_variant.model";
import { UserModel } from "./user.model";

export class ReviewModel {
    id: number;
    user: UserModel | undefined;
    product: ProductModel | undefined;
    rating: number;
    comment: string;
    created_at: Date | null;

    constructor(
        id?: number,
        user?: UserModel | undefined,
        product?: ProductModel | undefined,
        rating?: number,
        comment?: string,
        created_at?: Date | null,
    ) {
        this.id = id ?? 0;
        this.user = user ?? undefined;
        this.product = product ?? undefined;
        this.rating = rating ?? 0;
        this.comment = comment ?? '';
        this.created_at = created_at ?? null;
    }

    convertObj(data: any) {
        const model = new ReviewModel();
        model.id = data?.id ?? 0;
        model.user = data?.user ? new UserModel().convertObj(data?.user) : undefined;
        model.product = data?.product ? new ProductModel().convertObj(data?.product) : undefined;
        model.rating = data?.rating ?? 0;
        model.comment = data?.comment ?? '';
        model.created_at = data?.created_at ?? null;

        return model;
    }
}

export class ProductReviewModel {
    id: number;
    user: UserModel | undefined;
    review: ReviewModel | undefined;
    order_id: number;
    order_item_id: number;
    product_id: number;
    product_variant_id: number;
    product_name: string;
    image_url: string;
    color: ColorModel | undefined;
    size: SizeModel | undefined;
    category: CategoryModel | undefined;
    purchased_at: Date | null;
    created_at: Date | null;

    constructor(
        id?: number,
        user?: UserModel | undefined,
        review?: ReviewModel | undefined,
        order_id?: number,
        order_item_id?: number,
        product_id?: number,
        product_variant_id?: number,
        product_name?: string,
        image_url?: string,
        color?: ColorModel | undefined,
        size?: SizeModel | undefined,
        category?: CategoryModel | undefined,
        purchased_at?: Date | null,
        created_at?: Date | null,
    ) {
        this.id = id ?? 0;
        this.user = user ?? undefined;
        this.review = review ?? undefined;
        this.order_id = order_id ?? 0;
        this.order_item_id = order_item_id ?? 0;
        this.product_id = product_id ?? 0;
        this.product_variant_id = product_variant_id ?? 0;
        this.product_name = product_name ?? '';
        this.image_url = image_url ?? '';
        this.color = color ?? undefined;
        this.size = size ?? undefined;
        this.category = category ?? undefined;
        this.purchased_at = purchased_at ?? null;
        this.created_at = created_at ?? null;
    }

    convertObj(data: any) {
        const obj = new ProductReviewModel();
        obj.id = data?.id ?? 0;
        obj.user = data?.user ? new UserModel().convertObj(data?.user) : undefined;
        obj.review = data?.review ? new ReviewModel().convertObj(data?.review) : undefined;
        obj.order_id = data?.order_id ?? 0;
        obj.order_item_id = data?.order_item_id ?? 0;
        obj.product_id = data?.product_id ?? 0;
        obj.product_variant_id = data?.product_variant_id ?? 0;
        obj.product_name = data?.product_name ?? '';
        obj.image_url = data?.image_url ?? '';
        obj.color = data?.color ? new ColorModel().convertObj(data.color) : undefined;
        obj.size = data?.size ? new SizeModel().convertObj(data.size) : undefined;
        obj.category = data?.category ? new CategoryModel().convertObj(data.category) : undefined;
        obj.purchased_at = data?.purchased_at ?? null;
        obj.created_at = data?.created_at ?? null;

        return obj;
    }

    convertDataToModel(selectedItem: ProductReviewModel, reviewModel: ReviewModel) {
        const payload = new ProductReviewModel();
        payload.id = selectedItem.id;
        payload.user = selectedItem.user;
        payload.product_id = selectedItem.product_id;
        payload.product_variant_id = selectedItem.product_variant_id;
        payload.product_name = selectedItem.product_name;
        payload.order_id = selectedItem.order_id;
        payload.category = selectedItem.category;
        payload.order_item_id = selectedItem.order_item_id;
        payload.image_url = selectedItem.image_url;
        payload.review = reviewModel;

        return payload;
    }

    convertModelToExecute(data: ProductReviewModel) {
        return {
            product_id: data.product_id,
            order_item_id: data.order_item_id,
            rating: data.review?.rating,
            comment: data.review?.comment
        }
    }
}
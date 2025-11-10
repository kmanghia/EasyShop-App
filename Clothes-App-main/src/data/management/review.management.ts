import * as ReviewService from "@/src/data/service/review.service";
import { ProductReviewModel, ReviewModel } from "../model/review.model";
import { PaginateModel } from "@/src/common/model/paginate.model";

export const fetchListUnreviewPurchaseUser = async () => {
    try {
        const result = await ReviewService.fetchListUnreviewPurchaseUser();
        const response: ProductReviewModel[] = result?.unreviewedPurchases?.map(
            (item: any) => new ProductReviewModel().convertObj(item)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchListReviewedPurchaseUser = async () => {
    try {
        const result = await ReviewService.fetchListReviewedPurchaseUser();
        const response: ProductReviewModel[] = result?.reviewedPurchases?.map(
            (item: any) => new ProductReviewModel().convertObj(item)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchListReviewProduct = async (product_id: number, page: number, limit: number) => {
    try {
        const result = await ReviewService.fetchListReviewProduct(product_id, page, limit);
        const reviews: ProductReviewModel[] = result?.reviews?.map(
            (item: any) => new ProductReviewModel().convertObj(item)
        ) ?? [];
        const paginate: PaginateModel = new PaginateModel().convertObj(result?.pagination);
        const response = new Map<string, any>();
        response.set('reviews', reviews);
        response.set('paginate', paginate);
        response.set('avgRating', result?.avgRating);
        return response;
    } catch (error) {
        throw error;
    }
}

export const addReviewPurchaseUser = async (data: ProductReviewModel) => {
    try {
        const result = await ReviewService.addReviewPurchaseUser(data);
        return new ReviewModel().convertObj(result?.updatedReviews[0]);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


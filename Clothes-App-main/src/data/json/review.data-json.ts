import { ProductModel } from "../model/product.model";
import { ReviewModel } from "../model/review.model";
import { UserModel } from "../model/user.model";

// Mock data for UserModel
const mockUsers = [
    new UserModel(1, "lacongdanh", "Lacong Danh"),
    new UserModel(2, "nguyenminh", "Nguyen Minh"),
    new UserModel(3, "tranthao", "Tran Thao"),
];

// Mock data for ProductModel
const mockProducts = [
    new ProductModel(1, "Cơm cháy (Cơm sấy) Mình Châu siêu ngon 25g", undefined),
    new ProductModel(2, "Tập hoa ngọc toàn xin", undefined),
    new ProductModel(3, "Chuột không dây HXSJ T21 USB 2.4G Văn phòng", undefined),
    new ProductModel(4, "GLYCOL Therapy 110ml", undefined),
    new ProductModel(5, "Bánh mì sandwich nguyên cám", undefined),
];

// Mock data for ReviewModel
export const mockReviews: ReviewModel[] = [
    new ReviewModel(
        1,
        mockUsers[0],
        mockProducts[0],
        5,
        "Cơm cháy ngon, giòn, đúng chuẩn Mình Châu!"
    ),
    new ReviewModel(
        2,
        mockUsers[0],
        mockProducts[1],
        4,
        "Tập hoa ngọc toàn xin, đẹp nhưng hơi mỏng."
    ),
    new ReviewModel(
        3,
        mockUsers[0],
        mockProducts[2],
        5,
        "Chuột dùng rất mượt, giá cả hợp lý."
    ),
    new ReviewModel(
        4,
        mockUsers[1],
        mockProducts[3],
        0,
        "a" // Chưa đánh giá
    ),
    new ReviewModel(
        5,
        mockUsers[2],
        mockProducts[4],
        0,
        "s" // Chưa đánh giá
    ),
];
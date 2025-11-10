import { OrderStatus } from "@/src/common/resource/order_status";
import { OrderItemModel, OrderModel, OrderShopModel } from "../model/order.model";

export const mockOrders: OrderModel[] = [
    new OrderModel(
        1,
        undefined,
        { full_address: '123 Nguyễn Huệ, Quận 1, TP.HCM' } as any,
        [
            new OrderShopModel(
                1,
                { name: 'Tech Store' } as any,
                [
                    new OrderItemModel(1, { name: 'Tai nghe không dây', price: 599000, image: 'https://via.placeholder.com/50' } as any, 2),
                    new OrderItemModel(2, { name: 'Ốp lưng điện thoại', price: 99000, image: 'https://via.placeholder.com/50' } as any, 1),
                ],
                undefined,
                697000,
                50000,
                647000
            ),
        ],
        647000,
        OrderStatus.PENDING,
        new Date('2025-05-01T10:00:00'),
        new Date('2025-05-01T10:00:00'),
        new Date('2025-05-01T09:30:00')
    ),
    new OrderModel(
        2,
        undefined,
        { full_address: '456 Lê Lợi, Quận 5, TP.HCM' } as any,
        [
            new OrderShopModel(
                2,
                { name: 'Fashion Hub' } as any,
                [
                    new OrderItemModel(3, { name: 'Váy mùa hè', price: 299000, image: 'https://via.placeholder.com/50' } as any, 1),
                ],
                undefined,
                299000,
                0,
                299000
            ),
        ],
        299000,
        OrderStatus.PAID,
        new Date('2025-04-30T15:00:00'),
        new Date('2025-04-30T15:00:00'),
        new Date('2025-04-30T14:45:00')
    ),
    new OrderModel(
        3,
        undefined,
        { full_address: '789 Hai Bà Trưng, Quận 3, TP.HCM' } as any,
        [
            new OrderShopModel(
                3,
                { name: 'Grocery Shop' } as any,
                [
                    new OrderItemModel(4, { name: 'Gạo 5kg', price: 150000, image: 'https://via.placeholder.com/50' } as any, 1),
                ],
                undefined,
                150000,
                0,
                150000
            ),
        ],
        150000,
        OrderStatus.CANCELED,
        new Date('2025-05-02T09:00:00'),
        undefined,
        new Date('2025-05-02T08:30:00')
    ),
];
import * as OrderService from "@/src/data/service/order.service";
import { OrderModel } from "../model/order.model";

export const fetchListOrderUser = async () => {
    try {
        const result = await OrderService.fetchListOrderUser();
        const response: OrderModel[] = result?.orders?.map(
            (order: any) => new OrderModel().convertObj(order)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}

export const cancelOrderUser = async (order_id: number) => {
    try {
        await OrderService.cancelOrderUser(order_id);
        return true;
    } catch (error) {
        throw error;
    }
}
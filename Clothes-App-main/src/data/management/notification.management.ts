import * as NotificationService from "@/src/data/service/notification.service";
import { NotificationModel } from "../model/notification.model";
import { PaginateModel } from "@/src/common/model/paginate.model";
import { OrderModel } from "../model/order.model";

export const fetchNotificationByUser = async (page: number, limit: number): Promise<Map<string, any>> => {
    try {
        const result = await NotificationService.fetchNotificationByUser(page, limit);
        const response = new Map<string, any>([]);
        const notifications: NotificationModel[] = result?.notifications?.map(
            (notification: any) => new NotificationModel().convertObj(notification)
        ) ?? [];
        const pagination = new PaginateModel().convertObj(result?.pagination);
        response.set('notifications', notifications);
        response.set('pagination', pagination);
        response.set('unreadCount', result?.unreadCount);
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchUnreadNotificationCount = async (): Promise<number> => {
    try {
        const result = await NotificationService.fetchUnreadNotificationCount();
        return result?.unreadCount ?? 0;
    } catch (error) {
        throw error;
    }
}

export const markNotificationAsRead = async (notification_id: number) => {
    try {
        await NotificationService.markNotificationAsRead(notification_id);
        return true;
    } catch (error) {
        throw error;
    }
}

export const fetchOrderDetails = async (order_id: number) => {
    try {
        const result = await NotificationService.fetchOrderDetails(order_id);
        const response: OrderModel = new OrderModel().convertObj(result?.orders[0]);
        return response;
    } catch (error) {
        throw error;
    }
}
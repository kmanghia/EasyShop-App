import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchNotificationByUser = async (page: number, limit: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `notification?page=${page}&limit=${limit}`
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchUnreadNotificationCount = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `notification/unread-count`
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const markNotificationAsRead = async (notification_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const response = await ServiceCore.PATCH(
            `${domain}`,
            `notification/user/${userInfo.id}/${notification_id}/read`,
            {}
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchOrderDetails = async (order_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const response = await ServiceCore.GET(
            `${domain}`,
            `order/user/${userInfo.id}/${order_id}/read`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}


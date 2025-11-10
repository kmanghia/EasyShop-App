import { NotificationModel } from "@/src/data/model/notification.model";
import { ActionState } from "../../action.state";
import { PaginateModel } from "@/src/common/model/paginate.model";

export enum NotificationActions {
    SAVE_NOTIFICATIONS = '@Notification/SaveNotifications',
    CHANGE_IS_LOADED_STATE = '@Notification/ChangeIsLoadedState',
    ADD_NOTIFICATION = '@Notification/AddNotification',
    SAVE_PAGINATION = '@Notification/SavePagination',
    SAVE_UNREAD_COUNT = '@Notification/SaveUnreadCount',
    MARK_NOTIFICATION_AS_READ = '@Notification/MarkNotificationAsRead',
    RESET_STATE = '@Notification/ResetState',
}

export const SaveNotifications = (
    data: NotificationModel[],
    pagination: PaginateModel,
    unreadCount: number
) => ({
    type: NotificationActions.SAVE_NOTIFICATIONS,
    data: {
        notifications: data,
        pagination: pagination,
        unreadCount: unreadCount
    }
} as ActionState)

export const ChangeIsLoadedState = (isLoaded: boolean) => ({
    type: NotificationActions.CHANGE_IS_LOADED_STATE,
    data: { isLoaded: isLoaded }
} as ActionState)

export const AddNotification = (notification: NotificationModel) => ({
    type: NotificationActions.ADD_NOTIFICATION,
    data: { notification: notification }
} as ActionState)

export const SavePagination = (pagination: PaginateModel) => ({
    type: NotificationActions.SAVE_PAGINATION,
    data: { pagination: pagination }
} as ActionState)

export const SaveUnreadCount = (unreadCount: number) => ({
    type: NotificationActions.SAVE_UNREAD_COUNT,
    data: { unreadCount: unreadCount }
} as ActionState)

export const MarkNotificationAsRead = (notification_id: number) => ({
    type: NotificationActions.MARK_NOTIFICATION_AS_READ,
    data: { notification_id: notification_id }
} as ActionState)

export const ResetState = () => ({
    type: NotificationActions.RESET_STATE,
} as ActionState)
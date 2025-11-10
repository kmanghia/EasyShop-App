export class NotificationModel {
    id: number;
    user_id: number;
    roles: string;
    type: string;
    reference_id: number;
    reference_type: string;
    data: any;
    action: string;
    is_read: boolean;
    created_at: Date | null;

    constructor(
        id?: number,
        user_id?: number,
        roles?: string,
        type?: string,
        reference_id?: number,
        reference_type?: string,
        data?: any,
        action?: string,
        is_read?: boolean,
        created_at?: Date,
    ) {
        this.id = id ?? 0;
        this.user_id = user_id ?? 0;
        this.roles = roles ?? '';
        this.type = type ?? '';
        this.reference_id = reference_id ?? -1;
        this.reference_type = reference_type ?? '';
        this.data = data ?? {};
        this.action = action ?? '';
        this.is_read = is_read ?? false;
        this.created_at = created_at ? new Date(created_at) : null;
    }

    convertObj(data: any) {
        const obj = new NotificationModel();
        obj.id = data?.id ?? 0;
        obj.user_id = data?.user_id ?? 0;
        obj.roles = data?.roles ?? '';
        obj.type = data?.type ?? '';
        obj.reference_id = data?.reference_id ?? -1;
        obj.reference_type = data?.reference_type ?? '';
        obj.data = data?.data ?? {};
        obj.action = data?.action ?? '';
        obj.is_read = data?.is_read ?? false;
        obj.created_at = data?.created_at ? new Date(data?.created_at) : null;

        return obj;
    }
}
import { DiscountTypes } from "@/src/common/resource/discount_type";
import { ShopModel } from "./shop.model";
import moment from "moment";

export class CouponModel {
    id: number;
    shop: ShopModel | undefined;
    name: string;
    code: string;
    discount_type: string;
    discount_value: number;
    max_discount: number;
    min_order_value: number;
    times_used: number;
    max_usage: number;
    valid_from: Date | null;
    valid_to: Date | null;
    is_used: boolean;
    is_saved: boolean;

    constructor(
        id?: number,
        shop?: ShopModel,
        name?: string,
        code?: string,
        discount_type?: string,
        discount_value?: number,
        max_discount?: number,
        min_order_value?: number,
        times_used?: number,
        max_usage?: number,
        valid_from?: Date | null,
        valid_to?: Date | null,
        is_used?: boolean,
        is_saved?: boolean,
    ) {
        this.id = id ?? 0;
        this.shop = shop ?? undefined;
        this.name = name ?? "";
        this.code = code ?? "";
        this.discount_type = discount_type ?? DiscountTypes.PERCENTAGE;
        this.discount_value = discount_value ?? 0;
        this.max_discount = max_discount ?? 0;
        this.min_order_value = min_order_value ?? 0;
        this.times_used = times_used ?? 0;
        this.max_usage = max_usage ?? 0;
        this.valid_from = valid_from ? new Date(valid_from) : null;
        this.valid_to = valid_to ? new Date(valid_to) : null;
        this.is_used = is_used ?? false;
        this.is_saved = is_saved ?? false;
    }

    convertObj(data: any) {
        const model = new CouponModel();
        model.id = data?.id ?? 0;
        model.shop = data?.shop ? new ShopModel().convertObj(data?.shop) : undefined;
        model.name = data?.name ?? "";
        model.code = data?.code ?? "";
        model.discount_type = data?.discount_type ?? DiscountTypes.PERCENTAGE;
        model.discount_value = data?.discount_value ?? 0;
        model.max_discount = data?.max_discount ?? 0;
        model.min_order_value = data?.min_order_value ?? 0;
        model.times_used = data?.times_used ?? 0;
        model.max_usage = data?.max_usage ?? -1;
        model.valid_from = data?.valid_from ? new Date(data.valid_from) : null;
        model.valid_to = data?.valid_to ? new Date(data.valid_to) : null;
        model.is_used = data?.is_used ?? false;
        model.is_saved = data?.is_saved ?? false;

        return model;
    }

    isValid(): boolean {
        const now = new Date();
        return this.valid_from && this.valid_to
            ? now >= this.valid_from && now <= this.valid_to
            : false;
    }

    getFormattedValidFrom(format: string = 'DD/MM/YYYY'): string {
        return this.valid_from ? moment(this.valid_from).format(format) : '';
    }

    getFormattedValidTo(format: string = 'DD/MM/YYYY'): string {
        return this.valid_to ? moment(this.valid_to).format(format) : '';
    }

    getUsageStatus(): string {
        if (this.max_usage === -1) {
            return 'Không giới hạn';
        }

        return `Đã dùng ${this.times_used}/${this.max_usage} lần`;
    }

    hasUnlimitedUsage(): boolean {
        return this.max_usage === -1;
    }

    canBeUsed(): boolean {
        return this.hasUnlimitedUsage() || this.times_used < this.max_usage;
    }
}
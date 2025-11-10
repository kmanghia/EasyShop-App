import { ProductModel } from "./product.model";

export class ProductVariantModel {
    id: number;
    product: ProductModel | undefined;
    color: ColorModel | undefined;
    size: SizeModel | undefined;
    image_url: string;
    sku: string;
    stock_quantity: number;

    constructor(
        id?: number,
        product?: ProductModel,
        color?: ColorModel,
        size?: SizeModel,
        image_url?: string,
        sku?: string,
        stock_quantity?: number
    ) {
        this.id = id ?? 0;
        this.product = product ?? undefined;
        this.color = color ?? undefined;
        this.size = size ?? undefined;
        this.image_url = image_url ?? '';
        this.sku = sku ?? '';
        this.stock_quantity = stock_quantity ?? 0;
    }

    convertObj(data: any) {
        const obj = new ProductVariantModel();
        obj.id = data?.id ?? 0;
        obj.product = data?.product ? new ProductModel().convertObj(data?.product) : undefined;
        obj.color = data?.color ? new ColorModel().convertObj(data?.color) : undefined;
        obj.size = data?.size ? new SizeModel().convertObj(data?.size) : undefined;
        obj.image_url = data?.image_url ?? '';
        obj.sku = data?.sku ?? '';
        obj.stock_quantity = data?.stock_quantity ?? 0;

        return obj;
    }
}

export class ColorModel {
    id: number;
    color_name: string;

    constructor(
        id?: number,
        color_name?: string
    ) {
        this.id = id ?? 0;
        this.color_name = color_name ?? '';
    }

    convertObj(data: any) {
        const obj = new ColorModel();
        obj.id = data?.id ?? 0;
        obj.color_name = data?.color_name ?? '';

        return obj;
    }
}

export class SizeModel {
    id: number;
    size_code: string;

    constructor(
        id?: number,
        size_code?: string
    ) {
        this.id = id ?? 0;
        this.size_code = size_code ?? '';
    }

    convertObj(data: any) {
        const obj = new SizeModel();
        obj.id = data?.id ?? 0;
        obj.size_code = data?.size_code ?? '';

        return obj;
    }
}
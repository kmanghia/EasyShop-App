import { UserModel } from "./user.model";

export class AddressModel {
    id: number;
    user: UserModel | undefined;
    name: string;
    phone: string;
    city: CityModel | undefined;
    district: DistrictModel | undefined;
    ward: WardModel | undefined;
    address_detail: string;
    is_default: boolean;
    created_at: Date | undefined;

    constructor(
        id?: number,
        user?: UserModel | undefined,
        name?: string,
        phone?: string,
        city?: CityModel,
        district?: DistrictModel,
        ward?: WardModel,
        address_detail?: string,
        is_default?: boolean,
        created_at?: Date
    ) {
        this.id = id ?? 0;
        this.user = user ?? undefined;
        this.name = name ?? '';
        this.phone = phone ?? '';
        this.city = city ?? undefined;
        this.district = district ?? undefined;
        this.ward = ward ?? undefined;
        this.address_detail = address_detail ?? "";
        this.is_default = is_default ?? false;
        this.created_at = created_at ?? undefined;
    }

    convertObj(data: any) {
        const model = new AddressModel();
        model.id = data?.id ?? 0;
        model.user = data?.user ? new UserModel().convertObj(data.user) : undefined;
        model.name = data?.name ?? '';
        model.phone = data?.phone ?? '';
        model.city = data?.city ? new CityModel().convertObj(data.city) : undefined;
        model.district = data?.district ? new DistrictModel().convertObj(data.district) : undefined;
        model.ward = data?.ward ? new WardModel().convertObj(data.ward) : undefined;
        model.address_detail = data?.address_detail ?? "";
        model.is_default = data?.is_default ?? false;
        model.created_at = data?.createdAt ? new Date(data.createdAt) : undefined;

        return model;
    }

    convertToExecute(data: AddressModel) {
        return {
            name: data.name,
            phone: data.phone,
            city_id: data.city?.id,
            district_id: data.district?.id,
            ward_id: data.ward?.id,
            address_detail: data.address_detail,
            is_default: data.is_default
        }
    }
}

export class CityModel {
    id: number;
    name: string;

    constructor(
        id?: number,
        name?: string,
    ) {
        this.id = id ?? 0;
        this.name = name ?? "";
    }

    convertObj(data: any) {
        const model = new CityModel();
        model.id = data?.id ?? 0;
        model.name = data?.name ?? "";

        return model
    }
}

export class DistrictModel {
    id: number;
    name: string;
    city: CityModel | undefined;

    constructor(
        id?: number,
        name?: string,
        city?: CityModel
    ) {
        this.id = id ?? 0;
        this.name = name ?? "";
        this.city = city ?? undefined;
    }

    convertObj(data: any) {
        const model = new DistrictModel();
        model.id = data?.id ?? 0;
        model.name = data?.name ?? "";
        model.city = data?.city ? new CityModel().convertObj(data.city) : undefined;

        return model;
    }
}

export class WardModel {
    id: number;
    name: string;
    district: DistrictModel | undefined;

    constructor(
        id?: number,
        name?: string,
        district?: DistrictModel
    ) {
        this.id = id ?? 0;
        this.name = name ?? "";
        this.district = district ?? undefined;
    }

    convertObj(data: any) {
        const model = new WardModel();
        model.id = data?.id ?? 0;
        model.name = data?.name ?? "";
        model.district = data?.district ? new DistrictModel().convertObj(data.district) : undefined;

        return model;
    }
}
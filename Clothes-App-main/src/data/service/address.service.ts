import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";
import { AddressModel } from "../model/address.model";

export const fetchCities = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = ServiceCore.GET(
            `${domain}`,
            `address/cities`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchDistrictsByCityId = async (city_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = ServiceCore.GET(
            `${domain}`,
            `address/districts/${city_id}`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchWardsByDistrictId = async (district_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = ServiceCore.GET(
            `${domain}`,
            `address/wards/${district_id}`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchAddressesByUser = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = ServiceCore.GET(
            `${domain}`,
            `address`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchAddressById = async (address_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `address/details/${address_id}`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}
export const fetchDefaultAddress = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `address/default`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const addAddressByUser = async (data: AddressModel) => {
    try {
        const domain = new AppConfig().getDomain();
        const newAddress = new AddressModel().convertToExecute(data);
        const response = await ServiceCore.POST(
            `${domain}`,
            `address`,
            newAddress
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const editAddressByUser = async (data: AddressModel) => {
    try {
        const domain = new AppConfig().getDomain();
        const editAddress = new AddressModel().convertToExecute(data);
        const response = await ServiceCore.PUT(
            `${domain}`,
            `address/${data.id}`,
            editAddress
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteAddressById = async (address_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.DELETE(
            `${domain}`,
            `address/${address_id}`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const setAddressAsDefault = async (address_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.PATCH(
            `${domain}`,
            `address/${address_id}`,
            {}
        );

        return response;
    } catch (error) {
        throw error;
    }
}
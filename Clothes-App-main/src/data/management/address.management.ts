import * as AddressService from "@/src/data/service/address.service";
import { AddressModel, CityModel, DistrictModel, WardModel } from "../model/address.model";

export const fetchCities = async () => {
    try {
        const result = await AddressService.fetchCities();
        const response: CityModel[] = result?.cities?.map(
            (city: any) => new CityModel().convertObj(city)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchDistrictsByCityId = async (city_id: number) => {
    try {
        const result = await AddressService.fetchDistrictsByCityId(city_id);
        const response: DistrictModel[] = result?.districts?.map(
            (district: any) => new DistrictModel().convertObj(district)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchWardsByDistrictId = async (district_id: number) => {
    try {
        const result = await AddressService.fetchWardsByDistrictId(district_id);
        const response: WardModel[] = result?.wards?.map(
            (ward: any) => new WardModel().convertObj(ward)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchAddressesByUser = async () => {
    try {
        const result = await AddressService.fetchAddressesByUser();
        const response: AddressModel[] = result?.addresses?.map(
            (address: any) => new AddressModel().convertObj(address)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchAddressById = async (address_id: number) => {
    try {
        const result = await AddressService.fetchAddressById(address_id);
        const response: AddressModel[] = result?.addresses?.map(
            (address: any) => new AddressModel().convertObj(address)
        ) ?? [];
        return response[0];
    } catch (error) {
        throw error;
    }
}

export const fetchDefaultAddress = async () => {
    try {
        const result = await AddressService.fetchDefaultAddress();
        const response: AddressModel[] = result?.addresses?.map(
            (address: any) => new AddressModel().convertObj(address)
        ) ?? [];

        if (response.length === 0) {
            return undefined;
        }

        return response[0];
    } catch (error) {
        throw error;
    }
}

export const addAddressByUser = async (data: AddressModel) => {
    try {
        await AddressService.addAddressByUser(data);
        return true;
    } catch (error) {
        throw error;
    }
}

export const editAddressByUser = async (data: AddressModel) => {
    try {
        await AddressService.editAddressByUser(data);
        return true;
    } catch (error) {
        throw error;
    }
}

export const deleteAddressById = async (address_id: number) => {
    try {
        await AddressService.deleteAddressById(address_id);
        return true;
    } catch (error) {
        throw error;
    }
}

export const setAddressAsDefault = async (address_id: number) => {
    try {
        await AddressService.setAddressAsDefault(address_id);
        return true;
    } catch (error) {
        throw error;
    }
}
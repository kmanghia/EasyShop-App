import { AuthModel } from "../model/auth.model";
import { ShopModel } from "../model/shop.model";
import { UserModel } from "../model/user.model";
import * as AuthService from "../service/auth.service";

export const signIn = async (data: AuthModel) => {
    try {
        const result = await AuthService.signIn(data);
        return result;
    } catch (error) {
        throw error;
    }
}

export const signUp = async (user: UserModel, auth: AuthModel, file: any) => {
    try {
        const result = await AuthService.signUp(user, auth, file);
        return result;
    } catch (error) {
        throw error;
    }
}

export const registerShop = async (user: UserModel, shop: ShopModel, logoFile: any, backgroundFile: any) => {
    try {
        await AuthService.registerShop(user, shop, logoFile, backgroundFile);
        return true;
    } catch (error) {
        throw error;
    }
}

export const changePassword = async (payload: any): Promise<any> => {
    try {
        await AuthService.changePassword(payload);
        return true;
    } catch (error) {
        throw error;
    }
}
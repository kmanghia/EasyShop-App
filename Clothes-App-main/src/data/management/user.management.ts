import * as UserService from "@/src/data/service/user.service";
import { UserModel } from "../model/user.model";

export const fetchInfoUser = async () => {
    try {
        const result = await UserService.fetchInfoUser();
        const response: UserModel = new UserModel().convertObj(result?.users[0]);
        return response;
    } catch (error) {
        throw error;
    }
}

export const editInfoUser = async (data: UserModel) => {
    try {
        await UserService.editInfoUser(data);
        return true;
    } catch (error) {
        throw error;
    }
}

export const editAvatarUser = async (file: any) => {
    try {
        const result = await UserService.editAvatarUser(file);
        const response = result?.url ?? '';
        return response;
    } catch (error) {
        throw error;
    }
}
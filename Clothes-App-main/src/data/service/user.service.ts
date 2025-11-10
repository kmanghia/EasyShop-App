import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";
import { UserModel } from "../model/user.model";

export const fetchInfoUser = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `user/info/mobile`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const editInfoUser = async (data: UserModel) => {
    try {
        const domain = new AppConfig().getDomain();
        const payload = new UserModel().toJsonExecute(data);
        const response = await ServiceCore.PATCH(
            `${domain}`,
            `user/info/mobile`,
            payload
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const editAvatarUser = async (file: any) => {
    try {
        const domain = new AppConfig().getDomain();
        const formData = new FormData();
        formData.append('userFile', file);
        const response = await ServiceCore.POST(
            `${domain}`,
            `user/avatar/mobile`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        return response;
    } catch (error) {
        throw error;
    }
}
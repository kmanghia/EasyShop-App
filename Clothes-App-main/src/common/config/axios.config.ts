import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { AppConfig } from "./app.config";
import { HandleHttp } from "../utils/handle-http";
import { HttpCode } from "../resource/http-code";

const appConfig = new AppConfig();

const CustomAxios = axios.create();

CustomAxios.interceptors.request.use(
    async (config) => {
        const accessToken = await appConfig.getAccessToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config;
    },
    (error: AxiosError) => {
        console.error(">>> Lỗi khi gửi request:", error);
        return Promise.reject(error);
    }
);

CustomAxios.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === HttpCode.UNAUTHORIZED && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await new AppConfig().getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                const domain = new AppConfig().getDomain();
                const response = await axios.post(`${domain}/auth/refresh/mobile`, {
                    ['refresh-token']: refreshToken
                });
                console.log('Chạy Refresh token...');
                const { access_token: newAccessToken } = response.data;
                if (newAccessToken) {
                    console.log(newAccessToken);
                    await new AppConfig().setAccessToken(newAccessToken);
                }

                if (originalRequest) {
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return CustomAxios(originalRequest);
                }
                throw new Error('Original request is undefined');
            } catch (error) {
                console.log('>>> Refresh token failed', error);
                const userInfo = await new AppConfig().getUserInfo();
                if (userInfo) {
                    userInfo.expires = false;
                    await new AppConfig().setUserInfo(userInfo);
                }
                return Promise.reject({
                    message: 'Session expired, please log in again',
                    status: HttpCode.UNAUTHORIZED
                })
            }
        }
        return Promise.reject(error.response?.data);
    }
)

export default CustomAxios;
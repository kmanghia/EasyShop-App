import { ErrorModel } from "../model/error.model";

export class HandleHttp {

    static success(response: any) {
        return response?.body;
    }

    static exception(result: any) {
        let error = new ErrorModel(
            result?.status,
            result?.message,
            result?.body
        );
        return error;
    }
}
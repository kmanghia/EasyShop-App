import { UserModel } from "./user.model";

export class AuthModel {
    email: string;
    password: string;

    constructor(
        email?: string,
        password?: string
    ) {
        this.email = email ?? '';
        this.password = password ?? '';
    }

    convertModelToExecute(data: AuthModel) {
        return {
            email: data.email,
            password: data.password
        }
    }

    convertRegisterObj(user: UserModel, auth: AuthModel) {
        return {
            name: user.name,
            gender: user.gender,
            phone: user.phone,
            address: user.address,
            email: auth.email,
            password: auth.password
        }
    }
}
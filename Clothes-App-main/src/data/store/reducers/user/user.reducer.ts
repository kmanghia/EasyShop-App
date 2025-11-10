import { Roles } from "@/src/common/resource/roles";
import { ActionState } from "../../action.state";
import { UserActions } from "../../actions/user/user.action";

export interface UserStoreState {
    id: number;
    name: string;
    image_url: string;
    roles: string;
    cart_id: number;
    favorites: number[],
    isLogged: boolean;
    expires: boolean;
}

const initialState: UserStoreState = {
    id: -1,
    name: '',
    image_url: '',
    cart_id: -1,
    roles: Roles.CUSTOMER,
    favorites: [],
    isLogged: false,
    expires: false
}

export const UserReducer = (state = initialState, actions: ActionState) => {
    switch (actions.type) {
        case UserActions.SAVE_INFO_LOGGED:
            return {
                ...state,
                ...actions.data,
                isLogged: true,
            } as UserStoreState
        case UserActions.RESET_INFO_LOGGED:
            return {
                ...initialState,
            } as UserStoreState
        case UserActions.UPDATE_INFO_LOGGED:
            return {
                ...state,
                ...actions.data
            } as UserStoreState
        case UserActions.UPDATE_IMAGE_INFO:
            return {
                ...state,
                image_url: actions.data
            } as UserStoreState
        case UserActions.UPDATE_EXPIRES_LOGGED:
            return {
                ...state,
                expires: actions.data ?? false
            } as UserStoreState
        case UserActions.UPDATE_LOGGED_STATUS:
            return {
                ...state,
                isLogged: actions.data ?? false
            } as UserStoreState
        case UserActions.SAVE_FAVORITES:
            return {
                ...state,
                favorites: actions.data
            } as UserStoreState
        case UserActions.ADD_FAVORITE:
            {
                let currFavorites = [...state.favorites];
                currFavorites.push(actions.data);
                return {
                    ...state,
                    favorites: currFavorites
                } as UserStoreState
            }
        case UserActions.REMOVE_FAVORITE:
            {
                let currFavorites = [...state.favorites];
                currFavorites = currFavorites.filter(favorite => favorite !== actions.data);
                return {
                    ...state,
                    favorites: currFavorites
                } as UserStoreState
            }
        default:
            return state;
    }
}

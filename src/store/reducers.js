import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';

const initialState = {
    loading: false,
    user: null,
    error: null,
    userInfo: null
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_REQUEST":
            return {
                ...state,
                loading: true,
            };

        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.response,
                loading: false,
            };

        case "LOGGED_IN_USER":
            return {
                ...state,
                userInfo: action.response,
                loading: false,
            };
        case "LOGIN_FAILURE":
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        case "LOGOUT_REQUEST":
            return {
                ...state,
                user: null,
                userInfo: null,
                error: null,
                loading: false,
            };
        default:
            return state;
    }
}

const ForgotPasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FORGOT_PASS_OTP_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "FORGOT_PASS_OTP_SUCCESS":
            return {
                ...state,
                user: action.response,
                loading: false,
            };
        case "FORGOT_PASS_OTP_FAILURE":
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        case "VERIFY_OTP_REQUEST":
            return {
                ...state,
                loading: true,
                verifyOtp: null,
            };
        case "VERIFY_OTP_SUCCESS":
            return {
                ...state,
                verifyOtp: action.response,
                loading: false,
            };
        case "VERIFY_OTP_FAILURE":
            return {
                ...state,
                error: action.error,
                verifyOtp: null,
                loading: false,
            };
        case "RESET_PASSWORD_REQUEST":
            return {
                ...state,
                loading: true,
                passwordUpdated: null
            };
        case "RESET_PASSWORD_SUCCESS":
            return {
                ...state,
                passwordUpdated: action.response,
                loading: false,
            };
        case "RESET_PASSWORD_FAILURE":
            return {
                ...state,
                error: action.error,
                passwordUpdated: null,
                loading: false,
            };
        case "SET_PASSWORD_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "SET_PASSWORD_SUCCESS":
            return {
                ...state,
                user: action.response,
                loading: false,
            };

        case "SET_PASSWORD_FAILURE":
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        default:
            return state;
    }
}

const UserProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_PASSWORD_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "SET_PASSWORD_SUCCESS":
            return {
                ...state,
                authToken: action.response,
                loading: false,
            };
        case "SET_PASSWORD_FAILURE":
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        default:
            return state;
    }
}

export const combinedReducers = combineReducers({
    form: formReducer,
    Auth: AuthReducer,
    ForgotPassword: ForgotPasswordReducer,
    UserProfile: UserProfileReducer
})
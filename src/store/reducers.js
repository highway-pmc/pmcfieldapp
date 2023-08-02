import { Alert } from "react-native";
import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';

const initialState = {
    loading : false,
    user : null,
    error : null
}

const AuthReducer = (state=initialState,action) => {
    switch(action.type) {
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
                error: null,
                loading: false,
            };
        case "FORGOT_PASS_REQUEST_REQUEST":
            return {
                ...state,
                loading: true,
            };

        case "FORGOT_PASS_REQUEST_SUCCESS":
            return {
                ...state,
                user: action.response,
                loading: false,
            };

        case "FORGOT_PASS_REQUEST_FAILURE":
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
    form : formReducer,
    Auth : AuthReducer
})
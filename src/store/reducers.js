import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';

const initialState = {
    loading: false,
    user: null,
    error: null,
    userInfo: null
}

const userProfileState = {
    loading: false,
    userProfileInfo: null,
    error: null,
}

const userAssignmentState = {
    loading: false,
    users: null,
    error: null,
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
                user: null,
                error: null,
                loading: true,
            };
        case "FORGOT_PASS_OTP_SUCCESS":
            return {
                ...state,
                user: action.response,
                error: null,
                loading: false,
            };
        case "FORGOT_PASS_OTP_FAILURE":
            return {
                ...state,
                user: null,
                error: action.error,
                loading: false,
            };
        case "VERIFY_OTP_REQUEST":
            return {
                ...state,
                user: null,
                loading: true,
                verifyOtp: null,
                error: null,
            };
        case "VERIFY_OTP_SUCCESS":
            return {
                ...state,
                verifyOtp: action.response,
                user: null,
                loading: false,
                error: null
            };
        case "VERIFY_OTP_FAILURE":
            return {
                ...state,
                error: action.error,
                verifyOtp: null,
                user: null,
                loading: false,
            };
        case "RESET_PASSWORD_REQUEST":
            return {
                ...state,
                loading: true,
                error: null,
                passwordUpdated: null
            };
        case "RESET_PASSWORD_SUCCESS":
            return {
                ...state,
                error: null,
                passwordUpdated: action.response,
                user: null,
                loading: false,
            };
        case "RESET_PASSWORD_FAILURE":
            return {
                ...state,
                error: action.error,
                passwordUpdated: null,
                user: null,
                loading: false,
            };
        default:
            return state;
    }
}

const UserProfileReducer = (state = userProfileState, action) => {
    switch (action.type) {
        case "SET_PASSWORD_REQUEST":
            return {
                ...state,
                authToken: null,
                error: null,
                loading: true,
            };
        case "SET_PASSWORD_SUCCESS":
            return {
                ...state,
                authToken: action.response,
                error: null,
                loading: false,
            };
        case "SET_PASSWORD_FAILURE":
            return {
                ...state,
                authToken: null,
                error: action.error,
                loading: false,
            };
        case "GET_USER_PROFILE_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "GET_USER_PROFILE_SUCCESS":
            return {
                ...state,
                userProfileInfo: action.response,
                error: null,
                loading: false,
            };
        case "GET_USER_PROFILE_FAILURE":
            return {
                ...state,
                userProfile: null,
                error: action.error,
                loading: false,
            };
        case "UPDATE_USER_PROFILE_REQUEST":
            return {
                ...state,
                error: null,
                userProfileUpdated: false,
                loading: true,
            };
        case "UPDATE_USER_PROFILE_SUCCESS":
            return {
                ...state,
                userProfileUpdated: action.response,
                error: null,
                loading: false,
            };
        case "UPDATE_USER_PROFILE_FAILURE":
            return {
                ...state,
                userProfileUpdated: action.response,
                error: action.error,
                loading: false,
            };
        case "GET_STATE_CITY_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "GET_STATE_CITY_SUCCESS":
            return {
                ...state,
                states: action.response,
                error: null,
                loading: false,
            };
        case "GET_STATE_CITY_FAILURE":
            return {
                ...state,
                states: null,
                error: action.error,
                loading: false,
            };
        default:
            return state;
    }
}

const UserAssignmentReducer = (state = userAssignmentState, action) => {
    switch (action.type) {
        case "GET_USER_CATEGORY_REQUEST":
            return {
                ...state,
                users: null,
                usersAdded: null,
                categories: null,
                error: null,
                loading: true,
            };
        case "GET_USER_CATEGORY_SUCCESS":
            return {
                ...state,
                usersAdded: null,
                users: null,
                categories: action.response,
                error: null,
                loading: false,
            };
        case "GET_USER_CATEGORY_FAILURE":
            return {
                ...state,
                users: null,
                usersAdded: null,
                categories: null,
                error: action.error,
                loading: false,
            };
        case "GET_USER_ASSIGNMENT_REQUEST":
            return {
                ...state,
                users: null,
                usersAdded: null,
                error: null,
                loading: true,
            };
        case "GET_USER_ASSIGNMENT_SUCCESS":
            return {
                ...state,
                usersAdded: null,
                users: action.response,
                error: null,
                loading: false,
            };
        case "GET_USER_ASSIGNMENT_FAILURE":
            return {
                ...state,
                users: null,
                usersAdded: null,
                error: action.error,
                loading: false,
            };
        case "ADD_USER_ASSIGNMENT_REQUEST":
            return {
                ...state,
                usersAdded: null,
                users: null,
                error: null,
                loading: true,
            };
        case "ADD_USER_ASSIGNMENT_SUCCESS":
            return {
                ...state,
                usersAdded: action.response,
                users: null,
                error: null,
                loading: false,
            };
        case "ADD_USER_ASSIGNMENT_FAILURE":
            return {
                ...state,
                usersAdded: null,
                users: null,
                error: action.error,
                loading: false,
            };
            case "CLEAR_USER_ASSIGNMENT":
                return {
                    ...state,
                    usersAdded: null,
                    users: null,
                    error: null,
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
    UserProfile: UserProfileReducer,
    UserAssignment: UserAssignmentReducer
})
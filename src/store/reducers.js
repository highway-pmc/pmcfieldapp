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
    usersLoading: false,
}

const projectInfoState = {
    loading: false,
    projectInfo: null,
    error: null,
}

const workAssignmentState = {
    loading: false,
    projectModules: null,
    segments: null,
    subSegments: null,
    error: null,
    loadingUsers: false
}

const myWorksState = {
    loading: false,
    myWorks: null,
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
        case "CLEAR_FORGOT_PASSWORD_DATA":
            return {
                ...state,
                passwordUpdated: false,
                verifyOtp: null,
                user: null,
                error: null,
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
        case "CHANGE_PASSWORD_REQUEST":
            return {
                ...state,
                authToken: null,
                error: null,
                loading: true,
            };
        case "CHANGE_PASSWORD_SUCCESS":
            return {
                ...state,
                authToken: action.response,
                error: null,
                loading: false,
            };
        case "CHANGE_PASSWORD_FAILURE":
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
        case "CLEAR_USER_PROFILE_DATA":
            return {
                ...state,
                userProfileUpdated: false,
                userProfile: null,
                userProfileInfo: null,
                authToken: null,
                error: null,
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
                usersLoading: true,
            };
        case "GET_USER_ASSIGNMENT_SUCCESS":
            return {
                ...state,
                usersAdded: null,
                users: action.response,
                error: null,
                loading: false,
                usersLoading: false,
            };
        case "GET_USER_ASSIGNMENT_FAILURE":
            return {
                ...state,
                users: null,
                usersAdded: null,
                error: action.error,
                loading: false,
                usersLoading: false,
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

const ProjectInfoReducer = (state = projectInfoState, action) => {
    switch (action.type) {
        case "GET_PROJECT_INFO_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "GET_PROJECT_INFO_SUCCESS":
            return {
                ...state,
                projectInfo: action.response,
                error: null,
                loading: false,
            };
        case "GET_PROJECT_INFO_FAILURE":
            return {
                ...state,
                projectInfo: null,
                error: action.error,
                loading: false,
            };
        case "CLEAR_PROJECT_INFO":
            return {
                ...state,
                projectInfo: null,
                error: null,
                loading: false,
            };
        default:
            return state;
    }
}

const WorkAssignmentReducer = (state = workAssignmentState, action) => {
    switch (action.type) {
        case "GET_PROJECT_MODULES_REQUEST":
            return {
                ...state,
                projectModules: [],
                error: null,
                loading: true,
            };
        case "GET_PROJECT_MODULES_SUCCESS":
            return {
                ...state,
                projectModules: action.response,
                error: null,
                loading: false,
            };
        case "GET_PROJECT_MODULES_FAILURE":
            return {
                ...state,
                projectModules: null,
                error: action.error,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SEGMENTS_REQUEST":
            return {
                ...state,
                error: null,
                loadingSegment: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_SEGMENTS_SUCCESS":
            return {
                ...state,
                segments: action.response,
                error: null,
                loadingSegment: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SEGMENTS_FAILURE":
            return {
                ...state,
                segments: null,
                error: action.error,
                loading: false,
                loadingSegment: false
            };
        case "GET_PROJECT_MODULE_SUB_SEGMENTS_REQUEST":
            return {
                ...state,
                error: null,
                loadingSubSegment: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_SUB_SEGMENTS_SUCCESS":
            return {
                ...state,
                subSegments: action.response,
                error: null,
                loadingSubSegment: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SUB_SEGMENTS_FAILURE":
            return {
                ...state,
                subSegments: null,
                error: action.error,
                loadingSubSegment: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_TASKS_REQUEST":
            return {
                ...state,
                error: null,
                loadingTask: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_TASKS_SUCCESS":
            return {
                ...state,
                tasks: action.response,
                error: null,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_TASKS_FAILURE":
            return {
                ...state,
                tasks: null,
                error: action.error,
                loadingTask: false,
                loading: false,
            };
        case "GET_USERS_TO_WORK_ASSIGNMENT_REQUEST":
            return {
                ...state,
                users: [],
                error: null,
                loading: true,
                loadingUsers: true,
            };
        case "GET_USERS_TO_WORK_ASSIGNMENT_SUCCESS":
            return {
                ...state,
                users: action.response,
                error: null,
                loading: false,
                loadingUsers: false,
            };
        case "GET_USERS_TO_WORK_ASSIGNMENT_FAILURE":
            return {
                ...state,
                users: null,
                error: action.error,
                loading: false,
                loadingUsers: false,
            };
        case "PROJECT_MODULE_WORK_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "PROJECT_MODULE_WORK_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                projectModulesWorkAssigned: action.response,
                error: null,
                loading: false,
            };
        case "PROJECT_MODULE_WORK_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                projectModulesWorkAssigned: null,
                error: action.error,
                loading: false,
            };
        case "SEGMENT_WORK_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "SEGMENT_WORK_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                segmentWorkAssigned: action.response,
                error: null,
                loading: false,
            };
        case "SEGMENT_WORK_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                segmentWorkAssigned: null,
                error: action.error,
                loading: false,
            };
        case "SUB_SEGMENT_WORK_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "SUB_SEGMENT_WORK_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                subSegmentWorkAssigned: action.response,
                error: null,
                loading: false,
            };
        case "SUB_SEGMENT_WORK_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                subSegmentWorkAssigned: null,
                error: action.error,
                loading: false,
            };
        case "TASK_WORK_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "TASK_WORK_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                taskWorkAssigned: action.response,
                error: null,
                loading: false,
            };
        case "TASK_WORK_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                taskWorkAssigned: null,
                error: action.error,
                loading: false,
            };
        case "CLEAR_PROJECT_MODULE_WORK_ASSIGNMENT_USERS":
            return {
                ...state,
                projectModulesWorkAssigned: null,
                segmentWorkAssigned: null,
                subSegmentWorkAssigned: null,
                taskWorkAssigned: null,
                error: null,
                loading: false,
            };
        case "CLEAR_WORK_ASSIGMENT":
            return {
                ...state,
                projectModules: null,
                segments: null,
                subSegments: null,
                segmentWorkAssigned: null,
                subSegmentWorkAssigned: null,
                projectModulesWorkAssigned: null,
                taskWorkAssigned: null,
                users: null,
                error: null,
                loading: false,
                loadingSegment: false,
                loadingSubSegment: false,
                loadingTask: false,
            };
        default:
            return state;
    }
}

const MyWorkReducer = (state = myWorksState, action) => {
    switch (action.type) {
        case "GET_MY_WORKS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "GET_MY_WORKS_SUCCESS":
            return {
                ...state,
                myWorks: action.response,
                error: null,
                loading: false,
            };
        case "GET_MY_WORKS_FAILURE":
            return {
                ...state,
                myWorks: null,
                error: action.error,
                loading: false,
            };
        case "CLEAR_MY_WORKS":
            return {
                ...state,
                myWorks: null,
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
    UserAssignment: UserAssignmentReducer,
    ProjectInfo: ProjectInfoReducer,
    WorkAssignment: WorkAssignmentReducer,
    MyWorks: MyWorkReducer,
})
import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';
import { PROCUREMENTS, SOURCE_APPROVALS } from "../screens/ManageUsers/QualityWorks/constants";

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
    components: null,
    error: null,
    loadingUsers: false
}

const testAssignmentState = {
    loading: false,
    testClassifications: null,
    testWorkCategory: null,
    testMaterials: null,
    testTypes: null,
    error: null,
    loadingUsers: false
}

const myWorksState = {
    loading: false,
    myWorks: null,
    error: null,
}

const dashboardState = {
    loading: false,
    fcmToken: null,
    error: null,
}

const sourceApprovalsState = {
    loading: false,
    sourceApprovals: null,
    sourceApprovalsByStatus: null,
    addedSourceApproval: null,
    patchedSourceApproval: null,
    updatedSourceApproval: null,
    deletedSourceApproval: null,

    addedSourceDetail: null,
    updatedSourceDetail: null,
    deletedSourceDetail: null,
    error: null,
}

const procurementsState = {
    loading: false,
    procurements: null,
    addedProcurement: null,
    updatedProcurement: null,
    deletedProcurement: null,
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

const DashboardReducer = (state = dashboardState, action) => {
    switch (action.type) {
        case "SET_FCM_TOKEN_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "SET_FCM_TOKEN_SUCCES":
            return {
                ...state,
                fcmToken: action.response,
                loading: false,
            };
        case "SET_FCM_TOKEN_FAILURE":
            return {
                ...state,
                error: action.error,
                loading: false,
            };
        case "CLEAR_DASHBOARD_EVENT_DATA":
            return {
                ...state,
                fcmToken: null,
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
        case "GET_PROJECT_MODULE_COMPONENTS_REQUEST":
            return {
                ...state,
                error: null,
                loadingComponent: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_COMPONENTS_SUCCESS":
            return {
                ...state,
                components: action.response,
                error: null,
                loadingComponent: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_COMPONENTS_FAILURE":
            return {
                ...state,
                components: null,
                error: action.error,
                loadingComponent: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_COMPONENTS_TASKS_REQUEST":
            return {
                ...state,
                error: null,
                loadingTask: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_COMPONENTS_TASKS_SUCCESS":
            return {
                ...state,
                tasks: action.response,
                error: null,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_COMPONENTS_TASKS_FAILURE":
            return {
                ...state,
                tasks: null,
                error: action.error,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SUB_COMPONENTS_REQUEST":
            return {
                ...state,
                error: null,
                loadingTask: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_SUB_COMPONENTS_SUCCESS":
            return {
                ...state,
                subComponents: action.response,
                error: null,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SUB_COMPONENTS_FAILURE":
            return {
                ...state,
                subComponents: null,
                error: action.error,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SEGMENT_TASKS_REQUEST":
            return {
                ...state,
                error: null,
                loadingTask: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_SEGMENT_TASKS_SUCCESS":
            return {
                ...state,
                tasks: action.response,
                error: null,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SEGMENT_TASKS_FAILURE":
            return {
                ...state,
                tasks: null,
                error: action.error,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_REQUEST":
            return {
                ...state,
                error: null,
                loadingTask: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_SUCCESS":
            return {
                ...state,
                tasks: action.response,
                error: null,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_FAILURE":
            return {
                ...state,
                tasks: null,
                error: action.error,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_NEXT_LEVEL_REQUEST":
            return {
                ...state,
                error: null,
                loadingTask: true,
                loading: true,
            };
        case "GET_PROJECT_MODULE_NEXT_LEVEL_SUCCESS":
            return {
                ...state,
                nextLevel: action.response,
                error: null,
                loadingTask: false,
                loading: false,
            };
        case "GET_PROJECT_MODULE_NEXT_LEVEL_FAILURE":
            return {
                ...state,
                nextLevel: null,
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
        case "GET_USERS_MY_WORK_REQUEST":
            return {
                ...state,
                usersData: [],
                error: null,
                loading: true,
                loadingUsers: true,
            };
        case "GET_USERS_MY_WORK_SUCCESS":
            return {
                ...state,
                usersData: action.response,
                error: null,
                loading: false,
                loadingUsers: false,
            };
        case "GET_USERS_MY_WORK_FAILURE":
            return {
                ...state,
                usersData: null,
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
        case "SEGMENT_TYPE_WORK_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "SEGMENT_TYPE_WORK_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                segmentWorkAssigned: action.response,
                error: null,
                loading: false,
            };
        case "SEGMENT_TYPE_WORK_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                segmentWorkAssigned: null,
                error: action.error,
                loading: false,
            };
        case "COMPONENT_WORK_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "COMPONENT_WORK_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                componentWorkAssigned: action.response,
                error: null,
                loading: false,
            };
        case "COMPONENT_WORK_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                componentWorkAssigned: null,
                error: action.error,
                loading: false,
            };
        case "SUB_COMPONENT_WORK_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "SUB_COMPONENT_WORK_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                subComponentWorkAssigned: action.response,
                error: null,
                loading: false,
            };
        case "SUB_COMPONENT_WORK_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                subComponentWorkAssigned: null,
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
                componentWorkAssigned: null,
                subComponentWorkAssigned: null,
                taskWorkAssigned: null,
                error: null,
                loading: false,
            };
        case "CLEAR_WORK_ASSIGMENT":
            return {
                ...state,
                projectModules: null,
                segments: null,
                components: null,
                segmentWorkAssigned: null,
                componentWorkAssigned: null,
                subComponentWorkAssigned: null,
                projectModulesWorkAssigned: null,
                taskWorkAssigned: null,
                users: null,
                error: null,
                loading: false,
                loadingSegment: false,
                loadingComponent: false,
                loadingTask: false,
            };
        case "CLEAR_NEXT_LEVEL":
            return {
                ...state,
                nextLevel: null,
                loading: false,
                loadingTask: false,
            };
        default:
            return state;
    }
}

const TestAssignmentReducer = (state = testAssignmentState, action) => {
    switch (action.type) {
        case "GET_TEST_CLASSIFICATION_REQUEST":
            return {
                ...state,
                testClassifications: [],
                error: null,
                loading: true,
            };
        case "GET_TEST_CLASSIFICATION_SUCCESS":
            return {
                ...state,
                testClassifications: action.response,
                error: null,
                loading: false,
            };
        case "GET_TEST_CLASSIFICATION_FAILURE":
            return {
                ...state,
                testClassifications: null,
                error: action.error,
                loading: false,
            };
        case "GET_TEST_WORK_CATEGORY_REQUEST":
            return {
                ...state,
                error: null,
                loadingTestWorkCategory: true,
                loading: true,
            };
        case "GET_TEST_WORK_CATEGORY_SUCCESS":
            return {
                ...state,
                testWorkCategory: action.response,
                error: null,
                loadingTestWorkCategory: false,
                loading: false,
            };
        case "GET_TEST_WORK_CATEGORY_FAILURE":
            return {
                ...state,
                testWorkCategory: null,
                error: action.error,
                loading: false,
                loadingTestWorkCategory: false
            };
        case "GET_TEST_MATERIALS_REQUEST":
            return {
                ...state,
                error: null,
                loadingTestMaterials: true,
                loading: true,
            };
        case "GET_TEST_MATERIALS_SUCCESS":
            return {
                ...state,
                testMaterials: action.response,
                error: null,
                loadingTestMaterials: false,
                loading: false,
            };
        case "GET_TEST_MATERIALS_FAILURE":
            return {
                ...state,
                testMaterials: null,
                error: action.error,
                loadingTestMaterials: false,
                loading: false,
            };
        case "GET_TEST_TYPE_REQUEST":
            return {
                ...state,
                error: null,
                loadingTestTypes: true,
                loading: true,
            };
        case "GET_TEST_TYPE_SUCCESS":
            return {
                ...state,
                testTypes: action.response,
                error: null,
                loadingTestTypes: false,
                loading: false,
            };
        case "GET_TEST_TYPE_FAILURE":
            return {
                ...state,
                testTypes: null,
                error: action.error,
                loadingTestTypes: false,
                loading: false,
            };
        case "GET_TEST_CLASSIFICATION_NEXT_LEVEL_REQUEST":
            return {
                ...state,
                error: null,
                loadingTask: true,
                loading: true,
            };
        case "GET_TEST_CLASSIFICATION_NEXT_LEVEL_SUCCESS":
            return {
                ...state,
                nextLevel: action.response,
                error: null,
                loadingTask: false,
                loading: false,
            };
        case "GET_TEST_CLASSIFICATION_NEXT_LEVEL_FAILURE":
            return {
                ...state,
                nextLevel: null,
                error: action.error,
                loadingTask: false,
                loading: false,
            };
        case "GET_USERS_TO_TEST_ASSIGNMENT_REQUEST":
            return {
                ...state,
                users: [],
                error: null,
                loading: true,
                loadingUsers: true,
            };
        case "GET_USERS_TO_TEST_ASSIGNMENT_SUCCESS":
            return {
                ...state,
                users: action.response,
                error: null,
                loading: false,
                loadingUsers: false,
            };
        case "GET_USERS_TO_TEST_ASSIGNMENT_FAILURE":
            return {
                ...state,
                users: null,
                error: action.error,
                loading: false,
                loadingUsers: false,
            };
        /*case "GET_USERS_MY_WORK_REQUEST":
            return {
                ...state,
                usersData: [],
                error: null,
                loading: true,
                loadingUsers: true,
            };
        case "GET_USERS_MY_WORK_SUCCESS":
            return {
                ...state,
                usersData: action.response,
                error: null,
                loading: false,
                loadingUsers: false,
            };
        case "GET_USERS_MY_WORK_FAILURE":
            return {
                ...state,
                usersData: null,
                error: action.error,
                loading: false,
                loadingUsers: false,
            };*/
        case "TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                testClassificationsTestAssigned: action.response,
                error: null,
                loading: false,
            };
        case "TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                testClassificationsTestAssigned: null,
                error: action.error,
                loading: false,
            };
        case "TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                testWorkCategoryTestAssigned: action.response,
                error: null,
                loading: false,
            };
        case "TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                testWorkCategoryTestAssigned: null,
                error: action.error,
                loading: false,
            };
        case "TEST_MATERIALS_TEST_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "TEST_MATERIALS_TEST_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                testMaterialsTestAssigned: action.response,
                error: null,
                loading: false,
            };
        case "TEST_MATERIALS_TEST_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                testMaterialsTestAssigned: null,
                error: action.error,
                loading: false,
            };
        case "TEST_TYPES_TEST_ASSIGNMENT_USERS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "TEST_TYPES_TEST_ASSIGNMENT_USERS_SUCCESS":
            return {
                ...state,
                testTypesAssigned: action.response,
                error: null,
                loading: false,
            };
        case "TEST_TYPES_TEST_ASSIGNMENT_USERS_FAILURE":
            return {
                ...state,
                testTypesAssigned: null,
                error: action.error,
                loading: false,
            };
        case "CLEAR_TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS":
            return {
                ...state,
                testClassificationsTestAssigned: null,
                testWorkCategoryTestAssigned: null,
                testMaterialsTestAssigned: null,
                testTypesAssigned: null,
                error: null,
                loading: false,
            };
        case "CLEAR_TEST_ASSIGNMENT":
            return {
                ...state,
                testClassifications: null,
                testWorkCategory: null,
                testMaterials: null,
                testTypes: null,
                testClassificationsTestAssigned: null,
                testWorkCategoryTestAssigned: null,
                testMaterialsTestAssigned: null,
                testTypesAssigned: null,
                users: null,
                error: null,
                loading: false,
                loadingTestWorkCategory: false,
                loadingTestMaterials: false,
                loadingTestTypes: false,
            };
        case "CLEAR_NEXT_LEVEL":
            return {
                ...state,
                nextLevel: null,
                loading: false,
                loadingTestTypes: false,
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
                rfiData: null,
                error: action.error,
                loading: false,
            };
        case "GET_RFI_BY_WA_ID_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "GET_RFI_BY_WA_ID_SUCCESS":
            return {
                ...state,
                rfiData: action.response,
                error: null,
                loading: false,
            };
        case "GET_RFI_BY_WA_ID_FAILURE":
            return {
                ...state,
                rfiData: null,
                error: action.error,
                loading: false,
            };
        case "FILL_RFI_CHECK_LIST_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "FILL_RFI_CHECK_LIST_SUCCESS":
            return {
                ...state,
                rfiChecklistSaved: action.response,
                error: null,
                loading: false,
            };
        case "FILL_RFI_CHECK_LIST_FAILURE":
            return {
                ...state,
                rfiChecklistSaved: null,
                error: action.error,
                loading: false,
            };
        case "TEST_SAMPLE_FILL_RFI_CHECK_LIST_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "TEST_SAMPLE_FILL_RFI_CHECK_LIST_SUCCESS":
            return {
                ...state,
                rfiChecklistSaved: action.response,
                error: null,
                loading: false,
            };
        case "TEST_SAMPLE_FILL_RFI_CHECK_LIST_FAILURE":
            return {
                ...state,
                rfiChecklistSaved: null,
                error: action.error,
                loading: false,
            };
        case "GET_MY_TESTS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "GET_MY_TESTS_SUCCESS":
            return {
                ...state,
                myTests: action.response,
                error: null,
                loading: false,
            };
        case "GET_MY_TESTS_FAILURE":
            return {
                ...state,
                rfiData: null,
                error: action.error,
                loading: false,
            };
        case "UPDATE_TEST_SAMPLE_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "UPDATE_TEST_SAMPLE_SUCCESS":
            return {
                ...state,
                testSampleUpdated: action.response,
                error: null,
                loading: false,
            };
        case "UPDATE_TEST_SAMPLE_FAILURE":
            return {
                ...state,
                testSampleUpdated: null,
                error: action.error,
                loading: false,
            };
        case "GENERATE_TEST_SAMPLE_REPORT_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "GENERATE_TEST_SAMPLE_REPORT_SUCCESS":
            return {
                ...state,
                generatedTestSampleReport: action.response,
                error: null,
                loading: false,
            };
        case "GENERATE_TEST_SAMPLE_REPORT_FAILURE":
            return {
                ...state,
                generatedTestSampleReport: null,
                error: action.error,
                loading: false,
            };    
        case "CLEAR_MY_WORKS":
            return {
                ...state,
                myWorks: null,
                myTests: null,
                rfiData: null,
                rfiChecklistSaved: null,
                testSampleUpdated: null,
                generatedTestSampleReport: null,
                error: null,
                loading: false,
            };
        default:
            return state;
    }
}

const RFIsReportsReducer = (state = myWorksState, action) => {
    switch (action.type) {
        case "GET_RFI_REPORTS_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "GET_RFI_REPORTS_SUCCESS":
            return {
                ...state,
                rfiDataList: action.response,
                error: null,
                loading: false,
            };
        case "GET_RFI_REPORTS_FAILURE":
            return {
                ...state,
                rfiDataList: null,
                error: action.error,
                loading: false,
            };
        case "DOWNLOAD_REPORT_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "DOWNLOAD_REPORT_SUCCESS":
            return {
                ...state,
                reportDownloaded: action.response,
                error: null,
                loading: false,
            };
        case "DOWNLOAD_REPORT_FAILURE":
            return {
                ...state,
                reportDownloaded: null,
                error: action.error,
                loading: false,
            };
        case "CLEAR_RFI_REPORTS_REQUEST":
            return {
                ...state,
               // rfiDataList: null,
                reportDownloaded: null,
                error: null,
                loading: false,
            };
        case "LIST_TEST_SAMPLE_REPORT_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "LIST_TEST_SAMPLE_REPORT_SUCCESS":
            return {
                ...state,
                sampleTestDataList: action.response,
                error: null,
                loading: false,
            };
        case "LIST_TEST_SAMPLE_REPORT_FAILURE":
            return {
                ...state,
                sampleTestDataList: null,
                error: action.error,
                loading: false,
            };
        case "VIEW_TEST_SAMPLE_REPORT_REQUEST":
            return {
                ...state,
                error: null,
                loading: true,
            };
        case "VIEW_TEST_SAMPLE_REPORT_SUCCESS":
            return {
                ...state,
                reportDownloaded: action.response,
                error: null,
                loading: false,
            };
        case "VIEW_TEST_SAMPLE_REPORT_FAILURE":
            return {
                ...state,
                reportDownloaded: null,
                error: action.error,
                loading: false,
            };
        default:
            return state;
    }
}

const RFIsReducer = (state = myWorksState, action) => {
    switch (action.type) {
      case 'GET_RFI_TASKS_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'GET_RFI_TASKS_SUCCESS':
        return {
          ...state,
          rfisTasks: action.response,
          error: null,
          loading: false,
        };
      case 'GET_RFI_TASKS_FAILURE':
        return {
          ...state,
          rfisTasks: null,
          error: action.error,
          loading: false,
        };
      case 'GET_RFI_TASK_USERS_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'GET_RFI_TASK_USERS_SUCCESS':
        return {
          ...state,
          taskUsers: action.response,
          error: null,
          loading: false,
        };
      case 'GET_RFI_TASK_USERS_FAILURE':
        return {
          ...state,
          taskUsers: null,
          error: action.error,
          loading: false,
        };
      case 'GENERATE_RFI_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'GENERATE_RFI_SUCCESS':
        return {
          ...state,
          rfiGenerated: action.response,
          error: null,
          loading: false,
        };
      case 'GENERATE_RFI_FAILURE':
        return {
          ...state,
          rfiGenerated: null,
          error: action.error,
          loading: false,
        };
      case 'GET_RFI_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'GET_RFI_SUCCESS':
        return {
          ...state,
          rfiDataList: action.response,
          error: null,
          loading: false,
        };
      case 'GET_RFI_FAILURE':
        return {
          ...state,
          rfiDataList: null,
          error: action.error,
          loading: false,
        };
      case 'GET_TEST_RFI_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'GET_TEST_RFI_SUCCESS':
        return {
          ...state,
          rfiDataList: action.response,
          error: null,
          loading: false,
        };
      case 'GET_TEST_RFI_FAILURE':
        return {
          ...state,
          rfiDataList: null,
          error: action.error,
          loading: false,
        };
      case 'UPDATE_RFI_REQUEST':
        return {
          ...state,
          error: null,
          rfiUpdated: null,
          loading: true,
        };
      case 'UPDATE_RFI_SUCCESS':
        return {
          ...state,
          rfiUpdated: action.response,
          error: null,
          loading: false,
        };
      case 'UPDATE_RFI_FAILURE':
        return {
          ...state,
          rfiUpdated: null,
          error: action.error,
          loading: false,
        };
      case 'UPDATE_TEST_RFI_REQUEST':
        return {
          ...state,
          rfiUpdated: null,
          error: null,
          loading: true,
        };
      case 'UPDATE_TEST_RFI_SUCCESS':
        return {
          ...state,
          rfiUpdated: action.response,
          error: null,
          loading: false,
        };
      case 'UPDATE_TEST_RFI_FAILURE':
        return {
          ...state,
          rfiUpdated: null,
          error: action.error,
          loading: false,
        };
      case 'DOWNLOAD_REPORT_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'DOWNLOAD_REPORT_SUCCESS':
        return {
          ...state,
          reportdownloaded: action.response,
          error: null,
          loading: false,
        };
      case 'DOWNLOAD_REPORT_FAILURE':
        return {
          ...state,
          reportdownloaded: null,
          error: action.error,
          loading: false,
        };
      case 'CLEAR_RFI_REQUEST':
        return {
          ...state,
          rfiDataList: null,
          rfiUpdated: null,
          reportdownloaded: null,
          labTestRfiGenerated: null,
          qualityMasterListing: null,
          error: null,
          loading: false,
        };
      case 'GENERATE_LAB_TEST_RFI_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'GENERATE_LAB_TEST_RFI_SUCCESS':
        return {
          ...state,
          labTestRfiGenerated: action.response,
          error: null,
          loading: false,
        };
      case 'GENERATE_LAB_TEST_RFI_FAILURE':
        return {
          ...state,
          labTestRfiGenerated: null,
          error: action.error,
          loading: false,
        };
      case 'GET_QUALITY_MASTER_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'GET_QUALITY_MASTER_SUCCESS':
        return {
          ...state,
          qualityMasterListing: action.response,
          error: null,
          loading: false,
        };
      case 'GET_QUALITY_MASTER_FAILURE':
        return {
          ...state,
          qualityMasterListing: null,
          error: action.error,
          loading: false,
        };
      case 'GET_MIX_DESIGN_REQUEST':
        return {
          ...state,
          error: null,
          loading: true,
        };
      case 'GET_MIX_DESIGN_SUCCESS':
        return {
          ...state,
          qualityMixDesignListing: action.response,
          error: null,
          loading: false,
        };
      case 'GET_MIX_DESIGN_FAILURE':
        return {
          ...state,
          qualityMixDesignListing: null,
          error: action.error,
          loading: false,
        };
      default:
        return state;
    }
}

const SourceApprovalsReducer = (state = sourceApprovalsState, action) => {
    switch (action.type) {
        case SOURCE_APPROVALS.GET_SOURCE_APPROVALS_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.GET_SOURCE_APPROVALS_SUCCESS:
            return {
                ...state,
                sourceApprovals: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.GET_SOURCE_APPROVALS_FAILURE:
            return {
                ...state,
                sourceApprovals: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.GET_SOURCE_APPROVALS_BY_STATUS_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.GET_SOURCE_APPROVALS_BY_STATUS_SUCCESS:
            return {
                ...state,
                sourceApprovalsByStatus: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.GET_SOURCE_APPROVALS_BY_STATUS_FAILURE:
            return {
                ...state,
                sourceApprovalsByStatus: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_SUCCESS:
            return {
                ...state,
                addedSourceApproval: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_FAILURE:
            return {
                ...state,
                addedSourceApproval: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.PATCH_SOURCE_APPROVAL_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.PATCH_SOURCE_APPROVAL_SUCCESS:
            return {
                ...state,
                patchedSourceApproval: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.PATCH_SOURCE_APPROVAL_FAILURE:
            return {
                ...state,
                patchedSourceApproval: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_SUCCESS:
            return {
                ...state,
                updatedSourceApproval: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_FAILURE:
            return {
                ...state,
                updatedSourceApproval: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_SUCCESS:
            return {
                ...state,
                deletedSourceApproval: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_FAILURE:
            return {
                ...state,
                deletedSourceApproval: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_DETAIL_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_DETAIL_SUCCESS:
            return {
                ...state,
                addedSourceDetail: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_DETAIL_FAILURE:
            return {
                ...state,
                addedSourceDetail: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_DETAIL_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_DETAIL_SUCCESS:
            return {
                ...state,
                updatedSourceDetail: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_DETAIL_FAILURE:
            return {
                ...state,
                updatedSourceDetail: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_DETAIL_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_DETAIL_SUCCESS:
            return {
                ...state,
                deletedSourceDetail: action.response,
                error: null,
                loading: false,
            };
        case SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_DETAIL_FAILURE:
            return {
                ...state,
                deletedSourceDetail: null,
                error: action.error,
                loading: false,
            };
        case SOURCE_APPROVALS.CLEAR_SOURCE_APPROVALS_REQUEST:
            return {
                ...state,
                sourceApprovals: null,
                sourceApprovalsByStatus: null,
                addedSourceApproval: null,
                patchedSourceApproval: null,
                updatedSourceApproval: null,
                deletedSourceApproval: null,
                addedSourceDetail: null,
                updatedSourceDetail: null,
                deletedSourceDetail: null,
                error: action.error,
                error: null,
                loading: true,
            };
            return {
                ...state,
                sourceApprovals: null,
                sourceApprovalsByStatus: null,
                addedSourceApproval: null,
                patchedSourceApproval: null,
                updatedSourceApproval: null,
                deletedSourceApproval: null,
                addedSourceDetail: null,
                updatedSourceDetail: null,
                deletedSourceDetail: null,
                error: action.error,
                loading: false,
            };
        default:
            return state;
    }
}

const ProcurementsReducer = (state = procurementsState, action) => {
    switch (action.type) {
        /* Procurements */
        case PROCUREMENTS.GET_PROCUREMENTS_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case PROCUREMENTS.GET_PROCUREMENTS_SUCCESS:
            return {
                ...state,
                procurements: action.response,
                error: null,
                loading: false,
            };
        case PROCUREMENTS.GET_PROCUREMENTS_FAILURE:
            return {
                ...state,
                procurements: null,
                error: action.error,
                loading: false,
            };
        case PROCUREMENTS.ADD_PROCUREMENT_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case PROCUREMENTS.ADD_PROCUREMENT_SUCCESS:
            return {
                ...state,
                addedProcurement: action.response,
                error: null,
                loading: false,
            };
        case PROCUREMENTS.ADD_PROCUREMENT_FAILURE:
            return {
                ...state,
                addedProcurement: null,
                error: action.error,
                loading: false,
            };
        case PROCUREMENTS.UPDATE_PROCUREMENT_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case PROCUREMENTS.UPDATE_PROCUREMENT_SUCCESS:
            return {
                ...state,
                updatedProcurement: action.response,
                error: null,
                loading: false,
            };
        case PROCUREMENTS.UPDATE_PROCUREMENT_FAILURE:
            return {
                ...state,
                updatedProcurement: null,
                error: action.error,
                loading: false,
            };
        case PROCUREMENTS.DELETE_PROCUREMENT_REQUEST:
            return {
                ...state,
                error: null,
                loading: true,
            };
        case PROCUREMENTS.DELETE_PROCUREMENT_SUCCESS:
            return {
                ...state,
                deletedProcurement: action.response,
                error: null,
                loading: false,
            };
        case PROCUREMENTS.DELETE_PROCUREMENT_FAILURE:
            return {
                ...state,
                deletedProcurement: null,
                error: action.error,
                loading: false,
            };
        case PROCUREMENTS.CLEAR_PROCUREMENT_REQUEST:
            return {
                ...state,
                procurements: null,
                addedProcurement: null,
                updatedProcurement: null,
                deletedProcurement: null,
                loading: true,
            };
            return {
                ...state,
                procurements: null,
                addedProcurement: null,
                updatedProcurement: null,
                deletedProcurement: null,
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
    Dashboard: DashboardReducer,
    ForgotPassword: ForgotPasswordReducer,
    UserProfile: UserProfileReducer,
    UserAssignment: UserAssignmentReducer,
    ProjectInfo: ProjectInfoReducer,
    WorkAssignment: WorkAssignmentReducer,
    TestAssignment: TestAssignmentReducer,
    MyWorks: MyWorkReducer,
    RFIs: RFIsReducer,
    Reports: RFIsReportsReducer,
    SourceApprovals: SourceApprovalsReducer,
    Procurements: ProcurementsReducer
})
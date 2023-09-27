
import { put, takeLatest } from 'redux-saga/effects';
import { getUserAssignment, getUserCategory, userCategoriesAssignment } from '../../services/user/user.service';
import { getProjectModuleSegmentsData, getProjectModuleSubSegmentsData, getProjectModulesData, getUsersForWorkAssignmentData, projectModulesWorkAssignToUsersApi } from '../../services/work-assignment/work-assignment.service';
function* getUserCategories() {
    try {
        const response = yield (getUserCategory());
        yield put({ type: "GET_USER_CATEGORY_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_USER_CATEGORY_FAILURE", error: error.message });
    }
}

function* getUsers() {
    try {
        const response = yield (getUserAssignment());
        yield put({ type: "GET_USER_ASSIGNMENT_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_USER_ASSIGNMENT_FAILURE", error: error.message });
    }
}

function* addUserCategories({ payload }) {
    try {
        const response = yield (userCategoriesAssignment(payload.userId, {categories: payload.categories || []}));
        yield put({ type: "ADD_USER_ASSIGNMENT_SUCCESS", response });
    } catch (error) {
        yield put({ type: "ADD_USER_ASSIGNMENT_FAILURE", error: error.message });
    }
}

function* getProjectModules({ payload }) {
    try {
        const response = yield (getProjectModulesData(payload.projectId, payload.projectType));

        yield put({ type: "GET_PROJECT_MODULES_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULES_FAILURE", error: error.message });
    }
}

function* getProjectModuleSegments({ payload }) {
    try {
        const response = yield (getProjectModuleSegmentsData(payload.projectId, payload.projectModuleId));

        yield put({ type: "GET_PROJECT_MODULE_SEGMENTS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_SEGMENTS_FAILURE", error: error.message });
    }
}

function* getProjectModuleSubSegments({ payload }) {
    try {
        const response = yield (getProjectModuleSubSegmentsData(payload.projectId, payload.projectModuleId, payload.segmentId));
        yield put({ type: "GET_PROJECT_MODULE_SUB_SEGMENTS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_SUB_SEGMENTS_FAILURE", error: error.message });
    }
}

function* getUsersForWorkAssignment({ payload }) {
    try {
        const response = yield (getUsersForWorkAssignmentData(payload.projectId));
        yield put({ type: "GET_USERS_TO_WORK_ASSIGNMENT_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_USERS_TO_WORK_ASSIGNMENT_FAILURE", error: error.message });
    }
}

function* projectModulesWorkAssignToUsers({ payload }) {
    try {
        console.log("========", payload.body)
        const response = yield (projectModulesWorkAssignToUsersApi(payload.projectId, payload.projectModuleId, payload.body));
        yield put({ type: "PROJECT_MODULE_WORK_ASSIGNMENT_USERS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "PROJECT_MODULE_WORK_ASSIGNMENT_USERS_FAILURE", error: error.message });
    }
}

export default function* userCategoriesAssignmentScreenSaga() {
    yield takeLatest("GET_USER_CATEGORY_REQUEST", getUserCategories);
    yield takeLatest("GET_USER_ASSIGNMENT_REQUEST", getUsers);
    yield takeLatest("ADD_USER_ASSIGNMENT_REQUEST", addUserCategories);
    yield takeLatest("GET_PROJECT_MODULES_REQUEST", getProjectModules);
    yield takeLatest("GET_PROJECT_MODULE_SEGMENTS_REQUEST", getProjectModuleSegments);
    yield takeLatest("GET_PROJECT_MODULE_SUB_SEGMENTS_REQUEST", getProjectModuleSubSegments);
    yield takeLatest("GET_USERS_TO_WORK_ASSIGNMENT_REQUEST", getUsersForWorkAssignment);
    yield takeLatest("PROJECT_MODULE_WORK_ASSIGNMENT_USERS_REQUEST", projectModulesWorkAssignToUsers);
}



import { put, takeLatest } from 'redux-saga/effects';
import { getUserAssignment, getUserCategory, userCategoriesAssignment } from '../../services/user/user.service';
import { getProjectModuleSegmentsData, getProjectModuleComponentsData, getProjectModuleTasksData, getProjectModulesData, getUsersForWorkAssignmentData, projectModulesWorkAssignToUsersApi, segmentTypeWorkAssignToUsersApi, segmentsWorkAssignToUsersApi, componentsWorkAssignToUsersApi, tasksWorkAssignToUsersApi } from '../../services/work-assignment/work-assignment.service';

function* getProjectModules({ payload }) {
    try {
        const response = yield (getProjectModulesData(payload.projectId, payload.workType));

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

function* getProjectModuleComponents({ payload }) {
    try {
        const response = yield (getProjectModuleComponentsData(payload.projectId, payload.projectModuleId, payload.segmentId));
        yield put({ type: "GET_PROJECT_MODULE_SUB_SEGMENTS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_SUB_SEGMENTS_FAILURE", error: error.message });
    }
}

function* getProjectModuleTasks({ payload }) {
    try {
        const response = yield (getProjectModuleTasksData(payload.projectId, payload.projectModuleId, payload.segmentId, payload.componentId));
        yield put({ type: "GET_PROJECT_MODULE_TASKS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_TASKS_FAILURE", error: error.message });
    }
}

function* getUsersForWorkAssignment({ payload }) {
    try {
        const response = yield (getUsersForWorkAssignmentData(payload.projectId, payload.workType));
        yield put({ type: "GET_USERS_MY_WORK_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_USERS_MY_WORK_FAILURE", error: error.message });
    }
}

export default function* projectHeadMyWorkAssignmentScreenSaga() {
    yield takeLatest("GET_PROJECT_MODULES_REQUEST", getProjectModules);
    yield takeLatest("GET_PROJECT_MODULE_SEGMENTS_REQUEST", getProjectModuleSegments);
    yield takeLatest("GET_PROJECT_MODULE_SUB_SEGMENTS_REQUEST", getProjectModuleComponents);
    yield takeLatest("GET_PROJECT_MODULE_TASKS_REQUEST", getProjectModuleTasks);
    yield takeLatest("GET_USERS_MY_WORK_REQUEST", getUsersForWorkAssignment);
}


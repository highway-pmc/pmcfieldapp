
import { put, takeLatest } from 'redux-saga/effects';
import { getUserAssignment, getUserCategory, userCategoriesAssignment } from '../../services/user/user.service';
import { getProjectModuleSegmentsData, getProjectModuleSubSegmentsData, getProjectModuleTasksData, getProjectModulesData, getUsersForWorkAssignmentData, projectModulesWorkAssignToUsersApi, segmentTypeWorkAssignToUsersApi, segmentsWorkAssignToUsersApi, subSegmentsWorkAssignToUsersApi, tasksWorkAssignToUsersApi } from '../../services/work-assignment/work-assignment.service';

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

function* getProjectModuleTasks({ payload }) {
    try {
        const response = yield (getProjectModuleTasksData(payload.projectId, payload.projectModuleId, payload.segmentId, payload.subSegmentId));
        yield put({ type: "GET_PROJECT_MODULE_TASKS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_TASKS_FAILURE", error: error.message });
    }
}

function* getUsersForWorkAssignment({ payload }) {
    try {
        console.log('================1')
        const response = yield (getUsersForWorkAssignmentData(payload.projectId, payload.projectType));
        console.log('================2')
        yield put({ type: "GET_USERS_MY_WORK_SUCCESS", response });
    } catch (error) {
        console.log('================3')
        yield put({ type: "GET_USERS_MY_WORK_FAILURE", error: error.message });
    }
}

export default function* projectHeadMyWorkAssignmentScreenSaga() {
    yield takeLatest("GET_PROJECT_MODULES_REQUEST", getProjectModules);
    yield takeLatest("GET_PROJECT_MODULE_SEGMENTS_REQUEST", getProjectModuleSegments);
    yield takeLatest("GET_PROJECT_MODULE_SUB_SEGMENTS_REQUEST", getProjectModuleSubSegments);
    yield takeLatest("GET_PROJECT_MODULE_TASKS_REQUEST", getProjectModuleTasks);
    yield takeLatest("GET_USERS_MY_WORK_REQUEST", getUsersForWorkAssignment);
}


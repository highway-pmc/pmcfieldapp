
import { put, takeLatest } from 'redux-saga/effects';
import { getUserAssignment, getUserCategory, userCategoriesAssignment } from '../../services/user/user.service';
import { getProjectModuleSegmentsData, getProjectModuleComponentsData, getProjectModuleComponentTasksData, getProjectModulesData, getUsersForWorkAssignmentData, projectModulesWorkAssignToUsersApi, segmentTypeWorkAssignToUsersApi, segmentsWorkAssignToUsersApi, componentsWorkAssignToUsersApi, tasksWorkAssignToUsersApi, getProjectModuleSegmentTasksData, getProjectModuleSubComponentsData, getProjectModuleSubComponentTasksData, getProjectModuleNextLevelData } from '../../services/work-assignment/work-assignment.service';

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

function* getProjectModuleSegmentTasks({ payload }) {
    try {
        const response = yield (getProjectModuleSegmentTasksData(payload.projectId, payload.projectModuleId, payload.segmentId));

        yield put({ type: "GET_PROJECT_MODULE_SEGMENT_TASKS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_SEGMENT_TASKS_FAILURE", error: error.message });
    }
}


function* getProjectModuleComponents({ payload }) {
    try {
        const response = yield (getProjectModuleComponentsData(payload.projectId, payload.projectModuleId, payload.segmentId));
        yield put({ type: "GET_PROJECT_MODULE_COMPONENTS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_COMPONENTS_FAILURE", error: error.message });
    }
}

function* getProjectModuleComponentTasks({ payload }) {
    try {
        const response = yield (getProjectModuleComponentTasksData(payload.projectId, payload.projectModuleId, payload.segmentId, payload.componentId));
        yield put({ type: "GET_PROJECT_MODULE_COMPONENTS_TASKS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_COMPONENTS_TASKS_FAILURE", error: error.message });
    }
}

function* getProjectModuleSubComponents({ payload }) {
    try {
        const response = yield (getProjectModuleSubComponentsData(payload.projectId, payload.projectModuleId, payload.segmentId, payload.componentId));
        yield put({ type: "GET_PROJECT_MODULE_SUB_COMPONENTS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_SUB_COMPONENTS_FAILURE", error: error.message });
    }
}

function* getProjectModuleSubComponentTasks({ payload }) {
    try {
        const response = yield (getProjectModuleSubComponentTasksData(payload.projectId, payload.projectModuleId, payload.segmentId, payload.componentId, payload.subComponentId));
        yield put({ type: "GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_FAILURE", error: error.message });
    }
}

function* getProjectModuleNextLevel({ payload }) {
    try {
        const response = yield (getProjectModuleNextLevelData(payload.projectId, payload.projectModuleId, payload.id, payload.type));
        yield put({ type: "GET_PROJECT_MODULE_NEXT_LEVEL_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_MODULE_NEXT_LEVEL_FAILURE", error: error.message });
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
    yield takeLatest("GET_PROJECT_MODULE_COMPONENTS_REQUEST", getProjectModuleComponents);
    yield takeLatest("GET_PROJECT_MODULE_COMPONENTS_TASKS_REQUEST", getProjectModuleComponentTasks);
    yield takeLatest("GET_USERS_MY_WORK_REQUEST", getUsersForWorkAssignment);

    yield takeLatest("GET_PROJECT_MODULE_SEGMENT_TASKS_REQUEST", getProjectModuleSegmentTasks);
    yield takeLatest("GET_PROJECT_MODULE_SUB_COMPONENTS_REQUEST", getProjectModuleSubComponents);
    yield takeLatest("GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_REQUEST", getProjectModuleSubComponentTasks);
    yield takeLatest("GET_PROJECT_MODULE_NEXT_LEVEL_REQUEST", getProjectModuleNextLevel);
}


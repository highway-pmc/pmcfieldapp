
import { put, takeLatest } from 'redux-saga/effects';
import { getRFITaskUsersData, getRFITasksData } from '../../services/rfi/rfis.service';

function* getRFITasks({ payload }) {
    try {
        const response = yield (getRFITasksData(payload.projectId, payload.userCategory, payload.level));
        yield put({ type: "GET_RFI_TASKS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_RFI_TASKS_FAILURE", error: error.message });
    }
}

function* getRFITaskUsers({ payload }) {
    try {
        const response = yield (getRFITaskUsersData(payload.projectId, payload.userCategory, payload.level));
        yield put({ type: "GET_RFI_TASK_USERS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_RFI_TASK_USERS_FAILURE", error: error.message });
    }
}

export default function* myRFISScreenSaga() {
    yield takeLatest("GET_RFI_TASKS_REQUEST", getRFITasks);
    yield takeLatest("GET_RFI_TASK_USERS_REQUEST", getRFITaskUsers);
}
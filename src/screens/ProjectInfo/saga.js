
import { put, takeLatest } from 'redux-saga/effects';
import { getProjectInfoData } from '../../services/project/project.service';

function* getProjectInfo({ payload }) {
    try {
        const response = yield (getProjectInfoData(payload));
        yield put({ type: "GET_PROJECT_INFO_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_PROJECT_INFO_FAILURE", error: error.message });
    }
}

export default function* projectInfoScreenSaga() {
    yield takeLatest("GET_PROJECT_INFO_REQUEST", getProjectInfo);
}
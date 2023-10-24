
import { put, takeLatest } from 'redux-saga/effects';
import { updateDeviceFCMToken } from '../../services/user/user.service';

function* updateFCMToken({ payload }) {
    try {
        const response = yield (updateDeviceFCMToken(payload));
        yield put({ type: "SET_FCM_TOKEN_SUCCESS", response });
    } catch (error) {
        yield put({ type: "SET_FCM_TOKEN_FAILURE", error: error.message });
    }
}

export default function* dashboardScreenSaga() {
    yield takeLatest("SET_FCM_TOKEN_REQUEST", updateFCMToken);
}
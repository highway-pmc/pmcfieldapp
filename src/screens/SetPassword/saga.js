
import { put, takeLatest } from 'redux-saga/effects';
import { setPasswordApi } from '../../services/user/user.service';

function* changePassword({ payload }) {
    try {
        console.log("=========", payload);
        const response = yield (setPasswordApi(payload));
        yield put({ type: "SET_PASSWORD_SUCCESS", response });
    } catch (error) {
        yield put({ type: "SET_PASSWORD_FAILURE", error: error.message });
    }
}

export default function* userScreenSaga() {
    yield takeLatest("SET_PASSWORD_REQUEST", changePassword);
}

import { put, takeLatest } from 'redux-saga/effects';
import { setPasswordApi } from '../../services/user/user.service';

function* changePassword({ payload }) {
    try {
        const response = yield (setPasswordApi(payload));
        yield put({ type: "CHANGE_PASSWORD_SUCCESS", response });
    } catch (error) {
        yield put({ type: "CHANGE_PASSWORD_FAILURE", error: error.message });
    }
}

export default function* changePassowrdScreenSaga() {
    yield takeLatest("CHANGE_PASSWORD_REQUEST", changePassword);
}

import { put, takeLatest } from 'redux-saga/effects';
import { forgotPassword } from '../../api/forgotpassword';

function* forgotPasswordUser({ payload }) {
    try {
        const response = yield (forgotPassword(payload));
        yield put({ type: "FORGOT_PASS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "FORGOT_PASS_FAILURE", error: error.message });
    }
}

export default function* forgotPasswordScreenSaga() {
    yield takeLatest("FORGOT_PASS_REQUEST", forgotPasswordUser);
}
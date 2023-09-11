
import { put, takeLatest } from 'redux-saga/effects';
import { sendOtpApi, verifyOtpApi, resetPasswordApi } from '../../services/forgotpassword/forgotpassowrd.service';

function* sendOtp({ payload }) {
    try {
        const response = yield (sendOtpApi(payload));
        console.log("====", response);
        yield put({ type: "FORGOT_PASS_OTP_SUCCESS", response });
    } catch (error) {
        yield put({ type: "FORGOT_PASS_OTP_FAILURE", error: error.message });
    }
}

function* verifyOtp({ payload }) {
    try {
        const response = yield (verifyOtpApi(payload));
        yield put({ type: "VERIFY_OTP_SUCCESS", response });
    } catch (error) {
        yield put({ type: "VERIFY_OTP_FAILURE", error: error.message });
    }
}

function* resetPassword({ payload }) {
    try {
        const response = yield (resetPasswordApi(payload));
        yield put({ type: "RESET_PASSWORD_SUCCESS", response });
    } catch (error) {
        yield put({ type: "RESET_PASSWORD_FAILURE", error: error.message });
    }
}

export default function* forgotPasswordScreenSaga() {
    yield takeLatest("FORGOT_PASS_OTP_REQUEST", sendOtp);
    yield takeLatest("VERIFY_OTP_REQUEST", verifyOtp);
    yield takeLatest("RESET_PASSWORD_REQUEST", resetPassword);
}
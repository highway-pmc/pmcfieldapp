
import { put, takeLatest } from 'redux-saga/effects';
import { getUserInfo, updateUserProfile } from '../../services/user/user.service';
function* getUserProfile() {
    try {
        const response = yield (getUserInfo());
        yield put({ type: "GET_USER_PROFILE_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_USER_PROFILE_FAILURE", error: error.message });
    }
}

function* updateUserProfileData({ payload }) {
    try {
        console.log("USER 2:", payload);
        const response = yield (updateUserProfile(payload));
        yield put({ type: "UPDATE_USER_PROFILE_SUCCESS", response });
    } catch (error) {
        yield put({ type: "UPDATE_USER_PROFILE_FAILURE", error: error.message });
    }
}

export default function* userProfileScreenSaga() {
    yield takeLatest("GET_USER_PROFILE_REQUEST", getUserProfile);
    yield takeLatest("UPDATE_USER_PROFILE_REQUEST", updateUserProfileData);
}
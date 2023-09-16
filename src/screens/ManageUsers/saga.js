
import { put, takeLatest } from 'redux-saga/effects';
import { getUserAssignment, getUserCategory, userCategoriesAssignment } from '../../services/user/user.service';
function* getUserCategories() {
    try {
        const response = yield (getUserCategory());
        yield put({ type: "GET_USER_CATEGORY_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_USER_CATEGORY_FAILURE", error: error.message });
    }
}

function* getUsers() {
    try {
        const response = yield (getUserAssignment());
        yield put({ type: "GET_USER_ASSIGNMENT_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_USER_ASSIGNMENT_FAILURE", error: error.message });
    }
}

function* addUserCategories({ payload }) {
    try {
        const response = yield (userCategoriesAssignment(payload.userId, {categories: payload.categories || []}));
        yield put({ type: "ADD_USER_ASSIGNMENT_SUCCESS", response });
    } catch (error) {
        yield put({ type: "ADD_USER_ASSIGNMENT_FAILURE", error: error.message });
    }
}

export default function* userCategoriesAssignmentScreenSaga() {
    yield takeLatest("GET_USER_CATEGORY_REQUEST", getUserCategories);
    yield takeLatest("GET_USER_ASSIGNMENT_REQUEST", getUsers);
    yield takeLatest("ADD_USER_ASSIGNMENT_REQUEST", addUserCategories);
}
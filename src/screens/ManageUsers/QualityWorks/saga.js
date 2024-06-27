
import { put, takeLatest } from 'redux-saga/effects';
import { getUserAssignment, getUserCategory } from '../../services/user/user.service';
import { getTestClassificationData, getTestClassificationNextLevelData, getTestMaterialsData, getTestTypesData, getTestWorkCategoryData, getUsersForTestAssignmentData, testClassificationsTestAssignToUsersApi, testMaterialsTestAssignToUsersApi, testTypesAssignToUsersApi, testWorkCategoryTestAssignToUsersApi } from '../../../services/test-assignment/test-assignment.service';
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

function* getTestClassifications({ payload }) {
    try {
        const response = yield (getTestClassificationData(payload.projectId, payload.workType));

        yield put({ type: "GET_TEST_CLASSIFICATION_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_TEST_CLASSIFICATION_FAILURE", error: error.message });
    }
}

function* getTestWorkCategory({ payload }) {
    try {
        const response = yield (getTestWorkCategoryData(payload.projectId, payload.testClassificationId));

        yield put({ type: "GET_TEST_WORK_CATEGORY_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_TEST_WORK_CATEGORY_FAILURE", error: error.message });
    }
}

function* getTestMaterials({ payload }) {
    try {
        const response = yield (getTestMaterialsData(payload.projectId, payload.testClassificationId, payload.testWorkCategoryId));
        yield put({ type: "GET_TEST_MATERIALS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_TEST_MATERIALS_FAILURE", error: error.message });
    }
}

function* getTestType({ payload }) {
    try {
        const response = yield (getTestTypesData(payload.projectId, payload.testClassificationId, payload.testWorkCategoryId, payload.testMaterialId));
        yield put({ type: "GET_TEST_TYPE_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_TEST_TYPE_FAILURE", error: error.message });
    }
}

function* getTestClassificationNextLevel({ payload }) {
    try {
        const response = yield (getTestClassificationNextLevelData(payload.projectId, payload.testClassificationId, payload.id, payload.type));
        yield put({ type: "GET_TEST_CLASSIFICATION_NEXT_LEVEL_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_TEST_CLASSIFICATION_NEXT_LEVEL_FAILURE", error: error.message });
    }
}

function* getUsersForTestAssignment({ payload }) {
    try {
        const response = yield (getUsersForTestAssignmentData(payload.projectId, payload.workType));
        yield put({ type: "GET_USERS_TO_TEST_ASSIGNMENT_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_USERS_TO_TEST_ASSIGNMENT_FAILURE", error: error.message });
    }
}

function* testClassificationsTestAssignToUsers({ payload }) {
    try {
        const response = yield (testClassificationsTestAssignToUsersApi(payload.projectId, payload.testClassificationId, payload.body));
        yield put({ type: "TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_FAILURE", error: error.message });
    }
}

function* testWorkCategoryTestAssignToUsers({ payload }) {
    try {
        const response = yield (testWorkCategoryTestAssignToUsersApi(payload.projectId, payload.testClassificationId, payload.testWorkCategoryId, payload.body));
        yield put({ type: "TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_FAILURE", error: error.message });
    }
}

function* testMaterialsTestAssignToUsers({ payload }) {
    try {
        const response = yield (testMaterialsTestAssignToUsersApi(payload.projectId, payload.testClassificationId, payload.testWorkCategoryId, payload.testMaterialId, payload.body));
        yield put({ type: "TEST_MATERIALS_TEST_ASSIGNMENT_USERS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "TEST_MATERIALS_TEST_ASSIGNMENT_USERS_FAILURE", error: error.message });
    }
}

function* testTypesAssignToUsers({ payload }) {
    try {
        const response = yield (testTypesAssignToUsersApi(payload.projectId, payload.testClassificationId, payload.testWorkCategoryId, payload.testMaterialId, payload.testTypeId, payload.body));
        yield put({ type: "TEST_TYPES_TEST_ASSIGNMENT_USERS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "TEST_TYPES_TEST_ASSIGNMENT_USERS_FAILURE", error: error.message });
    }
}

export default function* testAssignmentScreenSaga() {
    yield takeLatest("GET_USER_CATEGORY_REQUEST", getUserCategories);
    yield takeLatest("GET_USER_ASSIGNMENT_REQUEST", getUsers);
    yield takeLatest("GET_TEST_CLASSIFICATION_REQUEST", getTestClassifications);
    yield takeLatest("GET_TEST_WORK_CATEGORY_REQUEST", getTestWorkCategory);
    yield takeLatest("GET_TEST_MATERIALS_REQUEST", getTestMaterials);
    yield takeLatest("GET_TEST_TYPE_REQUEST", getTestType);
    yield takeLatest("GET_USERS_TO_TEST_ASSIGNMENT_REQUEST", getUsersForTestAssignment);
    yield takeLatest("TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_REQUEST", testClassificationsTestAssignToUsers);
    yield takeLatest("TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_REQUEST", testWorkCategoryTestAssignToUsers);
    yield takeLatest("TEST_MATERIALS_TEST_ASSIGNMENT_USERS_REQUEST", testMaterialsTestAssignToUsers);
    yield takeLatest("TEST_TYPES_TEST_ASSIGNMENT_USERS_REQUEST", testTypesAssignToUsers);
    yield takeLatest("GET_TEST_CLASSIFICATION_NEXT_LEVEL_REQUEST", getTestClassificationNextLevel);
}


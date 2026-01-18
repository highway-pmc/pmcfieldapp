
import { put, takeLatest } from 'redux-saga/effects';
import { checkAccessRightsApi, getMyTestsData, getMyWorksData } from '../../services/my-works/myworks.service';
import { fillRFIsDataChecklist, fillRFIsDataChecklistForSampleTest, generateTestSampleReportApi, getRFIDataByWaId, testSamplePreparedSubmitApi, updateTestSampleAPi } from '../../services/rfi/rfis.service';

function* getMyWorks({ payload }) {
    try {
        const response = yield (getMyWorksData(payload.projectId, payload.workType, payload.taskCategory, payload.level, payload.projectModuleId, payload.segmentId, payload.componentId, payload.subComponentId));
        yield put({ type: "GET_MY_WORKS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_MY_WORKS_FAILURE", error: error.message });
    }
}

function* getRFIByWaId({ payload }) {
    try {
        const response = yield (getRFIDataByWaId(payload.projectId, payload.projectModuleId, payload.waId));
        yield put({ type: "GET_RFI_BY_WA_ID_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_RFI_BY_WA_ID_FAILURE", error: error.message });
    }
}

function* fillRFIsChecklist({ payload }) {
    try {
        const response = yield (fillRFIsDataChecklist(payload.projectId, payload.projectModuleId, payload.rfiId, payload.status, payload.body));
        yield put({ type: "FILL_RFI_CHECK_LIST_SUCCESS", response });
    } catch (error) {
        yield put({ type: "FILL_RFI_CHECK_LIST_FAILURE", error: error.message });
    }
}

function* fillRFIsChecklistForSampleTest({ payload }) {
    try {
        const response = yield (fillRFIsDataChecklistForSampleTest(payload.projectId, payload.rfiId, payload.status, payload.body));
        yield put({ type: "TEST_SAMPLE_FILL_RFI_CHECK_LIST_SUCCESS", response });
    } catch (error) {
        yield put({ type: "TEST_SAMPLE_FILL_RFI_CHECK_LIST_FAILURE", error: error.message });
    }
}

function* testSamplePreparedSubmit({ payload }) {
    try {
        const response = yield (testSamplePreparedSubmitApi(payload.projectId, payload.testRfiId, payload.body));
        yield put({ type: "TEST_SAMPLE_PREPARED_SUBMIT_SUCCESS", response });
    } catch (error) {
        yield put({ type: "TEST_SAMPLE_PREPARED_SUBMIT_FAILURE", error: error.message });
    }
}

function* getMyTests({ payload }) {
    try {
        const response = yield (getMyTestsData(payload.projectId, payload.workType, payload.selectedType, payload.hasAccess));
        yield put({ type: "GET_MY_TESTS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_MY_TESTS_FAILURE", error: error.message });
    }
}

function* checkAccessRights({ payload }) {
    try {
        const response = yield (checkAccessRightsApi(payload.projectId, payload.workType, payload.selectedType));
        yield put({ type: "CHECK_ACCESS_RIGHTS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "CHECK_ACCESS_RIGHTS_FAILURE", error: error.message });
    }
}

function* updateTestSample({ payload }) {
    try {
        const response = yield (updateTestSampleAPi(payload.projectId, payload.id, payload.body));
        yield put({ type: "UPDATE_TEST_SAMPLE_SUCCESS", response });
    } catch (error) {
        yield put({ type: "UPDATE_TEST_SAMPLE_FAILURE", error: error.message });
    }
}

function* generateTestSampleReport({ payload }) {
    try {
        const response = yield (generateTestSampleReportApi(payload.projectId, payload.testRFIId));
        yield put({ type: "GENERATE_TEST_SAMPLE_REPORT_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GENERATE_TEST_SAMPLE_REPORT_FAILURE", error: error.message });
    }
}

export default function* myWorksScreenSaga() {
    yield takeLatest("GET_MY_WORKS_REQUEST", getMyWorks);
    yield takeLatest("GET_MY_TESTS_REQUEST", getMyTests);
    yield takeLatest("CHECK_ACCESS_RIGHTS_REQUEST", checkAccessRights);
    yield takeLatest("GET_RFI_BY_WA_ID_REQUEST", getRFIByWaId);
    yield takeLatest("FILL_RFI_CHECK_LIST_REQUEST", fillRFIsChecklist);
    yield takeLatest("TEST_SAMPLE_FILL_RFI_CHECK_LIST_REQUEST", fillRFIsChecklistForSampleTest);
    yield takeLatest("TEST_SAMPLE_PREPARED_SUBMIT_REQUEST", testSamplePreparedSubmit);
    yield takeLatest("UPDATE_TEST_SAMPLE_REQUEST", updateTestSample);
    yield takeLatest("GENERATE_TEST_SAMPLE_REPORT_REQUEST", generateTestSampleReport);
}
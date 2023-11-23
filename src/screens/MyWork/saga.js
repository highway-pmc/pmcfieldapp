
import { put, takeLatest } from 'redux-saga/effects';
import { getMyWorksData } from '../../services/my-works/myworks.service';
import { fillRFIsDataChecklist, getRFIDataByWaId } from '../../services/rfi/rfis.service';

function* getMyWorks({ payload }) {
    try {
        const response = yield (getMyWorksData(payload.projectId, payload.projectType));
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

export default function* myWorksScreenSaga() {
    yield takeLatest("GET_MY_WORKS_REQUEST", getMyWorks);
    yield takeLatest("GET_RFI_BY_WA_ID_REQUEST", getRFIByWaId);
    yield takeLatest("FILL_RFI_CHECK_LIST_REQUEST", fillRFIsChecklist);
}
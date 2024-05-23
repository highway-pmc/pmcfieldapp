import { put, takeLatest } from 'redux-saga/effects';
import { generateRFIReportApi, getRFIsReports } from '../../services/rfi/rfis.service';

function* getRFIsReportsData({ payload }) {
    try {
        const response = yield (getRFIsReports(payload.projectId));
        yield put({ type: "GET_RFI_REPORTS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_RFI_REPORTS_FAILURE", error: error.message });
    }
}

function* downloadRFIReport({ payload }) {
    try {
        console.log('=====================================1')
        const response = yield (generateRFIReportApi(payload.projectId, payload.projectModuleId, payload.rfiId));
        console.log('=====================================3')
        yield put({ type: "DOWNLOAD_REPORT_SUCCESS", response });
    } catch (error) {
        console.log('=====================================2')
        yield put({ type: "DOWNLOAD_REPORT_FAILURE", error: error.message });
    }
}

export default function* myReportsScreenSaga() {
    yield takeLatest("GET_RFI_REPORTS_REQUEST", getRFIsReportsData);
    yield takeLatest("DOWNLOAD_REPORT_REQUEST", downloadRFIReport);
}
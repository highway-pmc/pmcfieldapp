import {put, takeLatest} from 'redux-saga/effects';
import {
  fillRFIsDataChecklist,
  fillTestRFIsDataChecklist,
  generateRFI,
  generateRFIReportApi,
  generateTestSampleReportApi,
  getQualityMasterApi,
  getMixDesignApi,
  getRFITaskUsersData,
  getRFITasksData,
  getRFIs,
  getTestRFIs,
  postLabTestRFI,
} from '../../services/rfi/rfis.service';

function* getRFITasks({payload}) {
  try {
    const response = yield getRFITasksData(
      payload.projectId,
      payload.userCategory,
      payload.level,
    );
    yield put({type: 'GET_RFI_TASKS_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_RFI_TASKS_FAILURE', error: error.message});
  }
}

function* getRFITaskUsers({payload}) {
  try {
    const response = yield getRFITaskUsersData(
      payload.projectId,
      payload.projectModuleId,
      payload.userCategory,
      payload.taskId,
    );
    yield put({type: 'GET_RFI_TASK_USERS_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_RFI_TASK_USERS_FAILURE', error: error.message});
  }
}

function* generateRFITask({payload}) {
  try {
    const response = yield generateRFI(
      payload.projectId,
      payload.projectModuleId,
      payload.userCategory,
      payload.body,
    );
    yield put({type: 'GENERATE_RFI_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GENERATE_RFI_FAILURE', error: error.message});
  }
}

function* getRFIData({payload}) {
  try {
    const response = yield getRFIs(payload.projectId, payload.status);
    yield put({type: 'GET_RFI_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_RFI_FAILURE', error: error.message});
  }
}

function* getTestRFIData({payload}) {
  try {
    const response = yield getTestRFIs(payload.projectId, payload.status);
    yield put({type: 'GET_TEST_RFI_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_TEST_RFI_FAILURE', error: error.message});
  }
}

function* updateRFIs({payload}) {
  try {
    const response = yield fillRFIsDataChecklist(
      payload.projectId,
      payload.projectModuleId,
      payload.rfiId,
      payload.status,
      payload.body,
    );
    yield put({type: 'UPDATE_RFI_SUCCESS', response});
  } catch (error) {
    yield put({type: 'UPDATE_RFI_FAILURE', error: error.message});
  }
}

function* updateTestRFIs({payload}) {
  try {
    const response = yield fillTestRFIsDataChecklist(
      payload.projectId,
      payload.rfiId,
      payload.status,
      payload.body,
    );
    yield put({type: 'UPDATE_TEST_RFI_SUCCESS', response});
  } catch (error) {
    yield put({type: 'UPDATE_TEST_RFI_FAILURE', error: error.message});
  }
}

function* generateRFIReport({payload}) {
  try {
    const response = yield generateRFIReportApi(
      payload.projectId,
      payload.projectModuleId,
      payload.rfiId,
    );
    yield put({type: 'GENERATE_REPORT_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GENERATE_REPORT_FAILURE', error: error.message});
  }
}

function* generateTestRFIReport({payload}) {
  try {
    const response = yield generateTestSampleReportApi(
      payload.projectId,
      payload.rfiId,
    );
    yield put({type: 'GENERATE_TEST_REPORT_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GENERATE_TEST_REPORT_FAILURE', error: error.message});
  }
}

function* generateLabTestRFIReport({payload}) {
  try {
    const response = yield postLabTestRFI(
      payload.projectId,
      payload.testType,
      payload.body,
    );
    yield put({type: 'GENERATE_LAB_TEST_RFI_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GENERATE_LAB_TEST_RFI_FAILURE', error: error.message});
  }
}

function* getQualityMaster({payload}) {
  try {
    const response = yield getQualityMasterApi(payload.testType);
    yield put({type: 'GET_QUALITY_MASTER_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_QUALITY_MASTER_FAILURE', error: error.message});
  }
}

function* getMixDesign({payload}) {
  try {
    const response = yield getMixDesignApi(
      payload.testWorkCategoryId,
      payload.testWorkCategorytype,
      payload.materialTypeId
    );
    yield put({type: 'GET_MIX_DESIGN_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_MIX_DESIGN_FAILURE', error: error.message});
  }
}

export default function* myRFISScreenSaga() {
  yield takeLatest('GET_RFI_TASKS_REQUEST', getRFITasks);
  yield takeLatest('GET_RFI_TASK_USERS_REQUEST', getRFITaskUsers);
  yield takeLatest('GENERATE_RFI_REQUEST', generateRFITask);
  yield takeLatest('GET_RFI_REQUEST', getRFIData);
  yield takeLatest('GET_TEST_RFI_REQUEST', getTestRFIData);
  yield takeLatest('UPDATE_RFI_REQUEST', updateRFIs);
  yield takeLatest('UPDATE_TEST_RFI_REQUEST', updateTestRFIs);
  yield takeLatest('GENERATE_REPORT_REQUEST', generateRFIReport);
  yield takeLatest('GENERATE_TEST_REPORT_REQUEST', generateTestRFIReport);
  yield takeLatest('GENERATE_LAB_TEST_RFI_REQUEST', generateLabTestRFIReport);
  yield takeLatest('GET_QUALITY_MASTER_REQUEST', getQualityMaster);
  yield takeLatest('GET_MIX_DESIGN_REQUEST', getMixDesign);
}

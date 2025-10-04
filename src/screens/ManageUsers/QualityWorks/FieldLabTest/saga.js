import {put, takeLatest, all} from 'redux-saga/effects'; 
import {
  getFormDetailsTab1Api, 
  getInspectionChecklistApi, 
} from '../../../../services/testDetail/testDetail.service'; 
function* getTestDetailsTab1({payload}) {
  try {
    const response = yield getFormDetailsTab1Api(
      payload.projectId,
      payload.testWorkCategoryType,
      payload.materialType,
      payload.testType,
      payload.subTestTypes,
    );
    yield put({type: 'GET_TEST_DETAILS_TAB1_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_TEST_DETAILS_TAB1_FAILURE',
      error: error.message,
    });
  }
}

// NEW Worker Saga
function* getInspectionChecklist({payload}) {
  try {
    const response = yield getInspectionChecklistApi(
      payload.projectId,
      payload.checklistName,
    );
    yield put({type: 'GET_INSPECTION_CHECKLIST_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_INSPECTION_CHECKLIST_FAILURE',
      error: error.message,
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest('GET_TEST_DETAILS_TAB1_REQUEST', getTestDetailsTab1),
    takeLatest('GET_INSPECTION_CHECKLIST_REQUEST', getInspectionChecklist),
  ]);
}

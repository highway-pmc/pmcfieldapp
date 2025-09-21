import {put, takeLatest} from 'redux-saga/effects';
import {getFormDetailsTab1Api} from '../../../../services/testDetail/testDetail.service';

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

export default function* testDetailMappingSaga() {
  yield takeLatest('GET_TEST_DETAILS_TAB1_REQUEST', getTestDetailsTab1);
}

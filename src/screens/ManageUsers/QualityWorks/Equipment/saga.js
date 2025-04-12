import {put, takeLatest} from 'redux-saga/effects';
import {
  getEquipmentCalibrationDataApi,
  saveEquipmentCalibrationFormInfoApi,
  getEquipmentCalibrationListInfoApi,
} from '../../services/equipment/equipment.service';

function* getEquipmentCalibrationData() {
  try {
    const response = yield getEquipmentCalibrationDataApi();
    yield put({type: 'GET_MIX_DESIGN_FORM_INFO_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_MIX_DESIGN_FORM_INFO_FAILURE', error: error.message});
  }
}
function* getEquipmentCalibrationListInfo({payload}) {
  try {
    const response = yield getEquipmentCalibrationListInfoApi(
      payload.projectId,
      payload.testWorkCategoryType,
      payload.testEquipmentTypeId,
    );
    yield put({type: 'GET_EQUIPMENTS_CALIBRATION_DATA_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_EQUIPMENTS_CALIBRATION_DATA_FAILURE',
      error: error.message,
    });
  }
}
function* saveMixDesignFormInfo({payload}) {
  try {
    const response = yield saveEquipmentCalibrationFormInfoApi(
      payload.projectId,
      payload.testWorkCategoryType,
      payload.testEquipmentTypeId,
      payload.body,
    );
    yield put({
      type: 'SAVE_EQUIPMENTS_CALIBRATION_FORM_INFO_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'SAVE_EQUIPMENTS_CALIBRATION_FORM_INFO_FAILURE',
      error: error.message,
    });
  }
}

export default function* myRFISScreenSaga() {
  yield takeLatest(
    'GET_EQUIPMENTS_CALIBRATION_LISTING_REQUEST',
    getEquipmentCalibrationListInfo,
  );
  yield takeLatest(
    'GET_EQUIPMENTS_CALIBRATION_DATA_REQUEST',
    getEquipmentCalibrationData,
  );
  yield takeLatest(
    'SAVE_EQUIPMENTS_CALIBRATION_FORM_INFO_REQUEST',
    saveMixDesignFormInfo,
  );
}

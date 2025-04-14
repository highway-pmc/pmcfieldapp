import {put, takeLatest} from 'redux-saga/effects';
import {
  getEquipmentsDataApi,
  getEquipmentMasterDataApi,
  saveEquipmentCalibrationFormInfoApi,
  getEquipmentCalibrationListInfoApi,
  saveEquipmentFormInfoApi,
} from '../../../../services/equipment/equipment.service';

function* getEquipmentMasterData() {
  try {
    const response = yield getEquipmentMasterDataApi();
    yield put({type: 'GET_EQUIPMENTS_MASTER_DATA_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_EQUIPMENTS_MASTER_DATA_FAILURE',
      error: error.message,
    });
  }
}
function* getEquipmentCalibrationListInfo({payload}) {
  try {
    const response = yield getEquipmentCalibrationListInfoApi(
      payload.projectId,
      payload.testWorkCategoryType,
      payload.testEquipmentTypeId,
    );
    yield put({type: 'GET_EQUIPMENTS_CALIBRATION_LISTING_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_EQUIPMENTS_CALIBRATION_LISTING_FAILURE',
      error: error.message,
    });
  }
}
function* getEquipmentsListData({payload}) {
  try {
    const response = yield getEquipmentsDataApi(
      payload.projectId,
      payload.testWorkCategoryType,
    );
    yield put({type: 'GET_EQUIPMENTS_CALIBRATION_LISTING_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_EQUIPMENTS_CALIBRATION_LISTING_FAILURE',
      error: error.message,
    });
  }
}
function* saveEquipmentCalibrationFormInfo({payload}) {
  try {
    const response = yield saveEquipmentCalibrationFormInfoApi(
      payload.projectId,
      payload.testEquipmentId,
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

function* saveEquipmentFormInfo({payload}) {
  try {
    const response = yield saveEquipmentFormInfoApi(
      payload.projectId,
      payload.testWorkCategoryType,
      payload.testEquipmentTypeId,
      payload.body,
    );
    yield put({
      type: 'SAVE_EQUIPMENTS_FORM_INFO_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'SAVE_EQUIPMENTS_FORM_INFO_FAILURE',
      error: error.message,
    });
  }
}

export default function* equipmentCalibrationScreenSaga() {
  yield takeLatest(
    'GET_EQUIPMENTS_CALIBRATION_LISTING_REQUEST',
    getEquipmentCalibrationListInfo,
  );
  yield takeLatest(
    'GET_EQUIPMENTS_MASTER_DATA_REQUEST',
    getEquipmentMasterData,
  );
  yield takeLatest(
    'SAVE_EQUIPMENTS_CALIBRATION_FORM_INFO_REQUEST',
    saveEquipmentCalibrationFormInfo,
  );
  yield takeLatest('GET_EQUIPMENTS_LIST_DATA_REQUEST', getEquipmentsListData);
  yield takeLatest('SAVE_EQUIPMENTS_FORM_INFO_REQUEST', saveEquipmentFormInfo);
}

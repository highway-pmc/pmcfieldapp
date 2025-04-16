import {put, takeLatest} from 'redux-saga/effects';
import {
  getEquipmentsDataApi,
  getEquipmentMasterDataApi,
  saveEquipmentCalibrationFormInfoApi,
  getEquipmentCalibrationListInfoApi,
  saveEquipmentFormInfoApi,
  deleteEquipmentCalibrationFormInfoApi,
  deleteEquipmentFormInfoApi,
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
    const response = yield getEquipmentsDataApi(payload.projectId);
    yield put({type: 'GET_EQUIPMENTS_LIST_DATA_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_EQUIPMENTS_LIST_DATA_FAILURE',
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


function* deleteEquipmentCalibrationInfo({payload}) {
  try {
    const response = yield deleteEquipmentCalibrationFormInfoApi(
      payload.projectId,
      payload.testEquipmentId,
      payload.testEquipmentCalibrationId,
    );
    yield put({
      type: 'DELETE_EQUIPMENT_CALIBRATION_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'DELETE_EQUIPMENT_CALIBRATION_FAILURE',
      error: error.message,
    });
  }
}

function* deleteEquipmentInfo({payload}) {
  try {
    const response = yield deleteEquipmentFormInfoApi(
      payload.projectId,
      payload.testEquipmentId,
    );
    yield put({
      type: 'DELETE_EQUIPMENT_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'DELETE_EQUIPMENT_FAILURE',
      error: error.message,
    });
  }
}
function* editEquipmentsCalibrationInfo({payload}) {
  try {
    const response = yield editEquipmentCalibrationFormInfoApi(
      payload.projectId,
      payload.testEquipmentId,
      payload.testEquipmentCalibrationId,
      payload.body,
    );
    yield put({
      type: 'EDIT_EQUIPMENTS_CALIBRATION_FORM_INFO_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'EDIT_EQUIPMENTS_CALIBRATION_FORM_INFO_FAILURE',
      error: error.message,
    });
  }
}

function* editEquipmentsInfo({payload}) {
  try {
    const response = yield editEquipmentFormInfoApi(
      payload.projectId,
      payload.testEquipmentCategory,
      payload.testEquipmentTypeId,
      payload.testEquipmentId,
      payload.body,
    );
    yield put({
      type: 'EDIT_EQUIPMENTS_FORM_INFO_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'EDIT_EQUIPMENTS_FORM_INFO_FAILURE',
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
  yield takeLatest(
    'DELETE_EQUIPMENT_CALIBRATION_REQUEST',
    deleteEquipmentCalibrationInfo,
  );
  yield takeLatest('DELETE_EQUIPMENT_REQUEST', deleteEquipmentInfo);
  yield takeEvery('EDIT_EQUIPMENTS_CALIBRATION_FORM_INFO_REQUEST', editEquipmentsCalibrationInfo);
  yield takeEvery('EDIT_EQUIPMENTS_FORM_INFO_REQUEST', editEquipmentsInfo);
}

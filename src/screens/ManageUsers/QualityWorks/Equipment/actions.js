export const getEquipmentsCalibrationListing = payload => ({
  type: 'GET_EQUIPMENTS_CALIBRATION_LISTING_REQUEST',
  payload: payload,
});

export const getEquipmentsMasterData = payload => ({
  type: 'GET_EQUIPMENTS_MASTER_DATA_REQUEST',
  payload: payload,
});
export const getEquipmentsListData = payload => ({
  type: 'GET_EQUIPMENTS_LIST_DATA_REQUEST',
  payload: payload,
});

export const saveEquipmentsCalibrationInfo = payload => ({
  type: 'SAVE_EQUIPMENTS_CALIBRATION_FORM_INFO_REQUEST',
  payload: payload,
});
export const saveEquipmentsInfo = payload => ({
  type: 'SAVE_EQUIPMENTS_FORM_INFO_REQUEST',
  payload: payload,
});

export const clearEquipmentData = () => ({
  type: 'CLEAR_EQUIPMENTS_FORM_DATA_REQUEST'
});

export const deleteEquipmentCalibration = payload => ({
  type: 'DELETE_EQUIPMENT_CALIBRATION_REQUEST',
  payload: payload,
});

export const deleteEquipment = payload => ({
  type: 'DELETE_EQUIPMENT_REQUEST',
  payload: payload,
});

export const editEquipmentsCalibration = payload => ({
  type: 'EDIT_EQUIPMENTS_CALIBRATION_FORM_INFO_REQUEST',
  payload: payload,
});

export const editEquipmentsInfo = payload => ({
  type: 'EDIT_EQUIPMENTS_FORM_INFO_REQUEST',
  payload: payload,
});

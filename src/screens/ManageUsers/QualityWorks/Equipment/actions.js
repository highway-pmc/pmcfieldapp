export const getEquipmentsCalibrationListing = payload => ({
  type: 'GET_EQUIPMENTS_CALIBRATION_LISTING_INFO_REQUEST',
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

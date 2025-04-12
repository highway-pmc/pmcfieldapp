export const getEquipmentsCalibrationListing = payload => ({
  type: 'GET_EQUIPMENTS_CALIBRATION_LISTING_INFO_REQUEST',
  payload: payload,
});

export const getEquipmentsCalibrationData = payload => ({
  type: 'GET_EQUIPMENTS_CALIBRATION_DATA_REQUEST',
  payload: payload,
});

export const saveEquipmentsCalibrationdInfo = payload => ({
  type: 'SAVE_EQUIPMENTS_CALIBRATION_INFO_REQUEST',
  payload: payload,
});

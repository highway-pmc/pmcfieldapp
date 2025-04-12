import apiService from '../api.service';

export const getEquipmentCalibrationDataApi = async () => {
  return apiService
    .getRequest(`/v1/auth/equipmentmasterdata?type=equipment-calibration`)
    .then(response => {
      console.log('response', response);
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get Quality Master.';
      throw new Error(errorMessge);
    });
};

export const saveEquipmentCalibrationFormInfoApi = async (
  projectId,
  testWorkCategoryType,
  testEquipmentTypeId,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/test-equipment-category/${testWorkCategoryType}/test-equipment/${testEquipmentTypeId}/equipment-calibration`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to save Mix design.';
      throw new Error(errorMessge);
    });
};

export const getEquipmentCalibrationListInfoApi = async (
  projectId,
  testWorkCategoryType,
  testEquipmentTypeId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-equipment/${testEquipmentTypeId}//equipment-calibrations`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get Quality Master.';
      throw new Error(errorMessge);
    });
};

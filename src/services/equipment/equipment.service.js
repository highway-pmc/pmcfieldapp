import apiService from '../api.service';

export const getEquipmentMasterDataApi = async () => {
  return apiService
    .getRequest(`v1/auth/equipmentmasterdata?type=equipments`)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get Quality Master.';
      throw new Error(errorMessge);
    });
};

export const getEquipmentsDataApi = async (projectId, testWorkCategoryType) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-equipment-category/${testWorkCategoryType}/test-equipment-type/NA/equipments`,
    )
    .then(response => {
      console.log('response ===== API ======', response);
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get Equipments Data.';
      throw new Error(errorMessge);
    });
};
export const saveEquipmentCalibrationFormInfoApi = async (
  projectId,
  testEquipmentId,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/equipments/${testEquipmentId}/equipment-calibrations`,
      body,
    )
    .then(response => {
      console.log('=======>', response);
      return response;
    })
    .catch(err => {
      console.log('=======>', errorMessge);
      const errorMessge = err.message || 'Unable to save Mix design.';
      throw new Error(errorMessge);
    });
};
export const saveEquipmentFormInfoApi = async (
  projectId,
  testEquipmentCategory,
  testEquipmentTypeId,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/test-equipment-category/${testEquipmentCategory}/test-equipment-type/${testEquipmentTypeId}/equipments`,
      body,
    )

    .then(response => {
      console.log('response', response);
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
      `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-equipment/${testEquipmentTypeId}/equipment-calibrations`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get Quality Master.';
      throw new Error(errorMessge);
    });
};

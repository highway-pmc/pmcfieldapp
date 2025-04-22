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

export const getEquipmentsDataApi = async projectId => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-equipment-category/NA/test-equipment-type/NA/equipments`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get Equipments Data.';
      throw new Error(errorMessge);
    });
};

export const generateEquipmentReportApi = async (
  projectId,
  testEquipmentId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/equipments/${testEquipmentId}/report`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to generate Equipment Report.';
      throw new Error(errorMessge);
    });
};

export const generateEquipmentCalibrationReportApi = async (
  projectId,
  testEquipmentId,
  testEquipmentCalibrationId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/equipments/${testEquipmentId}/equipment-calibrations/${testEquipmentCalibrationId}/report`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to generate Equipment Calibration Report.';
      throw new Error(errorMessge);
    });
};

export const editEquipmentCalibrationFormInfoApi = async (
  projectId,
  testEquipmentId,
  testEquipmentCalibrationId,
  body,
) => {
  return apiService
    .putRequest(
      `v1/auth/projects/${projectId}/equipments/${testEquipmentId}/equipment-calibrations/${testEquipmentCalibrationId}`,
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
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to save Mix design.';
      throw new Error(errorMessge);
    });
};

export const deleteEquipmentCalibrationFormInfoApi = async (
  projectId,
  testEquipmentId,
  testEquipmentCalibrationId,
) => {
  return apiService
    .deleteRequest(
      `v1/auth/projects/${projectId}/equipments/${testEquipmentId}/equipment-calibrations/${testEquipmentCalibrationId}`,
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

export const editEquipmentFormInfoApi = async (
  projectId,
  testEquipmentCategory,
  testEquipmentTypeId,
  testEquipmentId,
  body,
) => {
  console.log(
    'API Path:',
    `v1/auth/projects/${projectId}/test-equipment-category/${testEquipmentCategory}/test-equipment-type/${testEquipmentTypeId}/equipments/${testEquipmentId}`,
  );
  return apiService
    .putRequest(
      `v1/auth/projects/${projectId}/test-equipment-category/${testEquipmentCategory}/test-equipment-type/${testEquipmentTypeId}/equipments/${testEquipmentId}`,
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

export const deleteEquipmentFormInfoApi = async (
  projectId,
  testEquipmentId,
) => {
  return apiService
    .deleteRequest(
      `v1/auth/projects/${projectId}/equipments/${testEquipmentId}`,
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

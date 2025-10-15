import apiService from '../api.service';

export const getFormDetailsTab1Api = async (
  projectId,
  testWorkCategoryType,
  materialType,
  testType,
  subTestTypes,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-form/tab1/render?testWorkCategoryType=${testWorkCategoryType}&materialType=${materialType}&testType=${testType}&subTestTypes=${subTestTypes}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessage =
        err.message || 'Unable to get Test Detail Form details.';
      throw new Error(errorMessage);
    });
};

export const getInspectionChecklistApi = async (
  projectId,
  checklistName,
  rfiId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/my-work-task-form/inspection-checklist?name=${checklistName}&rfiId=${rfiId}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessage =
        err.message || 'Unable to get Inspection Checklist details.';
      throw new Error(errorMessage);
    });
};

export const saveRfiFormDataApi = async (projectId, rfiId, formData) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/my-work-task-form/${rfiId}/save-data`,
      formData,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessage =
        err.message || 'Unable to save RFI form data to metadata.';
      throw new Error(errorMessage);
    });
};

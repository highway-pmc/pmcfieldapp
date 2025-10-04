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

export const getInspectionChecklistApi = async (projectId, checklistName) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/my-work-task-form/inspection-checklist?name=${checklistName}`,
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
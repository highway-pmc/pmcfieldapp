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

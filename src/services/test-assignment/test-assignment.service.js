import apiService from '../api.service';

export const getTestClassificationData = async (projectId, workType) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-classification?workType=${
        workType || ''
      }`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of Test classifications.';
      throw new Error(errorMessge);
    });
};

export const getTestWorkCategoryData = async (
  projectId,
  testClassificationId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-classification/${testClassificationId}/test-work-category`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of Test work category.';
      throw new Error(errorMessge);
    });
};

export const getTestMaterialsData = async (
  projectId,
  testClassificationId,
  testWorkCategoryId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-classification/${testClassificationId}/test-work-category/${testWorkCategoryId}/test-materials`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of project module Test Materials.';
      throw new Error(errorMessge);
    });
};

export const getTestTypesData = async (
  projectId,
  testClassificationId,
  testWorkCategoryId,
  testMaterialId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-classification/${testClassificationId}/test-work-category/${testWorkCategoryId}/test-materials/${testMaterialId}/testtype`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get list of Test Types.';
      throw new Error(errorMessge);
    });
};

export const getTestClassificationNextLevelData = async (
  projectId,
  testClassificationId,
  id,
  type,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-classification/${testClassificationId}/id/${id}/type/${type}/next-level`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to find next level of Test classification.';
      throw new Error(errorMessge);
    });
};

export const getUsersForTestAssignmentData = async (projectId, workType) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/users/${workType}/test-assignment`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get list of users.';
      throw new Error(errorMessge);
    });
};

export const testClassificationsTestAssignToUsersApi = async (
  projectId,
  testClassificationId,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/test-classification/${testClassificationId}/test-assignment`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign tests to users.';
      throw new Error(errorMessge);
    });
};

export const testWorkCategoryTestAssignToUsersApi = async (
  projectId,
  testClassificationId,
  testWorkCategoryId,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/test-classification/${testClassificationId}/test-work-category/${testWorkCategoryId}/test-assignment`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign tests to users.';
      throw new Error(errorMessge);
    });
};

export const testMaterialsTestAssignToUsersApi = async (
  projectId,
  testClassificationId,
  testWorkCategoryId,
  testMaterialId,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/test-classification/${testClassificationId}/test-work-category/${testWorkCategoryId}/test-materials/${testMaterialId}/test-assignment`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign tests to users.';
      throw new Error(errorMessge);
    });
};

export const testTypesAssignToUsersApi = async (
  projectId,
  testClassificationId,
  testWorkCategoryId,
  testMaterialId,
  testTypeId,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/test-classification/${testClassificationId}/test-work-category/${testWorkCategoryId}/test-materials/${testMaterialId}/testtype/${testTypeId}/test-assignment`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign tests to users.';
      throw new Error(errorMessge);
    });
};

export const getTestRfisFormsData = async (projectId, testRfiId) => {
  return apiService
    .getRequest(`v1/auth/projects/${projectId}/test-rfis/${testRfiId}/forms`)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get test rfis forms.';
      throw new Error(errorMessge);
    });
};

export const saveOrSubmitTestRfisFormsData = async (
  projectId,
  testRfiId,
  action,
  formData,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/quality-works/${testRfiId}/save-data`,
      {
        action,
        formData,
      },
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessage = err.message || `Unable to ${action} test rfis form.`;
      throw new Error(errorMessage);
    });
};

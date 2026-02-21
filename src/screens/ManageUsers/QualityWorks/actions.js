export const getUserCategories = () => ({
  type: 'GET_USER_CATEGORY_REQUEST',
});

export const getUsers = () => ({
  type: 'GET_USER_ASSIGNMENT_REQUEST',
});

export const clearUserAssignment = () => ({
  type: 'CLEAR_USER_ASSIGNMENT',
});

export const getTestClassifications = payload => ({
  type: 'GET_TEST_CLASSIFICATION_REQUEST',
  payload: payload,
});

export const getTestWorkCategory = payload => ({
  type: 'GET_TEST_WORK_CATEGORY_REQUEST',
  payload: payload,
});

export const getTestMaterials = payload => ({
  type: 'GET_TEST_MATERIALS_REQUEST',
  payload: payload,
});

export const getTestType = payload => ({
  type: 'GET_TEST_TYPE_REQUEST',
  payload: payload,
});

export const getTestClassificationNextLevel = payload => ({
  type: 'GET_TEST_CLASSIFICATION_NEXT_LEVEL_REQUEST',
  payload: payload,
});

export const getUsersForTestAssignment = payload => ({
  type: 'GET_USERS_TO_TEST_ASSIGNMENT_REQUEST',
  payload: payload,
});

export const testClassificationsTestAssignToUsers = payload => ({
  type: 'TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const testWorkCategoryTestAssignToUsers = payload => ({
  type: 'TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const testMaterialsTestAssignToUsers = payload => ({
  type: 'TEST_MATERIALS_TEST_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const testTypesAssignToUsers = payload => ({
  type: 'TEST_TYPES_TEST_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const getTestRfisForms = payload => ({
  type: 'GET_TEST_RFIS_FORMS_REQUEST',
  payload: payload,
});

export const saveOrSubmitTestRfisForm = payload => ({
  type:
    payload.action === 'save'
      ? 'SAVE_TEST_RFIS_FORMS_REQUEST'
      : 'SUBMIT_TEST_RFIS_FORMS_REQUEST',
  payload: payload,
});

export const clearTestAssignmentData = () => ({
  type: 'CLEAR_TEST_ASSIGNMENT',
});

export const clearTestClassificationsAssignmentData = () => ({
  type: 'CLEAR_TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS',
});

export const clearNextLevel = () => ({
  type: 'CLEAR_NEXT_LEVEL',
});

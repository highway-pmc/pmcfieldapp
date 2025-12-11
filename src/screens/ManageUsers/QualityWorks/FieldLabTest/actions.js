export const getTestDetailsTab1 = payload => ({
  type: 'GET_TEST_DETAILS_TAB1_REQUEST',
  payload: payload,
});

export const getInspectionChecklist = payload => ({
  type: 'GET_INSPECTION_CHECKLIST_REQUEST',
  payload: payload, // Expected: { projectId, checklistName }
});

export const clearFormDetails = () => ({
  type: 'CLEAR_FORM_DETAILS',
});

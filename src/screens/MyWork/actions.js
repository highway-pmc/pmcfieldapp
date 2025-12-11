export const getMyWorks = (payload) => ({
    type: "GET_MY_WORKS_REQUEST",
    payload: payload
});

export const getRFIByWaId = (payload) => ({
    type: "GET_RFI_BY_WA_ID_REQUEST",
    payload: payload
});

export const fillRFIsChecklist = (payload) => ({
    type: "FILL_RFI_CHECK_LIST_REQUEST",
    payload: payload
});

export const getMyTests = (payload) => ({
    type: "GET_MY_TESTS_REQUEST",
    payload: payload
});

export const updateTestSample = (payload) => ({
    type: "UPDATE_TEST_SAMPLE_REQUEST",
    payload: payload
});

export const generateTestSampleReport = (payload) => ({
    type: "GENERATE_TEST_SAMPLE_REPORT_REQUEST",
    payload: payload
});

export const clearMyWorksEvent = () => ({
    type: "CLEAR_MY_WORKS"
});

export const fillRFIsChecklistForTestSample = (payload) => ({
    type: "TEST_SAMPLE_FILL_RFI_CHECK_LIST_REQUEST",
    payload: payload
});
export const getInspectionChecklist = payload => ({
  type: 'GET_INSPECTION_CHECKLIST_REQUEST',
  payload: payload, 
});
export const saveRfiFormData = payload => ({
  type: 'SAVE_RFI_FORM_DATA_REQUEST',
  payload: payload,
});
export const clearFormDetails = () => ({
  type: 'CLEAR_FORM_DETAILS',
});
export const saveRfiFormDataClear = () => ({
  type: 'SAVE_RFI_FORM_DATA_CLEAR',
});
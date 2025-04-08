export const getRFITasks = (payload) => ({
    type: "GET_RFI_TASKS_REQUEST",
    payload: payload
});

export const getRFITaskUsers = (payload) => ({
    type: "GET_RFI_TASK_USERS_REQUEST",
    payload: payload
});

export const actionGenerateRFI = (payload) => ({
    type: "GENERATE_RFI_REQUEST",
    payload: payload
});

export const actionGetRFIs = (payload) => ({
    type: "GET_RFI_REQUEST",
    payload: payload
});

export const actionGetTestRFIs = (payload) => ({
    type: "GET_TEST_RFI_REQUEST",
    payload: payload
});

export const updatedRFIs = (payload) => ({
    type: "UPDATE_RFI_REQUEST",
    payload: payload
});

export const updatedTestRFIs = (payload) => ({
    type: "UPDATE_TEST_RFI_REQUEST",
    payload: payload
});

export const generateRFIReport = (payload) => ({
    type: "GENERATE_REPORT_REQUEST",
    payload: payload
});

export const generateTestRFIReport = (payload) => ({
    type: "GENERATE_TEST_REPORT_REQUEST",
    payload: payload
});

export const clearRFITasksEvent = () => ({
    type: "CLEAR_RFI_REQUEST"
});

export const generateLABTestRFIReport = (payload) => ({
    type: "GENERATE_LAB_TEST_RFI_REQUEST",
    payload: payload
});

export const getQualityMasterList = (payload) => ({
    type: "GET_QUALITY_MASTER_REQUEST",
    payload: payload
});
export const getMixDesignList = (payload) => ({
    type: "GET_MIX_DESIGN_REQUEST",
    payload: payload
});
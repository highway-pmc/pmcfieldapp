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

export const clearRFITasksEvent = () => ({
    type: "CLEAR_RFI_REQUEST"
});
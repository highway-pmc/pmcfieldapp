export const getRFITasks = (payload) => ({
    type: "GET_RFI_TASKS_REQUEST",
    payload: payload
});

export const getRFITaskUsers = (payload) => ({
    type: "GET_RFI_TASK_USERS_REQUEST",
    payload: payload
});

export const clearRFITasksEvent = () => ({
    type: "CLEAR_RFI_REQUEST"
});
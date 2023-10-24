export const getProjectModules = (payload) => ({
    type: "GET_PROJECT_MODULES_REQUEST",
    payload: payload,
});

export const getProjectModuleSegments = (payload) => ({
    type: "GET_PROJECT_MODULE_SEGMENTS_REQUEST",
    payload: payload,
});

export const getProjectModuleSubSegments = (payload) => ({
    type: "GET_PROJECT_MODULE_SUB_SEGMENTS_REQUEST",
    payload: payload,
});

export const getProjectModuleTasks = (payload) => ({
    type: "GET_PROJECT_MODULE_TASKS_REQUEST",
    payload: payload,
});

export const getUsersForWorkAssignment = (payload) => ({
    type: "GET_USERS_MY_WORK_REQUEST",
    payload: payload,
});



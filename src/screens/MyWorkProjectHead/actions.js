export const getProjectModules = (payload) => ({
    type: "GET_PROJECT_MODULES_REQUEST",
    payload: payload,
});

export const getProjectModuleSegments = (payload) => ({
    type: "GET_PROJECT_MODULE_SEGMENTS_REQUEST",
    payload: payload,
});

export const getProjectModuleComponents = (payload) => ({
    type: "GET_PROJECT_MODULE_COMPONENTS_REQUEST",
    payload: payload,
});

export const getProjectModuleComponentTasks = (payload) => ({
    type: "GET_PROJECT_MODULE_COMPONENTS_TASKS_REQUEST",
    payload: payload,
});

export const getProjectModuleSubComponents = (payload) => ({
    type: "GET_PROJECT_MODULE_SUB_COMPONENTS_REQUEST",
    payload: payload,
});

export const getProjectModuleSegmentTasks = (payload) => ({
    type: "GET_PROJECT_MODULE_SEGMENT_TASKS_REQUEST",
    payload: payload,
});

export const getProjectModuleSubComponentTasks = (payload) => ({
    type: "GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_REQUEST",
    payload: payload,
});

export const getProjectModuleNextLevel = (payload) => ({
    type: "GET_PROJECT_MODULE_NEXT_LEVEL_REQUEST",
    payload: payload,
});

export const getUsersForWorkAssignment = (payload) => ({
    type: "GET_USERS_MY_WORK_REQUEST",
    payload: payload,
});



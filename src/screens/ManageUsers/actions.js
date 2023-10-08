export const getUserCategories = () => ({
    type: "GET_USER_CATEGORY_REQUEST"
});

export const getUsers = () => ({
    type: "GET_USER_ASSIGNMENT_REQUEST"
});

export const addUserCategories = (user) => ({
    type: "ADD_USER_ASSIGNMENT_REQUEST",
    payload: user,
});

export const clearUserAssignment = () => ({
    type: "CLEAR_USER_ASSIGNMENT"
});

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
    type: "GET_USERS_TO_WORK_ASSIGNMENT_REQUEST",
    payload: payload,
});

export const projectModulesWorkAssignToUsers = (payload) => ({
    type: "PROJECT_MODULE_WORK_ASSIGNMENT_USERS_REQUEST",
    payload: payload,
});

export const segmentWorkAssignToUsers = (payload) => ({
    type: "SEGMENT_WORK_ASSIGNMENT_USERS_REQUEST",
    payload: payload,
});

export const subSegmentWorkAssignToUsers = (payload) => ({
    type: "SUB_SEGMENT_WORK_ASSIGNMENT_USERS_REQUEST",
    payload: payload,
});

export const taskWorkAssignToUsers = (payload) => ({
    type: "TASK_WORK_ASSIGNMENT_USERS_REQUEST",
    payload: payload,
});

export const clearWorkAssignmentData = () => ({
    type: "CLEAR_WORK_ASSIGMENT"
});

export const clearProjectModulesWorkAssignmentData = () => ({
    type: "CLEAR_PROJECT_MODULE_WORK_ASSIGNMENT_USERS"
});


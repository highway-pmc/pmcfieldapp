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

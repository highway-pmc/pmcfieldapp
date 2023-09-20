export const getProjectInfo = (projectId) => ({
    type: "GET_PROJECT_INFO_REQUEST",
    payload: projectId
});

export const clearProjectInfoEvent = () => ({
    type: "CLEAR_PROJECT_INFO"
});
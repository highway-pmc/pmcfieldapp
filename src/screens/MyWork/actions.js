export const getMyWorks = (projectId) => ({
    type: "GET_MY_WORKS_REQUEST",
    payload: projectId
});

export const clearMyWorksEvent = () => ({
    type: "CLEAR_MY_WORKS"
});
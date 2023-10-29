export const getMyWorks = (payload) => ({
    type: "GET_MY_WORKS_REQUEST",
    payload: payload
});

export const clearMyWorksEvent = () => ({
    type: "CLEAR_MY_WORKS"
});
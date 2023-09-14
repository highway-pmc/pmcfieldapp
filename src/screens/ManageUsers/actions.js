export const getUsers = () => ({
    type: "GET_USER_ASSIGNMENT_REQUEST"
});

export const addUserCategories = (user) => ({
    type: "ADD_USER_ASSIGNMENT_REQUEST",
    payload: user,
});


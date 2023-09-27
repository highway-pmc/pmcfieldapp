export const getUserProfile = () => ({
    type: "GET_USER_PROFILE_REQUEST"
});

export const updateUserProfile = (user) => ({
    type: "UPDATE_USER_PROFILE_REQUEST",
    payload: user,
});

export const getStates = () => ({
    type: "GET_STATE_CITY_REQUEST"
});

export const clearUserProfile = () => ({
    type: "CLEAR_USER_PROFILE_DATA"
});

export const getUserProfile = () => ({
    type: "GET_USER_PROFILE_REQUEST"
});

export const updateUserProfile = (user) => ({
    type: "UPDATE_USER_PROFILE_REQUEST",
    payload: user,
});

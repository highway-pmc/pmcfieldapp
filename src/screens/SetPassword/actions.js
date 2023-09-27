export const changePassword = (password, newPassword) => ({
    type: "SET_PASSWORD_REQUEST",
    payload: {
        password: password,
        newPassword: newPassword
    },
});

export const clearUserProfile = () => ({
    type: "CLEAR_USER_PROFILE_DATA"
});

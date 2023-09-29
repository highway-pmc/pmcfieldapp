export const changePassword = (password, newPassword) => ({
    type: "CHANGE_PASSWORD_REQUEST",
    payload: {
        password: password,
        newPassword: newPassword
    },
});

export const clearUserProfile = () => ({
    type: "CLEAR_USER_PROFILE_DATA"
});

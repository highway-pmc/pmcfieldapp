export const changePassword = (password, newPassword) => ({
    type: "SET_PASSWORD_REQUEST",
    payload: {
        password: password,
        newPassword: newPassword
    },
});

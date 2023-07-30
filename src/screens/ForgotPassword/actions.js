export const forgotPassword = (email) => ({
    type: "FORGOT_PASS_REQUEST",
    payload: {
        email: email
    },
});
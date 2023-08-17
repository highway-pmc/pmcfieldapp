// export const Types = {
//     FORGOT_PASS_OTP_REQUEST: "FORGOT_PASS_OTP_REQUEST",

// }

export const forgotPassword = (email) => ({
    type: "FORGOT_PASS_OTP_REQUEST",
    payload: {
        email: email
    },
});

export const verifyEmail = (email, otp) => ({
    type: "VERIFY_OTP_REQUEST",
    payload: {
        email: email,
        otp: otp
    },
});

export const resetPassword = (email, otp, password) => ({
    type: "RESET_PASSWORD_REQUEST",
    payload: {
        email: email,
        otp: otp,
        password: password
    },
});
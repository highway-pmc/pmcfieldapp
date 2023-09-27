export const loginUser = (username, password, isPhone) => ({
    type: "LOGIN_REQUEST",
    payload: {
        username: username,
        password: password,
        isPhone: isPhone
    },
});

export const logoutUser = () => ({
    type: "LOGOUT_REQUEST",
});

export const clearForgotPasswordData = () => ({
    type: "CLEAR_FORGOT_PASSWORD_DATA",
});

export const clearUserProfileData = () => ({
    type: "CLEAR_USER_PROFILE_DATA",
});

export const clearUserAssignmentData = () => ({
    type: "CLEAR_USER_ASSIGNMENT",
});

export const clearProjectInfoData = () => ({
    type: "CLEAR_PROJECT_INFO",
});
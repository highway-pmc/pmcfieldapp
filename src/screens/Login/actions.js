export const loginUser = (username, password, isPhone) => ({
    type: "LOGIN_REQUEST",
    payload: {
        username: username,
        password: password,
        isPhone: isPhone
    },
});

export const logoutUser = () => ({
    type: "LOGOUT_REQUEST"
});
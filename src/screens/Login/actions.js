export const loginUser = (username, password) => ({
    type: "LOGIN_REQUEST",
    payload: {
        username: username,
        password: password
    },
});

export const logoutUser = () => ({
    type: "LOGOUT_REQUEST"
});
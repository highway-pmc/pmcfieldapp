const appConfig = {};

appConfig.setUserInfo = (userInfo) => {
    this.userInfo = userInfo;
}

appConfig.getUserInfo = () => {
    return this.userInfo || {};
}

appConfig.setToken = (token) => {
    this.token = token;
}

appConfig.getToken = () => {
    return this.token || {};
}

export default appConfig;
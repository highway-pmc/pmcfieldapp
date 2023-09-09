const appConfig = {};

//appConfig.API_URL = "https://api.highwaypmc.in"
// appConfig.LOGIN_API_URL = "https://client-auth.highwaypmc.in"
appConfig.API_URL = "http://192.168.1.4:4000"

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
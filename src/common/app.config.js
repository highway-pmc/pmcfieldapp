const appConfig = {};

//appConfig.API_URL = "https://api.highwaypmc.in"
//appConfig.API_URL = 'https://client-auth.highwaypmc.in';
//appConfig.API_URL = 'http://192.168.9.71:4000';
appConfig.API_URL = 'http://10.248.205.184:4000';
//appConfig.API_URL = 'http://10.200.8.184:4000';
appConfig.setUserInfo = userInfo => {
  this.userInfo = userInfo;
};

appConfig.getUserInfo = () => {
  return this.userInfo || {};
};

appConfig.setToken = token => {
  this.token = token;
};

appConfig.getToken = () => {
  return this.token || {};
};

export default appConfig;

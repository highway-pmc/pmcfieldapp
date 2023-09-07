import apiService from '../api.service';
import appConfig from '../../common/app.config';

export const userLogin = async (user) => {
  return apiService.postRequest('v1/login', {
    email: user.username,
    password: user.password
  }, false).then((response) => {
    appConfig.setToken(response.authToken);
    return apiService.getRequest('v1/auth/users/info').then((result) => {
      const userInfo = result;
      userInfo.authToken = response.authToken
      //userInfo.roles = "project-head"; // project-head, quality-head", "quality-users"
      //userInfo.isPasswordSet = false;
      appConfig.setUserInfo(userInfo);
      return userInfo;
    }).catch((error) => {
      throw new Error('Email/Mobile or Password is incorrect.');
    });
  }).catch((err) => {
    const errorMessge = err.message || 'Username/Mobile or Password is incorrect.';
    throw new Error(errorMessge);
  });
}
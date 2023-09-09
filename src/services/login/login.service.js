import apiService from '../api.service';
import appConfig from '../../common/app.config';

export const userLogin = async (payload) => {
  let _payload = {
    password: payload.password
  };
  if (payload.isPhone) {
    _payload.phone = payload.username;
  } else {
    _payload.email = payload.username;
  }
  return apiService.postRequest('v1/login', _payload, false).then((response) => {
    appConfig.setToken(response.authToken);
    return apiService.getRequest('v1/auth/users/info').then((result) => {
      const userInfo = result;
      userInfo.authToken = response.authToken
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
import apiService from '../api.service';
import appConfig from '../../common/app.config';

export const setPasswordApi = async (user) => {
    return apiService.patchRequest('v1/auth/users/changepassword', {
        password: user.password,
        newPassword: user.newPassword
    }).then((response) => {
        appConfig.setToken(response.authToken);
        return true;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to change your password.';
        throw new Error(errorMessge);
    });
}

export const getUserInfo = async (user) => {
    return apiService.getRequest('v1/auth/users/info').then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get user profile.';
        throw new Error(errorMessge);
    });
}

export const updateUserProfile = async (user) => {
    console.log("USER:", user);
    return apiService.putRequest('v1/auth/me', user).then((response) => {
        return response ? true : false;
    }).catch((err) => {
        const errorMessge = err.message || 'User profile updated successfully.';
        throw new Error(errorMessge);
    });
}
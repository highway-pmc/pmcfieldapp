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
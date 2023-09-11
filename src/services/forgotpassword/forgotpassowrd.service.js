import apiService from '../api.service';
import appConfig from '../../common/app.config';

export const sendOtpApi = async (user) => {
    return apiService.postRequest('v1/sendotp', {
        email: user.email
    }, false).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to send Otp';
        throw new Error(errorMessge);
    });
}

export const verifyOtpApi = async (user) => {
    return apiService.postRequest('v1/verifyemail', {
        email: user.email,
        otp: user.otp
    }, false).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to validate Otp.';
        throw new Error(errorMessge);
    });
}

export const resetPasswordApi = async (user) => {
    return apiService.patchRequest('v1/resetpassword', {
        email: user.email,
        otp: user.otp,
        password: user.password
    }, false).then((response) => {
        appConfig.setToken(response.authToken);
        return true;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to reset your password.';
        throw new Error(errorMessge);
    });
}

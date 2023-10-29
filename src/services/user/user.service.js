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

export const updateDeviceFCMToken = async (user) => {
    return apiService.patchRequest('v1/auth/users/fcmToken', {
        fcmToken: user.fcmToken,
    }).then((response) => {
        return true;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to update fcm token.';
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
    return apiService.putRequest('v1/auth/me', user).then((response) => {
        return response ? true : false;
    }).catch((err) => {
        const errorMessge = err.message || 'User profile updated successfully.';
        throw new Error(errorMessge);
    });
}

export const getStates = async () => {
    return apiService.getRequest('v1/state', false).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get states list.';
        throw new Error(errorMessge);
    });
}

export const getUserAssignment = async () => {
    return apiService.getRequest('v1/auth/users/assignment').then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of users to assign categories.';
        throw new Error(errorMessge);
    });
}

export const userCategoriesAssignment = async (userId, categories) => {
    return apiService.postRequest(`v1/auth/users/${userId}/assignment`, categories || []).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to assign user categories.';
        throw new Error(errorMessge);
    });
}

export const getUserCategory = async () => {
    return apiService.getRequest('v1/auth/users/category').then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list user category.';
        throw new Error(errorMessge);
    });
}
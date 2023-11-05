import apiService from '../api.service';

export const getRFITasksData = async (projectId, userCategory, assignmentLevel) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/users/${userCategory}/my-works/level/${assignmentLevel}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get RFI tasks.';
        throw new Error(errorMessge);
    });
}

export const getRFITaskUsersData = async (projectId, projectModuleId, userCategory, taskId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/user-category/${userCategory}/tasks/${taskId}/users`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get RFI task users.';
        throw new Error(errorMessge);
    });
}

export const generateRFI = async (projectId, projectModuleId, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/rfis`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to generate RFI.';
        throw new Error(errorMessge);
    });
}

export const getRFIs = async (projectId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/rfis`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get RFI.';
        throw new Error(errorMessge);
    });
}
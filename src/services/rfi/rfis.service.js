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

export const generateRFI = async (projectId, projectModuleId, userCategory, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/user-category/${userCategory}/rfis`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to generate RFI.';
        throw new Error(errorMessge);
    });
}

export const getRFIs = async (projectId, status) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/status/${status}/rfis`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get RFI.';
        throw new Error(errorMessge);
    });
}

export const getRFIDataByWaId = async (projectId, projectModuleId, waId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/wa/${waId}/rfi`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get RFI by waId.';
        throw new Error(errorMessge);
    });
}

export const fillRFIsDataChecklist = async (projectId, projectModuleId, rfiId, status, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/rfis/${rfiId}/status/${status}`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to save check list.';
        throw new Error(errorMessge);
    });
}

export const generateRFIReportApi = async (projectId, projectModuleId, rfiId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/rfis/${rfiId}/report`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to generate report.';
        throw new Error(errorMessge);
    });
}
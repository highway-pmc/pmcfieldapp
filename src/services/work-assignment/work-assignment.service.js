import apiService from '../api.service';

export const getProjectModulesData = async (projectId, projectType) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules?projectType=${projectType || ''}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of project modules.';
        throw new Error(errorMessge);
    });
}

export const getProjectModuleSegmentsData = async (projectId, projectModuleId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of project module segments.';
        throw new Error(errorMessge);
    });
}

export const getProjectModuleSubSegmentsData = async (projectId, projectModuleId, segmentId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/sub-segments`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of project module segments.';
        throw new Error(errorMessge);
    });
}
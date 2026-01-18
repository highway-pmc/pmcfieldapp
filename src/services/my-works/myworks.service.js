import apiService from '../api.service';

export const getMyWorksData = async (projectId, workType, taskCategory, level = 1, productModuleId = '', segmentId = '', componentId = '', subComponentId = '') => {
    console.log('API called with:', { projectId, workType, taskCategory, level, productModuleId, segmentId, componentId, subComponentId });
    console.log(`v1/auth/projects/${projectId}/users/${workType}/my-works?taskCategory=${taskCategory}&level=${level}&projectModuleId=${productModuleId}&segmentId=${segmentId}&componentId=${componentId}&subComponentId=${subComponentId}`);
    return apiService.getRequest(`v1/auth/projects/${projectId}/users/${workType}/my-works?taskCategory=${taskCategory}&level=${level}&projectModuleId=${productModuleId}&segmentId=${segmentId}&componentId=${componentId}&subComponentId=${subComponentId}`).then((response) => {
    
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get my works.';
        throw new Error(errorMessge);
    });
}

export const getMyTestsData = async (projectId, workType, selectedType) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/users/${workType}/my-tests?type=${selectedType}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get my tests.';
        throw new Error(errorMessge);
    });
}

export const checkAccessRightsApi = async (projectId, workType, selectedType) => {
    console.log(`========== v1/auth/projects/${projectId}/users/${workType}/check-access?type=${selectedType}`);
    return apiService.getRequest(`v1/auth/projects/${projectId}/users/${workType}/check-access?type=${selectedType}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to check access rights.';
        throw new Error(errorMessge);
    });
}

import apiService from '../api.service';

export const getProjectInfoData = async (projectId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get project info.';
        throw new Error(errorMessge);
    });
}

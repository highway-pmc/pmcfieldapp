import apiService from '../api.service';

export const getMyWorksData = async (projectId, projectType) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/users/${projectType}/my-works`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get my works.';
        throw new Error(errorMessge);
    });
}

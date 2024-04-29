import apiService from '../api.service';

export const getProjectModulesData = async (projectId, workType) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules?workType=${workType || ''}`).then((response) => {
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

export const getProjectModuleComponentsData = async (projectId, projectModuleId, segmentId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of project module components.';
        throw new Error(errorMessge);
    });
}

export const getProjectModuleSubComponentsData = async (projectId, projectModuleId, segmentId, componentId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/sub-components`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of sub components.';
        throw new Error(errorMessge);
    });
}

export const getProjectModuleComponentTasksData = async (projectId, projectModuleId, segmentId, componentId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/tasks`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of component tasks.';
        throw new Error(errorMessge);
    });
}

export const getProjectModuleSegmentTasksData = async (projectId, projectModuleId, segmentId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/tasks`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of segment tasks.';
        throw new Error(errorMessge);
    });
}

export const getProjectModuleNextLevelData = async (projectId, projectModuleId, id, type) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/id/${id}/type/${type}/next-level`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to find next level of project module.';
        throw new Error(errorMessge);
    });
}

export const getProjectModuleSubComponentTasksData = async (projectId, projectModuleId, segmentId, componentId, subComponentId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/sub-components/${subComponentId}/tasks`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of project module tasks.';
        throw new Error(errorMessge);
    });
}

export const getUsersForWorkAssignmentData = async (projectId, workType) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/users/${workType}/work-assignment`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of users.';
        throw new Error(errorMessge);
    });
}

export const projectModulesWorkAssignToUsersApi = async (projectId, projectModuleId, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/work-assignment`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to assign works to users.';
        throw new Error(errorMessge);
    });
}

export const segmentsWorkAssignToUsersApi = async (projectId, projectModuleId, segmentId, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/work-assignment`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to assign works to users.';
        throw new Error(errorMessge);
    });
}

export const segmentTypeWorkAssignToUsersApi = async (projectId, projectModuleId, type, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/type/${type}/work-assignment`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to assign works to users.';
        throw new Error(errorMessge);
    });
}

export const componentsWorkAssignToUsersApi = async (projectId, projectModuleId, segmentId, componentId, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/work-assignment`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to assign works to users.';
        throw new Error(errorMessge);
    });
}

export const tasksWorkAssignToUsersApi = async (projectId, projectModuleId, segmentId, componentId, taskId, body) => {
    let url = '';
    if (componentId) {
        url = `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/tasks/${taskId}/work-assignment`
    } else {
        url = `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/tasks/${taskId}/work-assignment`
    }
    return apiService.postRequest(url, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to assign tasks to users.';
        throw new Error(errorMessge);
    });
}
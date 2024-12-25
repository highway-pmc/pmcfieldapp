import apiService from '../api.service';

/* Source Approvals APIs */
export const getSourceApprovalsApi = async (projectId, testMaterialId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/test-material/${testMaterialId}/source-approvals`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of source approvals.';
        throw new Error(errorMessge);
    });
}

export const getSourceApprovalsByStatusApi = async (projectId, testMaterialId, status) => {
    console.log(
      '=========',
      `v1/auth/projects/${projectId}/test-material/${testMaterialId}/source-approvals/status/${status}`,
    );
    return apiService.getRequest(`v1/auth/projects/${projectId}/test-material/${testMaterialId}/source-approvals/status/${status}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || `Unable to get list of source approvals for status '${status}'.`;
        throw new Error(errorMessge);
    });
}

export const addSourceApprovalApi = async (projectId, testCategoryType, testMaterialId, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/test-work-category/${testCategoryType}/test-material/${testMaterialId}/source-approvals`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err?.message || 'Unable to add source.';
        throw new Error(errorMessge);
    });
}

export const patchSourceApprovalApi = async (projectId, testCategoryType, testMaterialId, id, body) => {
    return apiService.patchRequest(`v1/auth/projects/${projectId}/test-work-category/${testCategoryType}/test-material/${testMaterialId}/source-approvals/${id}`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to update source.';
        throw new Error(errorMessge);
    });
}

export const updateSourceApprovalApi = async (projectId, testCategoryType, testMaterialId, id, body) => {
    return apiService.putRequest(`v1/auth/projects/${projectId}/test-work-category/${testCategoryType}/test-material/${testMaterialId}/source-approvals/${id}`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to update source.';
        throw new Error(errorMessge);
    });
}

export const deleteSourceApprovalApi = async (projectId, testMaterialId, id) => {
    return apiService.deleteRequest(`v1/auth/projects/${projectId}/test-material/${testMaterialId}/source-approvals/${id}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to update source.';
        throw new Error(errorMessge);
    });
}

export const addSourceDetailApi = async (projectId, sourceApprovalId, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/source-approvals/${sourceApprovalId}/details`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to add source details.';
        throw new Error(errorMessge);
    });
}

export const updateSourceDetailApi = async (projectId, sourceApprovalId, id, body) => {
    return apiService.putRequest(`v1/auth/projects/${projectId}/source-approvals/${sourceApprovalId}/details/${id}`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to update source details.';
        throw new Error(errorMessge);
    });
}

export const deleteSourceDetailApi = async (projectId, sourceApprovalId, id) => {
    return apiService.deleteRequest(`v1/auth/projects/${projectId}/source-approvals/${sourceApprovalId}/details/${id}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to delete source details.';
        throw new Error(errorMessge);
    });
}

/* Procurements APIs */

export const getProcurementsApi = async (projectId, testWorkCategoryType, testMaterialId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/procurements`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get list of procurements.';
        throw new Error(errorMessge);
    });
}

export const addProcurementApi = async (projectId, testWorkCategoryType, testMaterialId, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/procurements`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to add procurements.';
        throw new Error(errorMessge);
    });
}

export const updateProcurementApi = async (projectId, testWorkCategoryType, testMaterialId, id, body) => {
    return apiService.putRequest(`v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/procurements/${id}`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to update procurements.';
        throw new Error(errorMessge);
    });
}

export const deleteProcurementApi = async (projectId, testMaterialId, id) => {
    return apiService.deleteRequest(`v1/auth/projects/${projectId}/test-material/${testMaterialId}/procurements/${id}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to delete procurements.';
        throw new Error(errorMessge);
    });
}
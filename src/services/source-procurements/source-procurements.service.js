import apiService from '../api.service';

export const getMeterialRequestFormApi = async (projectId, id) => {
  return apiService
    .getRequest(`v1/auth/projects/${projectId}/tasks/${id}/prepare-request`)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to add Vendor.';
      throw new Error(errorMessge);
    });
};

export const postUploadBatchSlipApi = async (projectId, id, body) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/material-requests/items/${id}/upload-batch-slip`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to upload Batch Slip.';
      throw new Error(errorMessge);
    });
};

export const postMeterialRequestFormApi = async (projectId, body) => {
  return apiService
    .postRequest(`v1/auth/projects/${projectId}/material-requests`, body)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to Create Meterial Request.';
      throw new Error(errorMessge);
    });
};

export const getMeterialRequestToFormApi = async (
  projectId,
  type,
  requestType,
) => {
  console.log('-Suyash--!!!', projectId, type, requestType);
  console.log(
    `v1/auth/projects/${projectId}/material-requests?requestTo=${type}&requestType=${requestType}`,
  );
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/material-requests?requestTo=${type}&requestType=${requestType}`,
    )
    .then(response => {
      console.log('---!!!', response);

      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to add Vendor.';
      throw new Error(errorMessge);
    });
};

export const patchMeterialRequestStatusApi = async (projectId, id, body) => {
  console.log('patch---!!!', projectId, id, body);
  return apiService
    .patchRequest(
      `v1/auth/projects/${projectId}/material-requests/${id}/status`,
      body,
    )
    .then(response => {
      console.log('---!!!', response);

      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to mark meterial status.';
      throw new Error(errorMessge);
    });
};

export const dispatchProductionRequestApi = async (projectId, itemId, body) => {
  console.log(
    'dispatch production---!!!',
    projectId,
    itemId,
    JSON.stringify(body),
  );
  return apiService
    .patchRequest(
      `v1/auth/projects/${projectId}/material-requests/${itemId}/dispatch-production`,
      body,
    )
    .then(response => {
      console.log('---!!!', response);
      return response;
    })
    .catch(err => {
      const errorMessge =
        err?.message || 'Unable to dispatch production material.';
      throw new Error(errorMessge);
    });
};
export const patchDipatchRequestApi = async (projectId, itemId, body) => {
  console.log('patch---!!!', projectId, itemId, JSON.stringify(body));
  return apiService
    .patchRequest(
      `v1/auth/projects/${projectId}/material-requests/items/${itemId}/dispatch-store`,
      body,
    )
    .then(response => {
      console.log('---!!!', response);

      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to Dispatch meterial.';
      throw new Error(errorMessge);
    });
};

/*VENDOR FORM*/
export const postVendorFormApi = async body => {
  return apiService
    .postRequest(`v1/auth/vendors/addVender`, body)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to add Vendor.';
      throw new Error(errorMessge);
    });
};

export const putVendorFormApi = async (id, body) => {
  return apiService
    .putRequest(`v1/auth/vendors/updateVendor/${id}`, body)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to add Vendor.';
      throw new Error(errorMessge);
    });
};

export const deleteVendorFormApi = async id => {
  return apiService
    .deleteRequest(`v1/auth/vendors/deleteVendor/${id}`)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to add Vendor.';
      throw new Error(errorMessge);
    });
};

export const getVendorFormApi = async () => {
  return apiService
    .getRequest(`v1/auth/vendors`)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to add Vendor.';
      throw new Error(errorMessge);
    });
};

/* Source Approvals APIs */
export const getSourceApprovalsApi = async (projectId, testMaterialId) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-materials/${testMaterialId}/source-approvals`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of source approvals.';
      throw new Error(errorMessge);
    });
};
export const getAllSourceApprovalsApi = async (projectId, status) => {
  console.log('getAllSourceApprovalsApi---!!!', projectId, status);
  console.log(
    `v1/auth/projects/${projectId}/all-source-approvals?status=${status}`,
  );
  //TODO
  return apiService
    .getRequest(`v1/auth/projects/${projectId}/all-source-approvals`)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of source approvals.';
      throw new Error(errorMessge);
    });
};

export const postAddSourceApi = async (projectId, testMaterialId, body) => {
  console.log('post---!!!', projectId, testMaterialId, JSON.stringify(body));
  return apiService
    .postRequestWithFile(
      `v1/auth/projects/${projectId}/test-materials/${testMaterialId}/source-approvals`,
      body,
    )
    .then(response => {
      console.log('data get---!!!', response);
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of source approvals.';
      console.log('data get---!!!', JSON.stringify(err));
      throw new Error(errorMessge);
    });
};

export const getSourceCategoriesWithCountApi = async projectId => {
  const url = `v1/auth/projects/${projectId}/source-approvals`;
  return apiService
    .getRequest(url)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessage =
        err.message || 'Unable to get source categories with count.';
      throw new Error(errorMessage);
    });
};
export const getSourceApprovalsByStatusApi = async (
  projectId,
  testMaterialId,
  status,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-materials/${testMaterialId}/source-approvals/status/${status}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message ||
        `Unable to get list of source approvals for status '${status}'.`;
      throw new Error(errorMessge);
    });
};

export const addSourceApprovalApi = async (
  projectId,
  testCategoryType,
  testMaterialId,
  body,
) => {
  return apiService
    .postRequestWithFile(
      `v1/auth/projects/${projectId}/test-work-category/${testCategoryType}/test-material/${testMaterialId}/source-approvals`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to add source.';
      throw new Error(errorMessge);
    });
};

export const putSourceApprovalApi = async (
  projectId,
  testMaterialId,
  id,
  body,
) => {
  return apiService
    .putRequestWithFile(
      `v1/auth/projects/${projectId}/test-materials/${testMaterialId}/source-approvals/${id}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to update source.';
      throw new Error(errorMessge);
    });
};

export const patchSourceApprovalApi = async (
  projectId,
  testCategoryType,
  testMaterialId,
  id,
  body,
) => {
  return apiService
    .patchRequest(
      `v1/auth/projects/${projectId}/test-work-category/${testCategoryType}/test-material/${testMaterialId}/source-approvals/${id}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to update source.';
      throw new Error(errorMessge);
    });
};

export const updateSourceApprovalApi = async (
  projectId,
  testCategoryType,
  testMaterialId,
  id,
  body,
) => {
  return apiService
    .putRequest(
      `v1/auth/projects/${projectId}/test-work-category/${testCategoryType}/test-material/${testMaterialId}/source-approvals/${id}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to update source.';
      throw new Error(errorMessge);
    });
};

export const deleteSourceApprovalApi = async (
  projectId,
  testMaterialId,
  id,
) => {
  return apiService
    .deleteRequest(
      `v1/auth/projects/${projectId}/test-materials/${testMaterialId}/source-approvals/${id}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to update source.';
      throw new Error(errorMessge);
    });
};

export const deleteSourceApi = async (projectId, id) => {
  return apiService
    .deleteRequest(`v1/auth/projects/${projectId}/source-approvals/${id}`)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to update source.';
      throw new Error(errorMessge);
    });
};

export const patchSourceApprovalStatusApi = async (projectId, id, body) => {
  console.log('patch---!!!', projectId, id, body);
  return apiService
    .patchRequest(
      `v1/auth/projects/${projectId}/source-approvals/${id}/status`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err?.message || 'Unable to Approve status.';
      throw new Error(errorMessge);
    });
};

export const addSourceDetailApi = async (projectId, sourceApprovalId, body) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/source-approvals/${sourceApprovalId}/details`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to add source details.';
      throw new Error(errorMessge);
    });
};

export const updateSourceDetailApi = async (
  projectId,
  sourceApprovalId,
  id,
  body,
) => {
  return apiService
    .putRequest(
      `v1/auth/projects/${projectId}/source-approvals/${sourceApprovalId}/details/${id}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to update source details.';
      throw new Error(errorMessge);
    });
};

export const deleteSourceDetailApi = async (
  projectId,
  sourceApprovalId,
  id,
) => {
  return apiService
    .deleteRequest(
      `v1/auth/projects/${projectId}/source-approvals/${sourceApprovalId}/details/${id}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to delete source details.';
      throw new Error(errorMessge);
    });
};

/* Procurements APIs */

export const getProcurementsApi = async (
  projectId,
  testWorkCategoryType,
  testMaterialId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/procurements`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get list of procurements.';
      throw new Error(errorMessge);
    });
};

export const addProcurementApi = async (
  projectId,
  testWorkCategoryType,
  testMaterialId,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/procurements`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to add procurements.';
      throw new Error(errorMessge);
    });
};

export const addPurchaseApi = async (
  projectId,
  testWorkCategoryType,
  testMaterialId,
  body,
) => {
  const url = `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/procurements`;
  console.log('addPurchaseApi: URL', url);
  console.log('addPurchaseApi: body', JSON.stringify(body, null, 2));
  return apiService
    .postRequestWithFile(url, body)
    .then(response => {
      console.log('addPurchaseApi: success response', response);
      return response;
    })
    .catch(err => {
      console.log('addPurchaseApi: error', err);
      console.log('addPurchaseApi: error message', err.message);
      const errorMessge = err.message || 'Unable to Add Purchase.';
      throw new Error(errorMessge);
    });
};

export const updateProcurementApi = async (
  projectId,
  testWorkCategoryType,
  testMaterialId,
  id,
  body,
) => {
  return apiService
    .putRequest(
      `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/procurements/${id}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to update procurements.';
      throw new Error(errorMessge);
    });
};

export const deleteProcurementApi = async (projectId, testMaterialId, id) => {
  return apiService
    .deleteRequest(
      `v1/auth/projects/${projectId}/test-material/${testMaterialId}/procurements/${id}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to delete procurements.';
      throw new Error(errorMessge);
    });
};

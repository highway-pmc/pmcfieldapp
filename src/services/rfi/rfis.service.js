import apiService from '../api.service';

export const getRFITasksData = async (projectId, userCategory, assignmentLevel, taskCategory) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/users/${userCategory}/my-works/level/${assignmentLevel}?taskCategory=${taskCategory}`).then((response) => {
    // return apiService.getRequest(`v1/auth/projects/${projectId}/users/${userCategory}/my-works?level=${assignmentLevel}`).then((response) => {
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

export const getRFIs = async (projectId, status, projectModuleType, taskCategory) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/status/${status}/rfis?projectModuleType=${projectModuleType}&taskCategory=${taskCategory}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get RFI.';
        throw new Error(errorMessge);
    });
}

export const getTestRFIs = async (projectId, status) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/status/${status}/test-rfis`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get RFI.';
        throw new Error(errorMessge);
    });
}

export const getRFIsReports = async (projectId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/rfis/reports`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get RFIs reports.';
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

export const fillTestRFIsDataChecklist = async (projectId, rfiId, status, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/test-rfis/${rfiId}/status/${status}`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to save check list.';
        throw new Error(errorMessge);
    });
}

export const fillRFIsDataChecklistForSampleTest = async (projectId, rfiId, status, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/test-rfis/${rfiId}/status/${status}`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to save check list.';
        throw new Error(errorMessge);
    });
}

export const testSamplePreparedSubmitApi = async (projectId, testRfiId, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/test-rfis/${testRfiId}/sample-prepared`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to submit sample prepared.';
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

export const updateTestSampleAPi = async (projectId, id, body) => {
    return apiService.patchRequest(`v1/auth/projects/${projectId}/testsample/${id}`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to update test sample.';
        throw new Error(errorMessge);
    });
}

export const generateTestSampleReportApi = async (projectId, testRFIId) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/test-rfis/${testRFIId}/report`, {}).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to generate report.';
        throw new Error(errorMessge);
    });
}

export const viewTestSampleReportApi = async (projectId, testRFIId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/test-rfis/${testRFIId}/report`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to generate report.';
        throw new Error(errorMessge);
    });
}

export const getTestSampleReportsForLoggedinUserApi = async (projectId) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/test-rfis/reports`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get Test Sample reports.';
        throw new Error(errorMessge);
    });
}

export const postLabTestRFI = async (projectId, testType, body) => {
    return apiService.postRequest(`v1/auth/projects/${projectId}/${testType}/rfis-manual`, body).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to generate RFI`s.';
        throw new Error(errorMessge);
    });
}

export const getQualityMasterApi = async (testType) => {
    return apiService.getRequest(`v1/auth/qualityMasterData?type=${testType}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get Quality Master.';
        throw new Error(errorMessge);
    });
}

export const getMixDesignFormInfoApi = async (
  projectId,
  testWorkCategoryType,
  testMaterialId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/mix-design-info`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get Quality Master.';
      throw new Error(errorMessge);
    });
};

export const saveMixDesignFormInfoApi = async (
    projectId,
    testWorkCategoryType,
    testMaterialId,
    body
  ) => {
    return apiService
      .postRequest(
        `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/mix-designs`,
        body
      )
      .then(response => {
        return response;
      })
      .catch(err => {
        const errorMessge = err.message || 'Unable to save Mix design.';
        throw new Error(errorMessge);
      });
  };
//http://localhost:4000/v1/auth/projects/669ba9f0e3b37a3b66e221ef/test-work-category/sub-base/test-material/67bb73db5fa264d1da3cc824/mix-designs
export const getMixDesignListInfoApi = async (
  projectId,
  testWorkCategoryType,
  testMaterialId,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/test-work-category/${testWorkCategoryType}/test-material/${testMaterialId}/mix-designs`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get Quality Master.';
      throw new Error(errorMessge);
    });
};

export const getMixDesignDataApi = async (projectId, testType) => {
    return apiService.getRequest(`v1/auth/projects/${projectId}/test-work-category?type=${testType}`).then((response) => {
        return response;
    }).catch((err) => {
        const errorMessge = err.message || 'Unable to get Quality Master.';
        throw new Error(errorMessge);
    });
}
import apiService from '../api.service';

export const getProjectModulesData = async (
  projectId,
  workType,
  taskCategory,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/project-modules?workType=${
        workType || ''
      }&taskCategory=${taskCategory || ''}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of project modules.';
      throw new Error(errorMessge);
    });
};

export const getProjectModuleSegmentsData = async (
  projectId,
  projectModuleId,
  taskCategory,
) => {
  console.log('getProjectModuleSegmentsData params:', {
    projectId,
    projectModuleId,
    taskCategory,
  });
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments?taskCategory=${taskCategory}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of project module segments.';
      throw new Error(errorMessge);
    });
};

export const getProjectModuleComponentsData = async (
  projectId,
  projectModuleId,
  segmentId,
  taskCategory,
) => {
  console.log('getProjectModuleComponentsData params:', {
    projectId,
    projectModuleId,
    segmentId,
    taskCategory,
  });
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components?taskCategory=${taskCategory}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of project module components.';
      throw new Error(errorMessge);
    });
};

export const getProjectModuleSubComponentsData = async (
  projectId,
  projectModuleId,
  segmentId,
  componentId,
  taskCategory,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/sub-components?taskCategory=${taskCategory}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of sub components.';
      throw new Error(errorMessge);
    });
};

export const getProjectModuleComponentTasksData = async (
  projectId,
  projectModuleId,
  segmentId,
  componentId,
  taskCategory,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/tasks?taskCategory=${taskCategory}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of component tasks.';
      throw new Error(errorMessge);
    });
};

export const getProjectModuleSegmentTasksData = async (
  projectId,
  projectModuleId,
  segmentId,
  taskCategory,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/tasks?taskCategory=${taskCategory}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get list of segment tasks.';
      throw new Error(errorMessge);
    });
};

export const getProjectModuleNextLevelData = async (
  projectId,
  projectModuleId,
  id,
  type,
  taskCategory,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/id/${id}/type/${type}/next-level?taskCategory=${taskCategory}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to find next level of project module.';
      throw new Error(errorMessge);
    });
};

export const getProjectModuleSubComponentTasksData = async (
  projectId,
  projectModuleId,
  segmentId,
  componentId,
  subComponentId,
  taskCategory,
) => {
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/sub-components/${subComponentId}/tasks?taskCategory=${taskCategory}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge =
        err.message || 'Unable to get list of project module tasks.';
      throw new Error(errorMessge);
    });
};

export const getUsersForWorkAssignmentData = async (projectId, workType) => {
  console.log('getUsersForWorkAssignmentData params:', {
    projectId,
    workType,
  });
  return apiService
    .getRequest(
      `v1/auth/projects/${projectId}/users/${workType}/work-assignment`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to get list of users.';
      throw new Error(errorMessge);
    });
};

export const projectModulesWorkAssignToUsersApi = async (
  projectId,
  projectModuleId,
  taskCategory,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/work-assignment?taskCategory=${taskCategory}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign works to users.';
      throw new Error(errorMessge);
    });
};

export const segmentsWorkAssignToUsersApi = async (
  projectId,
  projectModuleId,
  segmentId,
  taskCategory,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/work-assignment?taskCategory=${taskCategory}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign works to users.';
      throw new Error(errorMessge);
    });
};

export const segmentTypeWorkAssignToUsersApi = async (
  projectId,
  projectModuleId,
  type,
  taskCategory,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/type/${type}/work-assignment?taskCategory=${taskCategory}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign works to users.';
      throw new Error(errorMessge);
    });
};

export const componentsWorkAssignToUsersApi = async (
  projectId,
  projectModuleId,
  segmentId,
  componentId,
  taskCategory,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/work-assignment?taskCategory=${taskCategory}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign works to users.';
      throw new Error(errorMessge);
    });
};

export const subComponentsWorkAssignToUsersApi = async (
  projectId,
  projectModuleId,
  segmentId,
  componentId,
  subComponentId,
  taskCategory,
  body,
) => {
  return apiService
    .postRequest(
      `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/sub-components/${subComponentId}/work-assignment?taskCategory=${taskCategory}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign works to users.';
      throw new Error(errorMessge);
    });
};

export const tasksWorkAssignToUsersApi = async (
  projectId,
  projectModuleId,
  segmentId,
  componentId,
  subComponentId,
  taskId,
  taskCategory,
  body,
) => {
  let url = '';
  if (subComponentId) {
    url = `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/sub-components/${subComponentId}/tasks/${taskId}/work-assignment`;
  } else if (componentId) {
    url = `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/components/${componentId}/tasks/${taskId}/work-assignment`;
  } else {
    url = `v1/auth/projects/${projectId}/project-modules/${projectModuleId}/segments/${segmentId}/tasks/${taskId}/work-assignment`;
  }
  return apiService
    .postRequest(`${url}?taskCategory=${taskCategory}`, body)
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessge = err.message || 'Unable to assign tasks to users.';
      throw new Error(errorMessge);
    });
};

export const splitComponentApi = async (projectModuleId, splitTo, body) => {
  console.log(
    `v1/auth/project-modules/${projectModuleId}/splits/${splitTo}======`,
  );
  return apiService
    .postRequest(
      `v1/auth/project-modules/${projectModuleId}/splits/${splitTo}`,
      body,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessage = err.message || 'Unable to split the component.';
      throw new Error(errorMessage);
    });
};

export const deleteSplitComponentApi = async (projectModuleId, type, id) => {
  return apiService
    .deleteRequest(
      `v1/auth/project-modules/${projectModuleId}/splits/${type}/${id}`,
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      const errorMessage =
        err.message || 'Unable to delete the split component.';
      throw new Error(errorMessage);
    });
};

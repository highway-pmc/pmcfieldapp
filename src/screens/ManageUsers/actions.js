import {
  PROCUREMENTS,
  SOURCE_APPROVALS,
  VENDOR_FORM,
  METERIAL_REQUEST,
} from './QualityWorks/constants';

export const getUserCategories = () => ({
  type: 'GET_USER_CATEGORY_REQUEST',
});

export const getUsers = () => ({
  type: 'GET_USER_ASSIGNMENT_REQUEST',
});

export const addUserCategories = user => ({
  type: 'ADD_USER_ASSIGNMENT_REQUEST',
  payload: user,
});

export const clearUserAssignment = () => ({
  type: 'CLEAR_USER_ASSIGNMENT',
});

export const getProjectModules = payload => ({
  type: 'GET_PROJECT_MODULES_REQUEST',
  payload: payload,
});

export const getProjectModuleSegments = payload => ({
  type: 'GET_PROJECT_MODULE_SEGMENTS_REQUEST',
  payload: payload,
});

export const getProjectModuleComponents = payload => ({
  type: 'GET_PROJECT_MODULE_COMPONENTS_REQUEST',
  payload: payload,
});

export const getProjectModuleSubComponents = payload => ({
  type: 'GET_PROJECT_MODULE_SUB_COMPONENTS_REQUEST',
  payload: payload,
});

export const getProjectModuleSegmentTasks = payload => ({
  type: 'GET_PROJECT_MODULE_SEGMENT_TASKS_REQUEST',
  payload: payload,
});

export const getProjectModuleSubComponentTasks = payload => ({
  type: 'GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_REQUEST',
  payload: payload,
});

export const getProjectModuleNextLevel = payload => ({
  type: 'GET_PROJECT_MODULE_NEXT_LEVEL_REQUEST',
  payload: payload,
});

export const getProjectModuleComponentTasks = payload => ({
  type: 'GET_PROJECT_MODULE_COMPONENTS_TASKS_REQUEST',
  payload: payload,
});

export const getUsersForWorkAssignment = payload => ({
  type: 'GET_USERS_TO_WORK_ASSIGNMENT_REQUEST',
  payload: payload,
});

export const projectModulesWorkAssignToUsers = payload => ({
  type: 'PROJECT_MODULE_WORK_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const segmentWorkAssignToUsers = payload => ({
  type: 'SEGMENT_WORK_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const segmentTypeWorkAssignToUsers = payload => ({
  type: 'SEGMENT_TYPE_WORK_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});
export const splitComponent = payload => ({
  type: 'SPLIT_COMPONENT_REQUEST',
  payload: payload,
});

export const deleteSplitComponent = payload => ({
  type: 'DELETE_SPLIT_COMPONENT_REQUEST',
  payload: payload,
});
export const componentWorkAssignToUsers = payload => ({
  type: 'COMPONENT_WORK_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const subComponentWorkAssignToUsers = payload => ({
  type: 'SUB_COMPONENT_WORK_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const taskWorkAssignToUsers = payload => ({
  type: 'TASK_WORK_ASSIGNMENT_USERS_REQUEST',
  payload: payload,
});

export const clearWorkAssignmentData = () => ({
  type: 'CLEAR_WORK_ASSIGMENT',
});

export const clearProjectModulesWorkAssignmentData = () => ({
  type: 'CLEAR_PROJECT_MODULE_WORK_ASSIGNMENT_USERS',
});

export const clearNextLevel = () => ({
  type: 'CLEAR_NEXT_LEVEL',
});
export const dispatchProductionRequest = payload => ({
  type: METERIAL_REQUEST.DISPATCH_PRODUCTION_REQUEST,
  payload,
});
export const patchDispatchRequest = payload => ({
  type: METERIAL_REQUEST.PATCH_DISPATCH_REQUEST,
  payload,
});

export const postUploadBatchSlip = payload => ({
  type: METERIAL_REQUEST.POST_BATCH_SLIP_REQUEST,
  payload,
});

export const patchMaterialRequestStatus = payload => ({
  type: METERIAL_REQUEST.PATCH_MATERIAL_REQUEST_STATUS,
  payload,
});

export const getMaterialRequestTo = payload => ({
  type: METERIAL_REQUEST.GET_MATERIAL_REQUEST_TO,
  payload,
});

export const submitMaterialRequest = payload => ({
  type: METERIAL_REQUEST.POST_SUBMIT_MATERIAL_REQUEST,
  payload,
});
export const clearMaterialRequest = () => ({
  type: METERIAL_REQUEST.CLEAR_SUBMIT_MATERIAL_FORM_REQUEST,
});
export const getMaterialRequest = payload => ({
  type: METERIAL_REQUEST.GET_MATERIAL_REQUEST,
  payload,
});

/*VENDOR FORM*/
export const postVendorForm = payload => ({
  type: VENDOR_FORM.POST_VENDOR_FORM_REQUEST,
  payload: payload,
});

export const putVendorForm = payload => ({
  type: VENDOR_FORM.PUT_VENDOR_FORM_REQUEST,
  payload: payload,
});

export const deleteVendorForm = payload => ({
  type: VENDOR_FORM.DELETE_VENDOR_FORM_REQUEST,
  payload: payload,
});

export const getVendorForm = () => ({
  type: VENDOR_FORM.GET_VENDOR_FORM_REQUEST,
});

/* Source Approvals */
export const getSourceApprovals = payload => ({
  type: SOURCE_APPROVALS.GET_SOURCE_APPROVALS_REQUEST,
  payload: payload,
});

export const getSourceCategoriesWithCount = payload => ({
  type: SOURCE_APPROVALS.GET_SOURCE_CATEGORIES_WITH_COUNT_REQUEST,
  payload: payload,
});

export const getSourceApprovalsByStatus = payload => ({
  type: SOURCE_APPROVALS.GET_SOURCE_BY_STATUS_REQUEST,
  payload: payload,
});

export const addSourceApproval = payload => ({
  type: SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_REQUEST,
  payload: payload,
});

export const putSourceApproval = payload => ({
  type: SOURCE_APPROVALS.PUT_SOURCE_APPROVAL_REQUEST,
  payload: payload,
});

export const patchSourceApproval = payload => ({
  type: SOURCE_APPROVALS.PATCH_SOURCE_APPROVAL_REQUEST,
  payload: payload,
});

export const updateSourceApproval = payload => ({
  type: SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_REQUEST,
  payload: payload,
});

export const deleteSourceApproval = payload => ({
  type: SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_REQUEST,
  payload: payload,
});

export const addSourceDetail = payload => ({
  type: SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_DETAIL_REQUEST,
  payload: payload,
});

export const updateSourceDetail = payload => ({
  type: SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_DETAIL_REQUEST,
  payload: payload,
});

export const deleteSourceDetail = payload => ({
  type: SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_DETAIL_REQUEST,
  payload: payload,
});

/* Procurement Details */
export const getProcurements = payload => ({
  type: PROCUREMENTS.GET_PROCUREMENTS_REQUEST,
  payload: payload,
});

export const addProcurement = payload => ({
  type: PROCUREMENTS.ADD_PROCUREMENT_REQUEST,
  payload: payload,
});

export const updateProcurement = payload => ({
  type: PROCUREMENTS.UPDATE_PROCUREMENT_REQUEST,
  payload: payload,
});

export const deleteProcurement = payload => ({
  type: PROCUREMENTS.DELETE_PROCUREMENT_REQUEST,
  payload: payload,
});

export const clearSourceApprovals = () => ({
  type: SOURCE_APPROVALS.CLEAR_SOURCE_APPROVALS_REQUEST,
});

export const clearProcurements = () => ({
  type: PROCUREMENTS.CLEAR_PROCUREMENT_FAILURE,
});

export const getControlPoints = payload => ({
  type: 'GET_CONTROL_POINTS_REQUEST',
  payload: payload,
});

import {put, takeLatest} from 'redux-saga/effects';
import {
  getUserAssignment,
  getUserCategory,
} from '../../../services/user/user.service';
import {
  getTestClassificationData,
  getTestClassificationNextLevelData,
  getTestMaterialsData,
  getTestTypesData,
  getTestWorkCategoryData,
  getUsersForTestAssignmentData,
  testClassificationsTestAssignToUsersApi,
  testMaterialsTestAssignToUsersApi,
  testTypesAssignToUsersApi,
  testWorkCategoryTestAssignToUsersApi,
} from '../../../services/test-assignment/test-assignment.service';
import {
  addProcurementApi,
  addSourceApprovalApi,
  addSourceDetailApi,
  deleteProcurementApi,
  deleteSourceApprovalApi,
  deleteSourceDetailApi,
  getProcurementsApi,
  getSourceApprovalsApi,
  getSourceApprovalsByStatusApi,
  patchSourceApprovalApi,
  updateProcurementApi,
  updateSourceApprovalApi,
  updateSourceDetailApi,
  getSourceCategoriesWithCountApi,
  putSourceApprovalApi,
  postVendorFormApi,
  getVendorFormApi,
  putVendorFormApi,
  deleteVendorFormApi,
  getMeterialRequestFormApi,
  postMeterialRequestFormApi,
} from '../../../services/source-procurements/source-procurements.service';
import {METERIAL_REQUEST, PROCUREMENTS, SOURCE_APPROVALS, VENDOR_FORM} from './constants';
function* getUserCategories() {
  try {
    const response = yield getUserCategory();
    yield put({type: 'GET_USER_CATEGORY_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_USER_CATEGORY_FAILURE', error: error.message});
  }
}

function* getUsers() {
  try {
    const response = yield getUserAssignment();
    yield put({type: 'GET_USER_ASSIGNMENT_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_USER_ASSIGNMENT_FAILURE', error: error.message});
  }
}

function* getTestClassifications({payload}) {
  try {
    const response = yield getTestClassificationData(
      payload.projectId,
      payload.workType,
    );

    yield put({type: 'GET_TEST_CLASSIFICATION_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_TEST_CLASSIFICATION_FAILURE', error: error.message});
  }
}

function* getTestWorkCategory({payload}) {
  try {
    const response = yield getTestWorkCategoryData(
      payload.projectId,
      payload.testClassificationId,
    );

    yield put({type: 'GET_TEST_WORK_CATEGORY_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_TEST_WORK_CATEGORY_FAILURE', error: error.message});
  }
}

function* getTestMaterials({payload}) {
  try {
    const response = yield getTestMaterialsData(
      payload.projectId,
      payload.testClassificationId,
      payload.testWorkCategoryId,
    );
    yield put({type: 'GET_TEST_MATERIALS_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_TEST_MATERIALS_FAILURE', error: error.message});
  }
}

function* getTestType({payload}) {
  try {
    const response = yield getTestTypesData(
      payload.projectId,
      payload.testClassificationId,
      payload.testWorkCategoryId,
      payload.testMaterialId,
    );
    yield put({type: 'GET_TEST_TYPE_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_TEST_TYPE_FAILURE', error: error.message});
  }
}

function* getTestClassificationNextLevel({payload}) {
  try {
    const response = yield getTestClassificationNextLevelData(
      payload.projectId,
      payload.testClassificationId,
      payload.id,
      payload.type,
    );
    yield put({type: 'GET_TEST_CLASSIFICATION_NEXT_LEVEL_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_TEST_CLASSIFICATION_NEXT_LEVEL_FAILURE',
      error: error.message,
    });
  }
}

function* getUsersForTestAssignment({payload}) {
  try {
    const response = yield getUsersForTestAssignmentData(
      payload.projectId,
      payload.workType,
    );
    yield put({type: 'GET_USERS_TO_TEST_ASSIGNMENT_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_USERS_TO_TEST_ASSIGNMENT_FAILURE',
      error: error.message,
    });
  }
}

function* testClassificationsTestAssignToUsers({payload}) {
  try {
    const response = yield testClassificationsTestAssignToUsersApi(
      payload.projectId,
      payload.testClassificationId,
      payload.body,
    );
    yield put({
      type: 'TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

function* testWorkCategoryTestAssignToUsers({payload}) {
  try {
    const response = yield testWorkCategoryTestAssignToUsersApi(
      payload.projectId,
      payload.testClassificationId,
      payload.testWorkCategoryId,
      payload.body,
    );
    yield put({
      type: 'TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

function* testMaterialsTestAssignToUsers({payload}) {
  try {
    const response = yield testMaterialsTestAssignToUsersApi(
      payload.projectId,
      payload.testClassificationId,
      payload.testWorkCategoryId,
      payload.testMaterialId,
      payload.body,
    );
    yield put({type: 'TEST_MATERIALS_TEST_ASSIGNMENT_USERS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'TEST_MATERIALS_TEST_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

function* testTypesAssignToUsers({payload}) {
  try {
    const response = yield testTypesAssignToUsersApi(
      payload.projectId,
      payload.testClassificationId,
      payload.testWorkCategoryId,
      payload.testMaterialId,
      payload.testTypeId,
      payload.body,
    );
    yield put({type: 'TEST_TYPES_TEST_ASSIGNMENT_USERS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'TEST_TYPES_TEST_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

/* Source Approvals */
function* getSourceApprovals({payload}) {
  try {
    const response = yield getSourceApprovalsApi(
      payload.projectId,
      payload.testMaterialId,
    );
    yield put({type: SOURCE_APPROVALS.GET_SOURCE_APPROVALS_SUCCESS, response});
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.GET_SOURCE_APPROVALS_FAILURE,
      error: error.message,
    });
  }
}

function* getSourceCategoriesWithCount({payload}) {
  try {
    const response = yield getSourceCategoriesWithCountApi(payload.projectId);
    yield put({
      type: SOURCE_APPROVALS.GET_SOURCE_CATEGORIES_WITH_COUNT_SUCCESS,
      response,
    });
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.GET_SOURCE_CATEGORIES_WITH_COUNT_FAILURE,
      error: error.message,
    });
  }
}

function* getSourceApprovalsByStatus({payload}) {
  try {
    const response = yield getSourceApprovalsByStatusApi(
      payload.projectId,
      payload.testMaterialId,
      payload.status,
    );
    console.log('===response===', response);
    yield put({
      type: SOURCE_APPROVALS.GET_SOURCE_BY_STATUS_SUCCESS,
      response,
    });
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.GET_SOURCE_BY_STATUS_FAILURE,
      error: error.message,
    });
  }
}

function* addSourceApproval({payload}) {
  try {
    const response = yield addSourceApprovalApi(
      payload.projectId,
      payload.testCategoryType,
      payload.testMaterialId,
      payload.body,
    );
    yield put({type: SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_SUCCESS, response});
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_FAILURE,
      error: error.message,
    });
  }
}

function* putSourceApproval({payload}) {
  try {
    const response = yield putSourceApprovalApi(
      payload.projectId,
      payload.testMaterialId,
      payload.id,
      payload.body,
    );
    yield put({type: SOURCE_APPROVALS.PUT_SOURCE_APPROVAL_SUCCESS, response});
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.PUT_SOURCE_APPROVAL_FAILURE,
      error: error.message,
    });
  }
}

function* patchSourceApproval({payload}) {
  try {
    const response = yield patchSourceApprovalApi(
      payload.projectId,
      payload.testCategoryType,
      payload.testMaterialId,
      payload.id,
      payload.body,
    );
    yield put({type: SOURCE_APPROVALS.PATCH_SOURCE_APPROVAL_SUCCESS, response});
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.PATCH_SOURCE_APPROVAL_FAILURE,
      error: error.message,
    });
  }
}

function* updateSourceApproval({payload}) {
  try {
    const response = yield updateSourceApprovalApi(
      payload.projectId,
      payload.testCategoryType,
      payload.testMaterialId,
      payload.id,
      payload.body,
    );
    yield put({
      type: SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_SUCCESS,
      response,
    });
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_FAILURE,
      error: error.message,
    });
  }
}

function* deleteSourceApproval({payload}) {
  try {
    const response = yield deleteSourceApprovalApi(
      payload.projectId,
      payload.testMaterialId,
      payload.id,
    );
    yield put({
      type: SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_SUCCESS,
      response,
    });
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_FAILURE,
      error: error.message,
    });
  }
}

/* Source details APIs */

function* addSourceDetail({payload}) {
  try {
    const response = yield addSourceDetailApi(
      payload.projectId,
      payload.sourceApprovalId,
      payload.body,
    );
    yield put({
      type: SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_DETAIL_SUCCESS,
      response,
    });
  } catch (error) {
    console.log('===error===', error);
    yield put({
      type: SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_DETAIL_FAILURE,
      error: error.message,
    });
  }
}

function* updateSourceDetail({payload}) {
  try {
    const response = yield updateSourceDetailApi(
      payload.projectId,
      payload.sourceApprovalId,
      payload.id,
      payload.body,
    );
    yield put({
      type: SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_DETAIL_SUCCESS,
      response,
    });
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_DETAIL_FAILURE,
      error: error.message,
    });
  }
}

function* deleteSourceDetail({payload}) {
  try {
    const response = yield deleteSourceDetailApi(
      payload.projectId,
      payload.sourceApprovalId,
      payload.id,
    );
    yield put({
      type: SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_DETAIL_SUCCESS,
      response,
    });
  } catch (error) {
    yield put({
      type: SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_DETAIL_FAILURE,
      error: error.message,
    });
  }
}

/* Procurements */

function* getProcurements({payload}) {
  try {
    const response = yield getProcurementsApi(
      payload.projectId,
      payload.testWorkCategoryType,
      payload.testMaterialId,
    );
    yield put({type: PROCUREMENTS.GET_PROCUREMENTS_SUCCESS, response});
  } catch (error) {
    yield put({
      type: PROCUREMENTS.GET_PROCUREMENTS_FAILURE,
      error: error.message,
    });
  }
}

function* addProcurement({payload}) {
  try {
    const response = yield addProcurementApi(
      payload.projectId,
      payload.testWorkCategoryType,
      payload.testMaterialId,
      payload.body,
    );
    yield put({type: PROCUREMENTS.ADD_PROCUREMENT_SUCCESS, response});
  } catch (error) {
    console.log('===error===', error);
    yield put({
      type: PROCUREMENTS.ADD_PROCUREMENT_FAILURE,
      error: error.message,
    });
  }
}

function* updateProcurement({payload}) {
  try {
    const response = yield updateProcurementApi(
      payload.projectId,
      payload.testWorkCategoryType,
      payload.testMaterialId,
      payload.id,
      payload.body,
    );
    yield put({type: PROCUREMENTS.UPDATE_PROCUREMENT_SUCCESS, response});
  } catch (error) {
    yield put({
      type: PROCUREMENTS.UPDATE_PROCUREMENT_FAILURE,
      error: error.message,
    });
  }
}

function* deleteProcurement({payload}) {
  try {
    const response = yield deleteProcurementApi(
      payload.projectId,
      payload.testMaterialId,
      payload.id,
    );
    yield put({type: PROCUREMENTS.DELETE_PROCUREMENT_SUCCESS, response});
  } catch (error) {
    yield put({
      type: PROCUREMENTS.DELETE_PROCUREMENT_FAILURE,
      error: error.message,
    });
  }
}

function* postVendorForm({payload}) {
  try {
    const response = yield postVendorFormApi(payload.body);
    yield put({type: VENDOR_FORM.POST_VENDOR_FORM_SUCCESS, response});
  } catch (error) {
    yield put({
      type: VENDOR_FORM.POST_VENDOR_FORM_FAILURE,
      error: error.message,
    });
  }
}

function* getVendorForm() {
  try {
    const response = yield getVendorFormApi();
    yield put({type: VENDOR_FORM.GET_VENDOR_FORM_SUCCESS, response});
  } catch (error) {
    yield put({
      type: VENDOR_FORM.GET_VENDOR_FORM_FAILURE,
      error: error.message,
    });
  }
}

function* putVendorForm({payload}) {
  try {
    const response = yield putVendorFormApi(payload.id, payload.body);
    yield put({type: VENDOR_FORM.PUT_VENDOR_FORM_SUCCESS, response});
  } catch (error) {
    yield put({
      type: VENDOR_FORM.PUT_VENDOR_FORM_FAILURE,
      error: error.message,
    });
  }
}

function* deleteVendorForm({payload}) {
  try {
    const response = yield deleteVendorFormApi(payload.id);
    yield put({type: VENDOR_FORM.DELETE_VENDOR_FORM_SUCCESS, response});
  } catch (error) {
    yield put({
      type: VENDOR_FORM.DELETE_VENDOR_FORM_FAILURE,
      error: error.message,
    });
  }
}



function* getMeterialRequestForm({payload}) {
  try {
    const response = yield getMeterialRequestFormApi(payload.projectId, payload.id);
    yield put({type: METERIAL_REQUEST.GET_MATERIAL_REQUEST_SUCCESS, response});
  } catch (error) {
    yield put({
      type: METERIAL_REQUEST.GET_MATERIAL_REQUEST_FAILURE,
      error: error.message,
    });
  }
}

function* postMeterialRequestForm({payload}) {
  try {
    const response = yield postMeterialRequestFormApi(payload.projectId, payload.body);
    yield put({type: METERIAL_REQUEST.POST_SUBMIT_MATERIAL_REQUEST_SUCCESS, response});
  } catch (error) {
    yield put({
      type: METERIAL_REQUEST.POST_SUBMIT_MATERIAL_REQUEST_FAILURE,
      error: error.message,
    });
  }
}

export default function* testAssignmentScreenSaga() {
  yield takeLatest(VENDOR_FORM.POST_VENDOR_FORM_REQUEST, postVendorForm);
  yield takeLatest(VENDOR_FORM.GET_VENDOR_FORM_REQUEST, getVendorForm);
  yield takeLatest(VENDOR_FORM.PUT_VENDOR_FORM_REQUEST, putVendorForm);
  yield takeLatest(VENDOR_FORM.DELETE_VENDOR_FORM_REQUEST, deleteVendorForm);
  yield takeLatest('GET_USER_CATEGORY_REQUEST', getUserCategories);
  yield takeLatest('GET_USER_ASSIGNMENT_REQUEST', getUsers);
  yield takeLatest('GET_TEST_CLASSIFICATION_REQUEST', getTestClassifications);
  yield takeLatest('GET_TEST_WORK_CATEGORY_REQUEST', getTestWorkCategory);
  yield takeLatest('GET_TEST_MATERIALS_REQUEST', getTestMaterials);
  yield takeLatest('GET_TEST_TYPE_REQUEST', getTestType);
  yield takeLatest(
    'GET_USERS_TO_TEST_ASSIGNMENT_REQUEST',
    getUsersForTestAssignment,
  );
  yield takeLatest(
    'TEST_CLASSIFICATION_TEST_ASSIGNMENT_USERS_REQUEST',
    testClassificationsTestAssignToUsers,
  );
  yield takeLatest(
    'TEST_WORK_CATEGORY_TEST_ASSIGNMENT_USERS_REQUEST',
    testWorkCategoryTestAssignToUsers,
  );
  yield takeLatest(
    'TEST_MATERIALS_TEST_ASSIGNMENT_USERS_REQUEST',
    testMaterialsTestAssignToUsers,
  );
  yield takeLatest(
    'TEST_TYPES_TEST_ASSIGNMENT_USERS_REQUEST',
    testTypesAssignToUsers,
  );
  yield takeLatest(
    'GET_TEST_CLASSIFICATION_NEXT_LEVEL_REQUEST',
    getTestClassificationNextLevel,
  );

  yield takeLatest(
    METERIAL_REQUEST.GET_MATERIAL_REQUEST,
    getMeterialRequestForm,
  );

  yield takeLatest(
    METERIAL_REQUEST.POST_SUBMIT_MATERIAL_REQUEST,
    postMeterialRequestForm,
  );

  yield takeLatest(
    SOURCE_APPROVALS.GET_SOURCE_APPROVALS_REQUEST,
    getSourceApprovals,
  );
  yield takeLatest(
    SOURCE_APPROVALS.GET_SOURCE_CATEGORIES_WITH_COUNT_REQUEST,
    getSourceCategoriesWithCount,
  );
  yield takeLatest(
    SOURCE_APPROVALS.GET_SOURCE_BY_STATUS_REQUEST,
    getSourceApprovalsByStatus,
  );
  yield takeLatest(
    SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_REQUEST,
    addSourceApproval,
  );
  yield takeLatest(
    SOURCE_APPROVALS.PUT_SOURCE_APPROVAL_REQUEST,
    putSourceApproval,
  );
  yield takeLatest(
    SOURCE_APPROVALS.PATCH_SOURCE_APPROVAL_REQUEST,
    patchSourceApproval,
  );
  yield takeLatest(
    SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_REQUEST,
    updateSourceApproval,
  );
  yield takeLatest(
    SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_REQUEST,
    deleteSourceApproval,
  );
  yield takeLatest(
    SOURCE_APPROVALS.ADD_SOURCE_APPROVAL_DETAIL_REQUEST,
    addSourceDetail,
  );
  yield takeLatest(
    SOURCE_APPROVALS.UPDATE_SOURCE_APPROVAL_DETAIL_REQUEST,
    updateSourceDetail,
  );
  yield takeLatest(
    SOURCE_APPROVALS.DELETE_SOURCE_APPROVAL_DETAIL_REQUEST,
    deleteSourceDetail,
  );
  yield takeLatest(PROCUREMENTS.GET_PROCUREMENTS_REQUEST, getProcurements);
  yield takeLatest(PROCUREMENTS.ADD_PROCUREMENT_REQUEST, addProcurement);
  yield takeLatest(PROCUREMENTS.UPDATE_PROCUREMENT_REQUEST, updateProcurement);
  yield takeLatest(PROCUREMENTS.DELETE_PROCUREMENT_REQUEST, deleteProcurement);
}

import {put, takeLatest} from 'redux-saga/effects';
import {
  getUserAssignment,
  getUserCategory,
  userCategoriesAssignment,
} from '../../services/user/user.service';
import {
  getProjectModuleSegmentsData,
  getProjectModuleComponentsData,
  getProjectModuleComponentTasksData,
  getProjectModulesData,
  getUsersForWorkAssignmentData,
  projectModulesWorkAssignToUsersApi,
  segmentTypeWorkAssignToUsersApi,
  segmentsWorkAssignToUsersApi,
  componentsWorkAssignToUsersApi,
  tasksWorkAssignToUsersApi,
  getProjectModuleSubComponentsData,
  getProjectModuleSubComponentTasksData,
  getProjectModuleNextLevelData,
  getProjectModuleSegmentTasksData,
  subComponentsWorkAssignToUsersApi,
  splitComponentApi,
  deleteSplitComponentApi,
  getControlPointsData,
} from '../../services/work-assignment/work-assignment.service';
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

function* addUserCategories({payload}) {
  try {
    const response = yield userCategoriesAssignment(payload.userId, {
      categories: payload.categories || [],
    });
    yield put({type: 'ADD_USER_ASSIGNMENT_SUCCESS', response});
  } catch (error) {
    yield put({type: 'ADD_USER_ASSIGNMENT_FAILURE', error: error.message});
  }
}

function* getProjectModules({payload}) {
  try {
    const response = yield getProjectModulesData(
      payload.projectId,
      payload.workType,
      payload.taskCategory,
    );

    yield put({type: 'GET_PROJECT_MODULES_SUCCESS', response});
  } catch (error) {
    yield put({type: 'GET_PROJECT_MODULES_FAILURE', error: error.message});
  }
}

function* getProjectModuleSegments({payload}) {
  try {
    const response = yield getProjectModuleSegmentsData(
      payload.projectId,
      payload.projectModuleId,
      payload.taskCategory,
    );

    yield put({type: 'GET_PROJECT_MODULE_SEGMENTS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_PROJECT_MODULE_SEGMENTS_FAILURE',
      error: error.message,
    });
  }
}

function* getProjectModuleComponents({payload}) {
  try {
    const response = yield getProjectModuleComponentsData(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.taskCategory,
    );
    yield put({type: 'GET_PROJECT_MODULE_COMPONENTS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_PROJECT_MODULE_COMPONENTS_FAILURE',
      error: error.message,
    });
  }
}

function* getProjectModuleSubComponents({payload}) {
  try {
    const response = yield getProjectModuleSubComponentsData(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.componentId,
      payload.taskCategory,
    );
    yield put({type: 'GET_PROJECT_MODULE_SUB_COMPONENTS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_PROJECT_MODULE_SUB_COMPONENTS_FAILURE',
      error: error.message,
    });
  }
}

function* getProjectModuleComponentTasks({payload}) {
  try {
    const response = yield getProjectModuleComponentTasksData(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.componentId,
      payload.taskCategory,
    );
    yield put({type: 'GET_PROJECT_MODULE_COMPONENTS_TASKS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_PROJECT_MODULE_COMPONENTS_TASKS_FAILURE',
      error: error.message,
    });
  }
}

function* getProjectModuleSegmentTasks({payload}) {
  try {
    const response = yield getProjectModuleSegmentTasksData(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.taskCategory,
    );

    yield put({type: 'GET_PROJECT_MODULE_SEGMENT_TASKS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_PROJECT_MODULE_SEGMENT_TASKS_FAILURE',
      error: error.message,
    });
  }
}

function* getProjectModuleSubComponentTasks({payload}) {
  try {
    const response = yield getProjectModuleSubComponentTasksData(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.componentId,
      payload.subComponentId,
      payload.taskCategory,
    );
    yield put({
      type: 'GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_SUCCESS',
      response,
    });
  } catch (error) {
    yield put({
      type: 'GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_FAILURE',
      error: error.message,
    });
  }
}

function* getProjectModuleNextLevel({payload}) {
  try {
    const response = yield getProjectModuleNextLevelData(
      payload.projectId,
      payload.projectModuleId,
      payload.id,
      payload.type,
      payload.taskCategory,
    );
    yield put({type: 'GET_PROJECT_MODULE_NEXT_LEVEL_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_PROJECT_MODULE_NEXT_LEVEL_FAILURE',
      error: error.message,
    });
  }
}

function* getUsersForWorkAssignment({payload}) {
  try {
    const response = yield getUsersForWorkAssignmentData(
      payload.projectId,
      payload.workType,
    );
    yield put({type: 'GET_USERS_TO_WORK_ASSIGNMENT_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_USERS_TO_WORK_ASSIGNMENT_FAILURE',
      error: error.message,
    });
  }
}

function* projectModulesWorkAssignToUsers({payload}) {
  try {
    const response = yield projectModulesWorkAssignToUsersApi(
      payload.projectId,
      payload.projectModuleId,
      payload.taskCategory,
      payload.body,
    );
    yield put({type: 'PROJECT_MODULE_WORK_ASSIGNMENT_USERS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'PROJECT_MODULE_WORK_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

function* segmentsWorkAssignToUsers({payload}) {
  try {
    const response = yield segmentsWorkAssignToUsersApi(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.taskCategory,
      payload.body,
    );
    yield put({type: 'SEGMENT_WORK_ASSIGNMENT_USERS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'SEGMENT_WORK_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

function* segmentTypeWorkAssignToUsers({payload}) {
  try {
    const response = yield segmentTypeWorkAssignToUsersApi(
      payload.projectId,
      payload.projectModuleId,
      payload.type,
      payload.taskCategory,
      payload.body,
    );
    yield put({type: 'SEGMENT_TYPE_WORK_ASSIGNMENT_USERS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'SEGMENT_TYPE_WORK_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

function* componentWorkAssignToUsers({payload}) {
  try {
    const response = yield componentsWorkAssignToUsersApi(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.componentId,
      payload.taskCategory,
      payload.body,
    );
    yield put({type: 'COMPONENT_WORK_ASSIGNMENT_USERS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'COMPONENT_WORK_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

function* subComponentWorkAssignToUsers({payload}) {
  try {
    const response = yield subComponentsWorkAssignToUsersApi(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.componentId,
      payload.subComponentId,
      payload.taskCategory,
      payload.body,
    );
    yield put({type: 'SUB_COMPONENT_WORK_ASSIGNMENT_USERS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'SUB_COMPONENT_WORK_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}

function* taskWorkAssignToUsers({payload}) {
  try {
    const response = yield tasksWorkAssignToUsersApi(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.componentId,
      payload.subComponentId,
      payload.taskId,
      payload.taskCategory,
      payload.body,
    );
    yield put({type: 'TASK_WORK_ASSIGNMENT_USERS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'TASK_WORK_ASSIGNMENT_USERS_FAILURE',
      error: error.message,
    });
  }
}
function* splitComponent({payload}) {
  try {
    console.log('projectModuleId:', payload.projectModuleId);
    console.log('splitTo:', payload.splitTo);
    console.log('body:', payload.body);
    const response = yield splitComponentApi(
      payload.projectModuleId,
      payload.splitTo,
      payload.body,
    );
    yield put({type: 'SPLIT_COMPONENT_SUCCESS', response});
  } catch (error) {
    console.error('💥 Split API Failed:', error);
    if (error.response) {
      console.error('💥 Server Response:', error.response.data);
    }

    yield put({type: 'SPLIT_COMPONENT_FAILURE', error: error.message});
  }
}

function* deleteSplitComponent({payload}) {
  try {
    const response = yield deleteSplitComponentApi(
      payload.projectModuleId,
      payload.type,
      payload.id,
    );
    yield put({
      type: 'DELETE_SPLIT_COMPONENT_SUCCESS',
      response,
      id: payload.id,
    });
  } catch (error) {
    yield put({type: 'DELETE_SPLIT_COMPONENT_FAILURE', error: error.message});
  }
}
function* getControlPoints({payload}) {
  try {
    const response = yield getControlPointsData(
      payload.projectId,
      payload.projectModuleId,
      payload.segmentId,
      payload.componentId,
      payload.taskCategory,
    );
    yield put({type: 'GET_CONTROL_POINTS_SUCCESS', response});
  } catch (error) {
    yield put({
      type: 'GET_CONTROL_POINTS_FAILURE',
      error: error.message,
    });
  }
}
export default function* userCategoriesAssignmentScreenSaga() {
  yield takeLatest('GET_USER_CATEGORY_REQUEST', getUserCategories);
  yield takeLatest('GET_USER_ASSIGNMENT_REQUEST', getUsers);
  yield takeLatest('ADD_USER_ASSIGNMENT_REQUEST', addUserCategories);
  yield takeLatest('GET_PROJECT_MODULES_REQUEST', getProjectModules);
  yield takeLatest(
    'GET_PROJECT_MODULE_SEGMENTS_REQUEST',
    getProjectModuleSegments,
  );
  yield takeLatest(
    'GET_PROJECT_MODULE_COMPONENTS_REQUEST',
    getProjectModuleComponents,
  );
  yield takeLatest(
    'GET_PROJECT_MODULE_SUB_COMPONENTS_REQUEST',
    getProjectModuleSubComponents,
  );
  yield takeLatest(
    'GET_PROJECT_MODULE_COMPONENTS_TASKS_REQUEST',
    getProjectModuleComponentTasks,
  );
  yield takeLatest(
    'GET_USERS_TO_WORK_ASSIGNMENT_REQUEST',
    getUsersForWorkAssignment,
  );
  yield takeLatest(
    'PROJECT_MODULE_WORK_ASSIGNMENT_USERS_REQUEST',
    projectModulesWorkAssignToUsers,
  );
  yield takeLatest(
    'SEGMENT_WORK_ASSIGNMENT_USERS_REQUEST',
    segmentsWorkAssignToUsers,
  );
  yield takeLatest(
    'SEGMENT_TYPE_WORK_ASSIGNMENT_USERS_REQUEST',
    segmentTypeWorkAssignToUsers,
  );
  yield takeLatest(
    'COMPONENT_WORK_ASSIGNMENT_USERS_REQUEST',
    componentWorkAssignToUsers,
  );
  yield takeLatest(
    'SUB_COMPONENT_WORK_ASSIGNMENT_USERS_REQUEST',
    subComponentWorkAssignToUsers,
  );
  yield takeLatest('TASK_WORK_ASSIGNMENT_USERS_REQUEST', taskWorkAssignToUsers);

  yield takeLatest(
    'GET_PROJECT_MODULE_SEGMENT_TASKS_REQUEST',
    getProjectModuleSegmentTasks,
  );
  yield takeLatest(
    'GET_PROJECT_MODULE_SUB_COMPONENT_TASKS_REQUEST',
    getProjectModuleSubComponentTasks,
  );
  yield takeLatest(
    'GET_PROJECT_MODULE_NEXT_LEVEL_REQUEST',
    getProjectModuleNextLevel,
  );
  yield takeLatest('SPLIT_COMPONENT_REQUEST', splitComponent);
  yield takeLatest('DELETE_SPLIT_COMPONENT_REQUEST', deleteSplitComponent);
  yield takeLatest('GET_CONTROL_POINTS_REQUEST', getControlPoints);
}

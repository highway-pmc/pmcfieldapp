import { all } from 'redux-saga/effects';
import loginScreenSaga from '../screens/Login/saga';
import forgotPasswordScreenSaga from '../screens/ForgotPassword/saga';
import userScreenSaga from '../screens/SetPassword/saga';
import userProfileScreenSaga from '../screens/Profile/saga';
import userCategoriesAssignmentScreenSaga from '../screens/ManageUsers/saga';

function* rootSaga() {
    yield all([
        loginScreenSaga(),
        forgotPasswordScreenSaga(),
        userScreenSaga(),
        userProfileScreenSaga(),
        userCategoriesAssignmentScreenSaga()
      ])
}

export default rootSaga;
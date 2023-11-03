import { all } from 'redux-saga/effects';
import loginScreenSaga from '../screens/Login/saga';
import forgotPasswordScreenSaga from '../screens/ForgotPassword/saga';
import userScreenSaga from '../screens/SetPassword/saga';
import userProfileScreenSaga from '../screens/Profile/saga';
import userCategoriesAssignmentScreenSaga from '../screens/ManageUsers/saga';
import projectInfoScreenSaga from '../screens/ProjectInfo/saga';
import changePassowrdScreenSaga from '../screens/ChangePassword/saga';
import myWorksScreenSaga from '../screens/MyWork/saga';
import projectHeadMyWorkAssignmentScreenSaga from '../screens/MyWorkProjectHead/saga';
import dashboardScreenSaga from '../screens/Dashboard/saga';
import myRFISScreenSaga from '../screens/RFIs/saga';

function* rootSaga() {
    yield all([
        loginScreenSaga(),
        forgotPasswordScreenSaga(),
        userScreenSaga(),
        userProfileScreenSaga(),
        userCategoriesAssignmentScreenSaga(),
        projectInfoScreenSaga(),
        changePassowrdScreenSaga(),
        myWorksScreenSaga(),
        projectHeadMyWorkAssignmentScreenSaga(),
        dashboardScreenSaga(),
        myRFISScreenSaga(),
      ])
}

export default rootSaga;
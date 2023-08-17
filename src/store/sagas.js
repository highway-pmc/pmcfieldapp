import { all } from 'redux-saga/effects';
import loginScreenSaga from '../screens/Login/saga';
import forgotPasswordScreenSaga from '../screens/ForgotPassword/saga';
import userScreenSaga from '../screens/SetPassword/saga';

function* rootSaga() {
    yield all([
        loginScreenSaga(),
        forgotPasswordScreenSaga(),
        userScreenSaga()
      ])
}

export default rootSaga;
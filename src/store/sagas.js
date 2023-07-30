import { all } from 'redux-saga/effects';
import loginScreenSaga from '../screens/Login/saga';
import forgotPasswordScreenSaga from '../screens/ForgotPassword/saga';

function* rootSaga() {
    yield all([
        loginScreenSaga(),
        forgotPasswordScreenSaga()
      ])
}

export default rootSaga;
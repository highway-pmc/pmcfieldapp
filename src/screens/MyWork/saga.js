
import { put, takeLatest } from 'redux-saga/effects';
import { getMyWorksData } from '../../services/my-works/myworks.service';

function* getMyWorks({ payload }) {
    try {
        const response = yield (getMyWorksData(payload));
        yield put({ type: "GET_MY_WORKS_SUCCESS", response });
    } catch (error) {
        yield put({ type: "GET_MY_WORKS_FAILURE", error: error.message });
    }
}

export default function* myWorksScreenSaga() {
    yield takeLatest("GET_MY_WORKS_REQUEST", getMyWorks);
}
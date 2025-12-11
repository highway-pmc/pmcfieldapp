import axios from 'axios';
import appConfig from '../common/app.config';

const apiService = {};

apiService.postRequest = (url, body, auth = true) => {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (auth) {
        headers['Authorization'] = appConfig.getToken();
    }
    return axios.post(`${appConfig.API_URL}/${url}`, body, { headers }).then((response) => {
        if (response.data.code === 200 || response.data.code === 201) {
            return response.data?.data;
        }
        console.log('==response.data==', response.data)
        throw new Error(response.data.message);
    }).catch((error) => {
        throw new Error(
            error.response?.data?.message
        );
    });
};

apiService.patchRequest = (url, body, auth = true) => {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (auth) {
        headers['Authorization'] = appConfig.getToken();
    }
    return axios.patch(`${appConfig.API_URL}/${url}`, body, { headers }).then((response) => {
        if (response.data.code === 200) {
            return response.data?.data;
        }

        throw new Error(response.data.message);
    }).catch((error) => {
        throw new Error(error.response?.data?.message);
    });
};

apiService.putRequest = (url, body, auth = true) => {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (auth) {
        headers['Authorization'] = appConfig.getToken();
    }
    return axios.put(`${appConfig.API_URL}/${url}`, body, { headers }).then((response) => {
        if (response.data.code === 200) {
            return response.data?.data;
        }

        throw new Error(response.data.message);
    }).catch((error) => {
        throw new Error(error.response?.data?.message);
    });
};

apiService.getRequest = (url, auth = true) => {
    axios.interceptors.request.use(request => {
        request.maxContentLength = Infinity;
        request.maxBodyLength = Infinity;
        return request;
    });

    let headers = {
        'Content-Type': 'application/json'
    }
    if (auth) {
        headers['Authorization'] = appConfig.getToken();
    }
    return axios.get(`${appConfig.API_URL}/${url}`, { headers }).then((response) => {
        return response.data?.data;
    }).catch((error) => {
        console.log('=====ERROR=====', error)
        throw new Error(error.response?.data?.message);
    });
};

apiService.deleteRequest = (url, auth = true) => {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (auth) {
        headers['Authorization'] = appConfig.getToken();
    }
    return axios.delete(`${appConfig.API_URL}/${url}`, { headers }).then((response) => {
        if (response.data.code === 200) {
            return response.data?.data;
        }

        throw new Error(response.data.message);
    }).catch((error) => {
        throw new Error(error.response?.data?.message);
    });
};

export default apiService;
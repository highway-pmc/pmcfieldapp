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
        if (response.data.code === 200) {
            return response.data?.data;
        }

        throw new Error(response.data.message);
    }).catch((error) => {
        console.log(error);
        throw new Error(error.response?.data?.message);
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

apiService.getRequest = (url, auth = true) => {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (auth) {
        headers['Authorization'] = appConfig.getToken();
    }
    return axios.get(`${appConfig.API_URL}/${url}`, { headers }).then((response) => {
        return response.data?.data;
        // return {
        //     _id: "64bcd25156b42faba9f88f77",
        //     name: "Pretty Zinta",
        //     email: "pretty.zinta@pmc.com",
        //     phone: "7599509238",
        //     isPasswordSet: true,
        //    // role: "project-head" // project-head, quality-head", "quality-users"
        //   };
    }).catch((error) => {
        throw new Error(error.response?.data?.message);
    });
};

export default apiService;